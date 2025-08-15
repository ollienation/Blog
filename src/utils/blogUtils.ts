import type { BlogPost } from "../types";

export function formatDate(dateString: string): string {
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

export function renderBlogPosts(
  blogPosts: BlogPost[],
  onPostClick: (post: BlogPost) => void,
): void {
  try {
    const grid = document.getElementById("blogGrid") as HTMLElement;

    if (!grid) {
      console.error("Blog grid element not found");
      return;
    }

    if (!blogPosts || !Array.isArray(blogPosts) || blogPosts.length === 0) {
      console.warn("No blog posts available to render");
      grid.innerHTML =
        '<div class="no-posts-message">No blog posts available at the moment.</div>';
      return;
    }

    // Clear existing content before rendering
    grid.innerHTML = "";

    blogPosts.forEach((post, idx) => {
      try {
        // Create the main card container
        const card = document.createElement("div");
        card.className = "card-post";
        card.setAttribute("data-post-id", post.id.toString());

        // Create the title element
        const title = document.createElement("h3");
        title.textContent = post.title;

        // Create the metadata element
        const meta = document.createElement("div");
        meta.className = "post-meta";
        meta.textContent = `${formatDate(post.date)} | ${post.readTime}`;

        // Create the excerpt element
        const excerpt = document.createElement("p");
        excerpt.textContent = post.excerpt || "No excerpt available";

        // Create the tags container and individual tags
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

        // Append all created elements to the card
        card.append(title, meta, excerpt, tagsContainer);

        // Add the click event listener
        card.addEventListener("click", (e: Event) => {
          e.preventDefault();
          e.stopPropagation();
          onPostClick(post);
          console.log("Blog card clicked:", post.title);
        });

        // Append the fully constructed card to the grid
        grid.appendChild(card);

        // Trigger the entrance animation
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

export function createBlogPostElement(post: BlogPost): HTMLElement {
  const card = document.createElement("div");
  card.className = "card-post";
  card.setAttribute("data-post-id", post.id.toString());

  const title = document.createElement("h3");
  title.textContent = post.title;

  const meta = document.createElement("div");
  meta.className = "post-meta";
  meta.textContent = `${formatDate(post.date)} | ${post.readTime}`;

  const excerpt = document.createElement("p");
  excerpt.textContent = post.excerpt || "No excerpt available";

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

  card.append(title, meta, excerpt, tagsContainer);
  return card;
}
