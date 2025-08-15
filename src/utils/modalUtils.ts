import type { BlogPost } from "../types";
import { libraryLoader } from "./libraryLoader";

import { Marked } from "marked";
import { markedHighlight } from "marked-highlight";

let lastFocusedElement: HTMLElement | null = null;
let isMermaidInitialized = false;
let focusableElements: HTMLElement[] = [];

// Configure marked with highlighting extension
const md = new Marked(); // Use class instance instead of marked.Marked
md.use(
  markedHighlight({
    langPrefix: "hljs language-",
    async: true, // Enable async for promise-based highlighting[^1]
    highlight: async (code, lang) => {
      const hljs = await libraryLoader.loadHighlightJS(); // Await promise to get actual HLJS instance[^2][^3]
      const language = hljs.getLanguage(lang) ? lang : "plaintext";
      return hljs.highlight(code, { language }).value;
    },
  }),
);

async function renderMermaidDiagrams(container: HTMLElement): Promise<void> {
  const mermaidCodeBlocks = container.querySelectorAll("code.language-mermaid");
  if (mermaidCodeBlocks.length === 0) {
    return; // Exit early - no Mermaid needed
  }

  try {
    // Only load Mermaid when diagrams are actually present
    const mermaid = await libraryLoader.loadMermaid();

    if (!isMermaidInitialized) {
      mermaid.initialize({
        startOnLoad: false,
        theme: "neutral",
        securityLevel: "strict",
      });
      isMermaidInitialized = true;
    }

    // Render diagrams with error handling per diagram
    const renderPromises = Array.from(mermaidCodeBlocks).map(
      async (codeElement, index) => {
        const diagramId = `mermaid-diagram-${Date.now()}-${index}`;
        const diagramDefinition = codeElement.textContent || "";
        const parentPreElement = codeElement.parentElement;

        try {
          const { svg } = await mermaid.render(diagramId, diagramDefinition);
          const diagramContainer = document.createElement("div");
          diagramContainer.classList.add("mermaid-diagram-container");
          diagramContainer.innerHTML = svg;

          if (parentPreElement) {
            parentPreElement.replaceWith(diagramContainer);
          }
        } catch (diagramError: unknown) {
          console.error(`Mermaid diagram ${index} failed:`, diagramError);
          if (parentPreElement) {
            const errorMessage =
              diagramError instanceof Error
                ? diagramError.message
                : "Unknown error";
            parentPreElement.innerHTML = `<div class="error-message">⚠️ Diagram rendering failed: ${errorMessage}</div>`;
          }
        }
      },
    );

    await Promise.all(renderPromises);
    console.log(`Rendered ${mermaidCodeBlocks.length} Mermaid diagrams`);
  } catch (error) {
    console.error("Failed to load Mermaid library:", error);
    // Graceful fallback - show original code blocks
  }
}

export function initModalHandlers(): void {
  try {
    const modal = document.getElementById("blogModal") as HTMLElement | null;
    const modalClose = document.getElementById(
      "modalClose",
    ) as HTMLElement | null;
    const modalBackdrop = modal?.querySelector(
      ".modal-backdrop",
    ) as HTMLElement | null;

    // Focus trapping logic
    const trapFocus = (e: KeyboardEvent): void => {
      if (e.key !== "Tab" || focusableElements.length === 0) return;

      const firstFocusableElement = focusableElements[0];
      const lastFocusableElement =
        focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstFocusableElement) {
          lastFocusableElement.focus();
          e.preventDefault();
        }
      } else {
        // Tab
        if (document.activeElement === lastFocusableElement) {
          firstFocusableElement.focus();
          e.preventDefault();
        }
      }
    };

    if (modalClose) {
      modalClose.addEventListener("click", closeBlogModal);
    }

    if (modalBackdrop) {
      modalBackdrop.addEventListener("click", closeBlogModal);
    }

    // ESC key and Tab trapping
    document.addEventListener("keydown", (e: KeyboardEvent) => {
      if (modal && !modal.classList.contains("hidden")) {
        if (e.key === "Escape") {
          closeBlogModal();
        }
        // Add focus trapping listener
        trapFocus(e);
      }
    });

    console.log("Modal handlers initialized");
  } catch (error) {
    console.error("Modal handlers initialization failed:", error);
  }
}

export async function openBlogModal(post: BlogPost): Promise<void> {
  if (!post) return;

  lastFocusedElement = document.activeElement as HTMLElement;
  const modal = document.getElementById("blogModal") as HTMLElement | null;
  const modalBody = document.getElementById("modalBody") as HTMLElement | null;

  // Show loading state
  if (modalBody) {
    modalBody.innerHTML = `<div class="loading-state"><div class="loading-spinner"></div><p>Loading content...</p></div>`;
  }

  try {
    // Load libraries in parallel but only when needed
    const [DOMPurify] = await Promise.all([
      libraryLoader.loadDOMPurify(),
      // hljs is already used in markedHighlight, no separate load needed here unless custom
    ]);

    // Parse and sanitize content using configured md
    const dirtyHtml = await md.parse(post.content || "");
    const cleanHtml = DOMPurify.sanitize(dirtyHtml);

    if (modalBody) {
      modalBody.innerHTML = cleanHtml;

      // No need for separate highlighting; it's handled by markedHighlight

      // Load Mermaid only if diagrams are present
      await renderMermaidDiagrams(modalBody);
    }

    // Show modal and handle focus
    if (modal) {
      modal.classList.remove("hidden");
      document.body.classList.add("modal-open");

      const modalCloseButton = document.getElementById(
        "modalClose",
      ) as HTMLElement | null;
      if (modalCloseButton) {
        modalCloseButton.focus();
      }
    }
  } catch (error) {
    console.error("Failed to load blog content:", error);
    if (modalBody) {
      modalBody.innerHTML = `<div class="error-state"><p>Failed to load content. Please try again.</p></div>`;
    }
  }
}

export function closeBlogModal(): void {
  try {
    const modal = document.getElementById("blogModal") as HTMLElement | null;

    if (modal) {
      modal.classList.add("hidden");
      document.body.classList.remove("modal-open");
      console.log("Modal closed");

      if (lastFocusedElement) {
        lastFocusedElement.focus();
      }
    }
  } catch (error) {
    console.error("Modal closing failed:", error);
  }
}

export function getLastFocusedElement(): HTMLElement | null {
  return lastFocusedElement;
}

export function setFocusableElements(elements: HTMLElement[]): void {
  focusableElements = elements;
}
