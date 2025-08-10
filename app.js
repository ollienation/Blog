import { blogPosts } from "./blogPosts.js";

/* ---------------------- Global State ---------------------- */
let currentTheme = "light";
let isTypingAnimationRunning = false;
let lastFocusedElement;
let markedInstance = null;
let isMermaidInitialized = false;
let focusableElements = [];

/* ---------------------- Theme Switcher ---------------------- */
function initTheme() {
  try {
    const htmlEl = document.documentElement;
    const themeToggle = document.getElementById("themeToggle");

    if (!themeToggle) {
      console.warn("Theme toggle button not found - theme switching disabled");
      return;
    }

    const sunIcon = themeToggle.querySelector(".sun-icon");
    const moonIcon = themeToggle.querySelector(".moon-icon");

    if (!sunIcon || !moonIcon) {
      console.warn("Theme icons not found - using fallback");
      // Continue with basic functionality even if icons are missing
    }

    // Get saved theme or use system preference
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    currentTheme = savedTheme || (systemPrefersDark ? "dark" : "light");

    const updateIcons = () => {
      if (sunIcon && moonIcon) {
        if (currentTheme === "dark") {
          sunIcon.classList.add("hidden");
          moonIcon.classList.remove("hidden");
        } else {
          sunIcon.classList.remove("hidden");
          moonIcon.classList.add("hidden");
        }
      }
    };

    const toggleTheme = (e) => {
      e.preventDefault();
      e.stopPropagation();

      currentTheme = currentTheme === "light" ? "dark" : "light";
      htmlEl.setAttribute("data-color-scheme", currentTheme);

      try {
        localStorage.setItem("theme", currentTheme);
      } catch (error) {
        console.warn("Could not save theme preference:", error);
      }

      updateIcons();
      console.log("Theme switched to:", currentTheme);
    };

    // Apply initial theme
    htmlEl.setAttribute("data-color-scheme", currentTheme);
    themeToggle.addEventListener("click", toggleTheme);
    updateIcons();

    console.log("Theme initialized:", currentTheme);
  } catch (error) {
    console.error("Theme initialization failed:", error);
  }
}

/* ---------------------- Typing Animation ---------------------- */
function initTypingAnimation() {
  try {
    const typingText = document.querySelector(".typing-text");

    if (!typingText) {
      console.warn("Typing text element not found - animation disabled");
      return;
    }

    if (isTypingAnimationRunning) {
      console.log("Typing animation already running");
      return;
    }

    const phrases = ["Welcome!", "Ideation", "AI", "Software Development"];
    let currentPhraseIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;

    const typingSpeed = 100;
    const deletingSpeed = 50;
    const pauseDuration = 2000;

    function typeEffect() {
      if (!isTypingAnimationRunning) return; // Allow stopping animation

      const currentPhrase = phrases[currentPhraseIndex];

      if (isDeleting) {
        typingText.textContent = currentPhrase.substring(
          0,
          currentCharIndex - 1,
        );
        currentCharIndex--;
      } else {
        typingText.textContent = currentPhrase.substring(
          0,
          currentCharIndex + 1,
        );
        currentCharIndex++;
      }

      let nextDelay = isDeleting ? deletingSpeed : typingSpeed;

      if (!isDeleting && currentCharIndex === currentPhrase.length) {
        nextDelay = pauseDuration;
        isDeleting = true;
      } else if (isDeleting && currentCharIndex === 0) {
        isDeleting = false;
        currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
      }

      setTimeout(typeEffect, nextDelay);
    }

    isTypingAnimationRunning = true;

    // Start typing animation after a brief delay
    setTimeout(typeEffect, 1000);
    console.log("Typing animation initialized");
  } catch (error) {
    console.error("Typing animation initialization failed:", error);
  }
}

/* ---------------------- Utility Functions ---------------------- */
function formatDate(dateString) {
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    console.warn("Date formatting failed for:", dateString);
    return dateString; // Return original if formatting fails
  }
}
/**
 * Dynamically loads and configures the 'marked' library.
 * This function ensures the library is loaded and configured only once.
 * @returns {Promise<object>} The configured marked instance.
 */
