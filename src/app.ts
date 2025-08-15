import { blogPosts } from "@assets/blogPosts";
import type { BlogPost } from "./types";

// Import utilities
import { initTheme } from "./utils/themeUtils";
import { initTypingAnimation } from "./utils/typingUtils";
import { initScrollBehavior } from "./utils/scrollUtils";
import { renderBlogPosts } from "./utils/blogUtils";
import {
  initModalHandlers,
  openBlogModal,
  closeBlogModal,
} from "./utils/modalUtils";

/**
 * Initialize all application components
 */
function initApp(): void {
  console.log("Initializing blog application...");

  try {
    // Initialize all components
    initTheme();
    initTypingAnimation();
    initModalHandlers();
    initScrollBehavior();

    // Render blog posts with proper typing
    const typedBlogPosts = blogPosts as BlogPost[];
    renderBlogPosts(typedBlogPosts, (post: BlogPost) => {
      openBlogModal(post);
    });

    console.log("Blog application initialized successfully");
  } catch (error) {
    console.error("Application initialization failed:", error);
  }
}

/**
 * Application entry point
 * Wait for DOM to be fully loaded before initializing
 */
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  // DOM is already loaded
  initApp();
}

// Export functions for potential external use and testing
export {
  initTheme,
  initTypingAnimation,
  renderBlogPosts,
  openBlogModal,
  closeBlogModal,
  initApp,
};
