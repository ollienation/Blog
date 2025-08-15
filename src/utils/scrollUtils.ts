export function initScrollBehavior(): void {
  try {
    // Smooth scroll for navigation links
    const navLinks = document.querySelectorAll(
      '.nav-link[href^="#"]',
    ) as NodeListOf<HTMLAnchorElement>;

    navLinks.forEach((link) => {
      link.addEventListener("click", (e: Event) => {
        e.preventDefault();
        const targetId = link.getAttribute("href");

        if (targetId) {
          const targetElement = document.querySelector(targetId) as HTMLElement;

          if (targetElement) {
            targetElement.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        }
      });
    });

    // Hero CTA buttons
    const ctaButtons = document.querySelectorAll(
      '.hero-cta a[href^="#"]',
    ) as NodeListOf<HTMLAnchorElement>;

    ctaButtons.forEach((button) => {
      button.addEventListener("click", (e: Event) => {
        e.preventDefault();
        const targetId = button.getAttribute("href");

        if (targetId) {
          const targetElement = document.querySelector(targetId) as HTMLElement;

          if (targetElement) {
            targetElement.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        }
      });
    });

    // Hero scroll down arrow
    const arrow = document.querySelector(".scroll-arrow") as HTMLElement;

    if (arrow) {
      arrow.addEventListener("click", (e: Event) => {
        e.preventDefault();
        const aboutSection = document.getElementById("about");

        if (aboutSection) {
          aboutSection.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    }

    console.log("Scroll behavior initialized");
  } catch (error) {
    console.error("Scroll behavior initialization failed:", error);
  }
}

export function scrollToElement(
  elementId: string,
  behavior: ScrollBehavior = "smooth",
): void {
  const element = document.getElementById(elementId);

  if (element) {
    element.scrollIntoView({
      behavior,
      block: "start",
    });
  } else {
    console.warn(`Element with id "${elementId}" not found`);
  }
}

export function scrollToTop(behavior: ScrollBehavior = "smooth"): void {
  window.scrollTo({
    top: 0,
    behavior,
  });
}

export function getScrollPosition(): { x: number; y: number } {
  return {
    x: window.pageXOffset || document.documentElement.scrollLeft,
    y: window.pageYOffset || document.documentElement.scrollTop,
  };
}

export function isElementInViewport(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}
