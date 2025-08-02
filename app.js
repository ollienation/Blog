import { blogPosts } from "./blogPosts.js";

/* ---------------------- Global State ---------------------- */
let currentTheme = "light";
let isTypingAnimationRunning = false;

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

function parseMarkdown(content) {
  try {
    return content
      .replace(/^# (.*$)/gim, "<h1>$1</h1>")
      .replace(/^## (.*$)/gim, "<h2>$1</h2>")
      .replace(/^### (.*$)/gim, "<h3>$1</h3>")
      .replace(/^- (.*$)/gim, "<li>$1</li>")
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/`(.*?)`/g, "<code>$1</code>")
      .replace(/\n\n/g, "</p><p>")
      .replace(/^(?!<[hul]|<p>)/gm, "<p>")
      .replace(/$/gm, "</p>")
      .replace(/<p><\/p>/g, "")
      .replace(/(<\/[hul]i?>)<p>/g, "$1")
      .replace(/<\/p>(<[hul])/g, "$1");
  } catch (error) {
    console.error("Markdown parsing failed:", error);
    return content; // Return original content if parsing fails
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
      grid.innerHTML =
        '<p class="no-posts">No blog posts available at the moment.</p>';
      return;
    }

    // Clear existing content
    grid.innerHTML = "";

    blogPosts.forEach((post, idx) => {
      try {
        const card = document.createElement("div");
        card.className = "card-post";
        card.style.transitionDelay = `${idx * 150}ms`;
        card.setAttribute("data-post-id", post.id);

        // Safely generate tags HTML
        const tagsHtml = (post.tags || [])
          .map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`)
          .join("");

        card.innerHTML = `
          <h3>${escapeHtml(post.title || "Untitled")}</h3>
          <div class="post-meta">
            <span>${formatDate(post.date || new Date().toISOString())}</span>
            <span>${escapeHtml(post.readTime || "Unknown read time")}</span>
          </div>
          <p>${escapeHtml(post.excerpt || "No excerpt available")}</p>
          <div class="post-tags">
            ${tagsHtml}
          </div>
        `;

        card.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          openBlogModal(post);
          console.log("Blog card clicked:", post.title);
        });

        grid.appendChild(card);

        // Trigger animation after a brief delay
        setTimeout(() => {
          card.classList.add("visible");
        }, idx * 100);
      } catch (error) {
        console.error("Error rendering blog post:", post, error);
      }
    });

    console.log("Blog posts rendered:", blogPosts.length);
  } catch (error) {
    console.error("Blog rendering failed:", error);
  }
}

/* ---------------------- Blog Modal ---------------------- */
function openBlogModal(post) {
  try {
    const modal = document.getElementById("blogModal");
    const modalBody = document.getElementById("modalBody");

    if (!modal || !modalBody) {
      console.error("Modal elements not found");
      return;
    }

    const tagsHtml = (post.tags || [])
      .map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`)
      .join("");

    const contentHtml = parseMarkdown(post.content || "No content available");

    modalBody.innerHTML = `
      <article class="blog-post">
        <header class="post-header">
          <h1>${escapeHtml(post.title || "Untitled")}</h1>
          <div class="post-meta">
            <span class="post-date">${formatDate(post.date || new Date().toISOString())}</span>
            <span class="post-read-time">${escapeHtml(post.readTime || "Unknown read time")}</span>
            <span class="post-author">by ${escapeHtml(post.author || "Unknown")}</span>
          </div>
          <div class="post-tags">
            ${tagsHtml}
          </div>
        </header>
        <div class="post-content">
          ${contentHtml}
        </div>
      </article>
    `;

    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden"; // Prevent background scrolling

    console.log("Modal opened for:", post.title);
  } catch (error) {
    console.error("Modal opening failed:", error);
  }
}

function closeBlogModal() {
  try {
    const modal = document.getElementById("blogModal");

    if (modal) {
      modal.classList.add("hidden");
      document.body.style.overflow = ""; // Restore scrolling
      console.log("Modal closed");
    }
  } catch (error) {
    console.error("Modal closing failed:", error);
  }
}

/* ---------------------- Utility Functions ---------------------- */
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function initModalHandlers() {
  try {
    const modal = document.getElementById("blogModal");
    const modalClose = document.getElementById("modalClose");
    const modalBackdrop = modal?.querySelector(".modal-backdrop");

    if (modalClose) {
      modalClose.addEventListener("click", closeBlogModal);
    }

    if (modalBackdrop) {
      modalBackdrop.addEventListener("click", closeBlogModal);
    }

    // ESC key handler
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal && !modal.classList.contains("hidden")) {
        closeBlogModal();
      }
    });

    console.log("Modal handlers initialized");
  } catch (error) {
    console.error("Modal handlers initialization failed:", error);
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
