import type { Theme } from "../types";

let currentTheme: Theme = "light";

export function getCurrentTheme(): Theme {
  return currentTheme;
}

export function initTheme(): void {
  try {
    const htmlEl = document.documentElement;
    const themeToggle = document.getElementById("themeToggle");

    if (!themeToggle) {
      console.warn("Theme toggle button not found - theme switching disabled");
      return;
    }

    const sunIcon = themeToggle.querySelector(".sun-icon") as HTMLElement;
    const moonIcon = themeToggle.querySelector(".moon-icon") as HTMLElement;

    if (!sunIcon || !moonIcon) {
      console.warn("Theme icons not found - using fallback");
      // Continue with basic functionality even if icons are missing
    }

    // Get saved theme or use system preference
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    currentTheme = savedTheme || (systemPrefersDark ? "dark" : "light");

    const updateIcons = (): void => {
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

    const toggleTheme = (e: Event): void => {
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