async function getMarkedInstance() {
  // If the instance already exists, return it immediately.
  if (markedInstance) {
    return markedInstance;
  }

  try {
    // Dynamically import the library.
    const { marked } = await import("marked");

    if (window.hljs) {
      marked.setOptions({
        highlight: function (code, lang) {
          const language = hljs.getLanguage(lang) ? lang : "plaintext";
          return hljs.highlight(code, { language }).value;
        },
        langPrefix: "hljs language-",
        gfm: true,
      });
      console.log("marked.js dynamically configured with highlight.js");
    } else {
      console.warn(
        "highlight.js not found; syntax highlighting will be disabled.",
      );
    }

    // Save the configured instance for future use.
    markedInstance = marked;
    return markedInstance;
  } catch (error) {
    console.error("Failed to load or configure marked.js:", error);
    // Return a fallback object to prevent the site from crashing.
    return { parse: (content) => content };
  }
}

function parseMarkdown(content) {
  try {
    // Convert Markdown to HTML
    const dirtyHtml = marked.parse(content || "");

    // Sanitize the generated HTML
    const cleanHtml = DOMPurify.sanitize(dirtyHtml);

    return cleanHtml;
  } catch (error) {
    console.error("Markdown parsing failed:", error);
    return content;
  }
}

/* ---------------------- Blog Functionality ---------------------- */
function renderBlogPosts() {
  try {
    const grid = document.getElementById("blogGrid");
    if (!grid) {
      console.error("Blog grid element not found");
      return;
    }

    if (!blogPosts || !Array.isArray(blogPosts) || blogPosts.length === 0) {
      console.warn("No blog posts available to render");
      grid.innerHTML = "<p>No blog posts available at the moment.</p>";
      return;
    }

    // Clear existing content before rendering
    grid.innerHTML = "";

    blogPosts.forEach((post, idx) => {
      try {
        // --- Refactored DOM Creation ---

        // 1. Create the main card container
        const card = document.createElement("div");
        card.className = "card-post";
        card.setAttribute("data-post-id", post.id);

        // 2. Create the title element
        const title = document.createElement("h3");
        title.textContent = post.title;

        // 3. Create the metadata element
        const meta = document.createElement("div");
        meta.className = "post-meta";
        meta.textContent = `${formatDate(post.date)} | ${post.readTime}`;

        // 4. Create the excerpt element
        const excerpt = document.createElement("p");
        excerpt.textContent = post.excerpt || "No excerpt available";

        // 5. Create the tags container and individual tags
        const tagsContainer = document.createElement("div");
        tagsContainer.className = "post-tags";
        if (post.tags && Array.isArray(post.tags)) {
          post.tags.forEach((tagText) => {
            const tagElement = document.createElement("span");
            tagElement.className = "tag";
            tagElement.textContent = tagText;
            tagsContainer.appendChild(tagElement);
          });
        }

        // 6. Append all created elements to the card
        card.append(title, meta, excerpt, tagsContainer);

        // 7. Add the click event listener
        card.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          openBlogModal(post);
          console.log("Blog card clicked:", post.title);
        });

        // 8. Append the fully constructed card to the grid
        grid.appendChild(card);

        // 9. Trigger the entrance animation
        // Note: The transition is defined in CSS on the .card-post class
        setTimeout(() => {
          card.classList.add("visible");
        }, idx * 100);
      } catch (error) {
        console.error("Error rendering individual blog post:", post, error);
      }
    });

    console.log("Blog posts rendered:", blogPosts.length);
  } catch (error) {
    console.error("Blog rendering failed:", error);
  }
}

