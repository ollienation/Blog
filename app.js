/* --- Data Source --- */
const blogPosts = [
  {
    title: "Welcome to my blog",
    date: "2025-07-29",
    excerpt:
      "This is the very first post on my new personal site. Stay tuned for tech deep dives and movie reviews!",
  },
];

/* ---------------------- Theme Switcher ---------------------- */
let currentTheme = "light"; // default
function initTheme() {
  const htmlEl = document.documentElement;
  const themeToggle = document.getElementById("themeToggle");
  if (!themeToggle) return; // safety guard

  const sunIcon = themeToggle.querySelector(".sun-icon");
  const moonIcon = themeToggle.querySelector(".moon-icon");

  // Determine initial theme from attribute or system preference
  currentTheme = htmlEl.getAttribute("data-color-scheme") || "light";

  const updateIcons = () => {
    if (currentTheme === "dark") {
      sunIcon.classList.add("hidden");
      moonIcon.classList.remove("hidden");
    } else {
      sunIcon.classList.remove("hidden");
      moonIcon.classList.add("hidden");
    }
  };

  const toggleTheme = () => {
    currentTheme = currentTheme === "light" ? "dark" : "light";
    htmlEl.setAttribute("data-color-scheme", currentTheme);
    updateIcons();
  };

  themeToggle.addEventListener("click", toggleTheme);
  updateIcons(); // set correct initial state
}

/* ---------------------- BLOG RENDERING ---------------------- */
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function renderBlogPosts() {
  const grid = document.getElementById("blogGrid");
  if (!grid) return;

  blogPosts.forEach((post, idx) => {
    const card = document.createElement("a");
    card.className = "card-post";
    card.href = "#"; // placeholder – can be replaced with real URLs later
    card.style.transitionDelay = `${idx * 150}ms`;
    card.innerHTML = `
      <h3>${post.title}</h3>
      <div class="post-date">${formatDate(post.date)}</div>
      <p>${post.excerpt}</p>
    `;

    // Prevent navigation until backend pages exist
    card.addEventListener("click", (e) => e.preventDefault());

    grid.appendChild(card);
  });
}

/* ---------------------- INTERSECTION ANIMATIONS ---------------------- */
function initScrollAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target); // animate once
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -40px 0px",
    },
  );

  // Wait for cards to be in DOM first
  const cards = document.querySelectorAll(".card-post");
  cards.forEach((c) => observer.observe(c));
}

/* ---------------------- SCROLL HELPERS ---------------------- */
function smoothScrollToSection(sectionEl) {
  if (!sectionEl) return;
  // Use scrollIntoView – section already has scroll-margin set in CSS
  sectionEl.scrollIntoView({ behavior: "smooth" });
}

function initScrollArrow() {
  const arrowBtn = document.getElementById("scrollArrow");
  const blogSection = document.getElementById("blog");
  if (!arrowBtn || !blogSection) return;
  arrowBtn.addEventListener("click", (e) => {
    e.preventDefault();
    smoothScrollToSection(blogSection);
  });
}

function initNavigation() {
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const id = link.getAttribute("href");
      smoothScrollToSection(document.querySelector(id));
    });
  });
}

/* ---------------------- APP INIT ---------------------- */
window.addEventListener("DOMContentLoaded", () => {
  initTheme();
  renderBlogPosts();
  initScrollAnimations();
  initScrollArrow();
  initNavigation();
});
