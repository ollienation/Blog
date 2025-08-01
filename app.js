/* --- Data Source --- */
const blogPosts = [
  {
    id: 1,
    title: "Welcome to my blog 🌊",
    excerpt:
      "Born too late to explore the earth and too early for the stars, so I'm exploring what's here.",
    content:
      "# Building a Secure Personal Cloud with AWS and Cloudflare\n\nIn today's digital landscape, privacy and security are paramount. This comprehensive guide walks you through setting up a personal cloud infrastructure that prioritizes security without sacrificing functionality.\n\n## Architecture Overview\n\nOur setup consists of:\n- AWS EC2 instance for web hosting\n- Home server for media and file storage\n- Cloudflare Tunnels for secure connectivity\n- Multi-factor authentication via Cognito\n\n## Security Layers\n\n### 1. Network Security\n- All traffic routed through Cloudflare's edge network\n- Zero inbound ports on home router\n- DDoS protection and bot mitigation\n\n### 2. Application Security\n- Web Application Firewall (WAF)\n- Rate limiting on authentication endpoints\n- HTTPS everywhere with automatic certificate management\n\n### 3. Identity and Access Management\n- AWS Cognito for user management\n- Multi-factor authentication required\n- Session management with secure tokens\n\n## Implementation Steps\n\n1. **Set up the AWS environment**\n2. **Configure Cloudflare services**\n3. **Deploy security policies**\n4. **Test and monitor**\n\nThis setup provides enterprise-grade security for your personal digital assets while maintaining ease of use and management.",
    date: "2024-12-15",
    readTime: "8 min read",
    tags: ["Introduction", "Techstack", "Personal"],
    author: "Oliver",
  },
];

/* ---------------------- Theme Switcher ---------------------- */
let currentTheme = "light";