/* ---------------------- Blog Modal ---------------------- */
async function openBlogModal(post) {
  if (!post) return;

  lastFocusedElement = document.activeElement;
  const modal = document.getElementById("blogModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalBody = document.getElementById("modalBody");
  const modalMeta = document.getElementById("modalMeta");

  if (modalTitle) modalTitle.textContent = post.title;
  if (modalMeta) {
    const authorSpan = document.createElement("span");
    authorSpan.textContent = post.author;
    const dateSpan = document.createElement("span");
    dateSpan.textContent = formatDate(post.date);
    const readTimeSpan = document.createElement("span");
    readTimeSpan.textContent = post.readTime;
    modalMeta.replaceChildren(authorSpan, dateSpan, readTimeSpan);
  }

  if (modalBody) {
    const marked = await getMarkedInstance();
    const { default: DOMPurify } = await import("dompurify");
    const { default: hljs } = await import("highlight.js");
    const dirtyHtml = marked.parse(post.content || "");
    const cleanHtml = DOMPurify.sanitize(dirtyHtml);

    modalBody.innerHTML = cleanHtml;

    modalBody
      .querySelectorAll("pre code:not(.language-mermaid)")
      .forEach((block) => {
        hljs.highlightElement(block);
      });

    await renderMermaidDiagrams(modalBody);
    // -----------
  }

  // --- (The rest of the function for showing the modal and trapping focus remains the same) ---
  if (modal) {
    const focusableElementsSelector =
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    focusableElements = Array.from(
      modal.querySelectorAll(focusableElementsSelector),
    );
    modal.classList.remove("hidden");
    document.body.classList.add("modal-open");
    const modalCloseButton = document.getElementById("modalClose");
    if (modalCloseButton) {
      modalCloseButton.focus();
    }
  }
}

function closeBlogModal() {
  try {
    const modal = document.getElementById("blogModal");

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

/* ---------------------- Utility Functions ---------------------- */
function initModalHandlers() {
  try {
    const modal = document.getElementById("blogModal");
    const modalClose = document.getElementById("modalClose");
    const modalBackdrop = modal?.querySelector(".modal-backdrop");

    // --- Focus Trapping Logic ---
    const trapFocus = (e) => {
      // This now correctly references the GLOBAL focusableElements array.
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
    document.addEventListener("keydown", (e) => {
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

async function renderMermaidDiagrams(container) {
  // Find all code blocks marked with the 'mermaid' language by the 'marked' parser.
  const mermaidCodeBlocks = container.querySelectorAll("code.language-mermaid");

  if (mermaidCodeBlocks.length === 0) {
    return; // Exit early if there are no diagrams to render.
  }

  try {
    const { default: mermaid } = await import("mermaid");

    if (!isMermaidInitialized) {
      mermaid.initialize({
        startOnLoad: false,
        theme: "neutral", // A good base theme for light/dark modes
        securityLevel: "strict", // Recommended for security
      });
      isMermaidInitialized = true;
      console.log("Mermaid.js dynamically initialized.");
    }

    // Process each Mermaid block individually and asynchronously.
    const renderPromises = Array.from(mermaidCodeBlocks).map(
      async (codeElement, index) => {
        const diagramId = `mermaid-diagram-${Date.now()}-${index}`;
        const diagramDefinition = codeElement.textContent || "";
        const parentPreElement = codeElement.parentElement; // The <pre> tag wrapping the code block

        try {
          // Use the Mermaid API to render the diagram definition into SVG markup.
          const { svg } = await mermaid.render(diagramId, diagramDefinition);

          // Create a styled container for the diagram.
          const diagramContainer = document.createElement("div");
          diagramContainer.classList.add("mermaid-diagram-container");
          diagramContainer.innerHTML = svg;

          // Replace the original <pre> block with the rendered SVG container.
          if (parentPreElement) {
            parentPreElement.replaceWith(diagramContainer);
          }
        } catch (error) {
          console.error(`Failed to render Mermaid diagram ${index}:`, error);
          // Optionally display an error message in the UI.
          if (parentPreElement) {
            parentPreElement.innerHTML = "Error: Failed to render diagram.";
            parentPreElement.style.color = "red";
          }
        }
      },
    );

    await Promise.all(renderPromises);
    console.log(
      `Processed and rendered ${mermaidCodeBlocks.length} Mermaid diagram(s).`,
    );
  } catch (error) {
    console.error("Failed to load or run Mermaid.js:", error);
  }
}

function initScrollBehavior() {
  try {
    // Smooth scroll for navigation links
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

    navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = link.getAttribute("href");
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    });

    // Hero CTA buttons
    const ctaButtons = document.querySelectorAll('.hero-cta a[href^="#"]');

    ctaButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = button.getAttribute("href");
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    });

    // Hero scroll down arrow
    const arrow = document.querySelector(".scroll-arrow");

    if (arrow) {
      arrow.addEventListener("click", (e) => {
        e.preventDefault();
        document
          .getElementById("about")
          .scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }

    console.log("Scroll behavior initialized");
  } catch (error) {
    console.error("Scroll behavior initialization failed:", error);
  }
}

/* ---------------------- Main Initialization ---------------------- */
function initApp() {
  console.log("Initializing blog application...");

  try {
    // Initialize all components
    initTheme();
    initTypingAnimation();
    initModalHandlers();
    initScrollBehavior();
    renderBlogPosts();

    console.log("Blog application initialized successfully");
  } catch (error) {
    console.error("Application initialization failed:", error);
  }
}

/* ---------------------- Application Entry Point ---------------------- */
// Wait for DOM to be fully loaded before initializing
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  // DOM is already loaded
  initApp();
}

// Export functions for potential external use
export {
  initTheme,
  initTypingAnimation,
  renderBlogPosts,
  openBlogModal,
  closeBlogModal,
  initApp,
};