function initTheme() {
  const htmlEl = document.documentElement;
  const themeToggle = document.getElementById("themeToggle");

  if (!themeToggle) {
    console.error("Theme toggle button not found");
    return;
  }

  const sunIcon = themeToggle.querySelector(".sun-icon");
  const moonIcon = themeToggle.querySelector(".moon-icon");

  if (!sunIcon || !moonIcon) {
    console.error("Theme icons not found");
    return;
  }

  // Get saved theme or use system preference
  const savedTheme = localStorage.getItem("theme");
  const systemPrefersDark = window.matchMedia(
    "(prefers-color-scheme: dark)",
  ).matches;
  currentTheme = savedTheme || (systemPrefersDark ? "dark" : "light");

  const updateIcons = () => {
    if (currentTheme === "dark") {
      sunIcon.classList.add("hidden");
      moonIcon.classList.remove("hidden");
    } else {
      sunIcon.classList.remove("hidden");
      moonIcon.classList.add("hidden");
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
}

/* ---------------------- Typing Animation ---------------------- */
function initTypingAnimation() {
  const typingText = document.querySelector(".typing-text");
  if (!typingText) {
    console.error("Typing text element not found");
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
    const currentPhrase = phrases[currentPhraseIndex];

    if (isDeleting) {
      typingText.textContent = currentPhrase.substring(0, currentCharIndex - 1);
      currentCharIndex--;
    } else {
      typingText.textContent = currentPhrase.substring(0, currentCharIndex + 1);
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

  // Start typing animation after a brief delay
  setTimeout(typeEffect, 1000);
  console.log("Typing animation initialized");
}

/* ---------------------- Blog Functionality ---------------------- */
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function parseMarkdown(content) {
  return content
    .replace(/^# (.*$)/gim, "<h1>$1</h1>")
    .replace(/^## (.*$)/gim, "<h2>$1</h2>")
    .replace(/^### (.*$)/gim, "<h3>$1</h3>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/`(.*?)`/g, "<code>$1</code>")
    .replace(/^- (.*$)/gim, "<li>$1</li>")
    .replace(/(<li>.*<\/li>)/s, "<ul>$1</ul>")
    .replace(/\n\n/g, "</p><p>")
    .replace(/^(?!<[hul])/gm, "<p>")
    .replace(/(?<!>)$/gm, "</p>")
    .replace(/<p><\/p>/g, "");
}

function renderBlogPosts() {
  const grid = document.getElementById("blogGrid");
  if (!grid) {
    console.error("Blog grid not found");
    return;
  }

  blogPosts.forEach((post, idx) => {
    const card = document.createElement("div");
    card.className = "card-post";
    card.style.transitionDelay = `${idx * 150}ms`;
    card.setAttribute("data-post-id", post.id);

    const tagsHtml = post.tags
      .map((tag) => `<span class="tag">${tag}</span>`)
      .join("");

    card.innerHTML = `
      <h3>${post.title}</h3>
      <div class="post-meta">
        <span>${formatDate(post.date)}</span>
        <span>•</span>
        <span>${post.readTime}</span>
        <span>•</span>
        <span>By ${post.author}</span>
      </div>
      <p>${post.excerpt}</p>
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
  });

  console.log("Blog posts rendered:", blogPosts.length);
}

/* ---------------------- Blog Modal ---------------------- */
function openBlogModal(post) {
  const modal = document.getElementById("blogModal");
  const modalBody = document.getElementById("modalBody");

  if (!modal || !modalBody) {
    console.error("Modal elements not found");
    return;
  }

  const tagsHtml = post.tags
    .map((tag) => `<span class="tag">${tag}</span>`)
    .join("");
  const contentHtml = parseMarkdown(post.content);

  modalBody.innerHTML = `
    <h1>${post.title}</h1>
    <div class="post-meta">
      <span>${formatDate(post.date)}</span>
      <span>•</span>
      <span>${post.readTime}</span>
      <span>•</span>
      <span>By ${post.author}</span>
      <div class="post-tags" style="margin-left: auto;">
        ${tagsHtml}
      </div>
    </div>
    <div class="post-content">
      ${contentHtml}
    </div>
  `;

  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
  console.log("Blog modal opened:", post.title);
}

function closeBlogModal() {
  const modal = document.getElementById("blogModal");
  if (!modal) {
    console.error("Modal not found");
    return;
  }

  modal.classList.add("hidden");
  document.body.style.overflow = "";
  console.log("Blog modal closed");
}

function initBlogModal() {
  const modalClose = document.getElementById("modalClose");
  const modalBackdrop = document.getElementById("modalBackdrop");

  if (modalClose) {
    modalClose.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeBlogModal();
    });
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeBlogModal();
    });
  }

  // Close modal with Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeBlogModal();
    }
  });

  console.log("Blog modal initialized");
}

/* ---------------------- Scroll Animations ---------------------- */
function initScrollAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -40px 0px",
    },
  );

  // Observe blog cards and other animated elements
  setTimeout(() => {
    const cards = document.querySelectorAll(".card-post");
    const skillTags = document.querySelectorAll(".skill-tag");
    const contactLinks = document.querySelectorAll(".contact-link");

    [...cards, ...skillTags, ...contactLinks].forEach((el) =>
      observer.observe(el),
    );
    console.log(
      "Scroll animations initialized for",
      cards.length + skillTags.length + contactLinks.length,
      "elements",
    );
  }, 100);
}

/* ---------------------- Navigation ---------------------- */
function smoothScrollToSection(targetId) {
  const targetSection = document.querySelector(targetId);
  if (!targetSection) {
    console.error("Target section not found:", targetId);
    return;
  }

  targetSection.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
  console.log("Scrolled to section:", targetId);
}

function initNavigation() {
  // Navigation links
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      const targetId = link.getAttribute("href");
      smoothScrollToSection(targetId);

      // Update active state
      document
        .querySelectorAll(".nav-link")
        .forEach((l) => l.classList.remove("active"));
      link.classList.add("active");

      console.log("Navigation link clicked:", targetId);
    });
  });

  // Hero CTA buttons
  document.querySelectorAll(".hero-cta a").forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (href && href.startsWith("#")) {
        e.preventDefault();
        e.stopPropagation();
        smoothScrollToSection(href);
        console.log("CTA button clicked:", href);
      }
    });
  });

  // Scroll arrow
  const scrollArrow = document.getElementById("scrollArrow");
  if (scrollArrow) {
    scrollArrow.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      smoothScrollToSection("#about");
      console.log("Scroll arrow clicked");
    });
  } else {
    console.error("Scroll arrow not found");
  }

  // Update active navigation on scroll
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  function updateActiveNav() {
    let current = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 100;
      if (window.pageYOffset >= sectionTop) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", updateActiveNav, { passive: true });
  updateActiveNav(); // Initial call

  console.log("Navigation initialized");
}

/* ---------------------- Header Scroll Effect ---------------------- */
function initHeaderScrollEffect() {
  const header = document.querySelector(".header");
  if (!header) {
    console.error("Header not found");
    return;
  }

  function updateHeader() {
    const currentScrollY = window.pageYOffset;

    if (currentScrollY > 100) {
      header.style.backgroundColor = `rgba(var(--color-surface), 0.95)`;
    } else {
      header.style.backgroundColor = `rgba(var(--color-surface), 0.8)`;
    }
  }

  window.addEventListener("scroll", updateHeader, { passive: true });
  console.log("Header scroll effect initialized");
}

/* ---------------------- Particles Animation ---------------------- */
function initParticles() {
  const particlesContainer = document.querySelector(".hero-particles");
  if (!particlesContainer) {
    console.error("Particles container not found");
    return;
  }

  // Create additional floating particles
  for (let i = 0; i < 3; i++) {
    const particle = document.createElement("div");
    particle.style.position = "absolute";
    particle.style.width = "3px";
    particle.style.height = "3px";
    particle.style.background = "var(--color-primary)";
    particle.style.borderRadius = "50%";
    particle.style.opacity = "0.6";

    // Random position
    particle.style.top = Math.random() * 80 + 10 + "%";
    particle.style.left = Math.random() * 80 + 10 + "%";

    // Random animation
    const duration = 3 + Math.random() * 4;
    particle.style.animation = `float${(i % 2) + 1} ${duration}s ease-in-out infinite`;
    particle.style.animationDelay = Math.random() * 2 + "s";

    particlesContainer.appendChild(particle);
  }

  console.log("Particles initialized");
}

/* ---------------------- Initialize Everything ---------------------- */
function initApp() {
  console.log("Initializing app...");

  try {
    initTheme();
    initTypingAnimation();
    renderBlogPosts();
    initBlogModal();
    initScrollAnimations();
    initNavigation();
    initHeaderScrollEffect();
    initParticles();

    // Trigger entrance animations
    setTimeout(() => {
      document.body.classList.add("loaded");
    }, 100);

    console.log("App initialization complete");
  } catch (error) {
    console.error("Error during app initialization:", error);
  }
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}

// Handle page visibility change
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    // Re-trigger animations when page becomes visible
    setTimeout(() => {
      const cards = document.querySelectorAll(".card-post:not(.visible)");
      cards.forEach((card, idx) => {
        setTimeout(() => card.classList.add("visible"), idx * 100);
      });
    }, 100);
  }
});
