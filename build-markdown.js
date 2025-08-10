#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

// Configuration
const BLOGS_DIR = "./blogs";
const OUTPUT_FILE = "./blogPosts.js";
const WORDS_PER_MINUTE = 250;

/**
 * Calculate reading time based on word count
 * @param {string} content - The markdown content
 * @returns {string} - Formatted read time (e.g., "5 min read")
 */
function calculateReadTime(content) {
  if (!content) return "1 min read";
  const words = content.trim().split(/\s+/).length;
  const timeMinutes = Math.ceil(words / WORDS_PER_MINUTE);
  return `${timeMinutes} min read`;
}

/**
 * Generate excerpt from markdown content
 * @param {string} content - The markdown content
 * @param {number} maxLength - Maximum length of excerpt
 * @returns {string} - Generated excerpt
 */
function generateExcerpt(content, maxLength = 150) {
  if (!content) return "Click to read more...";

  // Remove markdown formatting to get clean text for the excerpt
  const cleanContent = content
    .replace(/^#{1,6}\s+.*/gm, "") // Remove all headers
    .replace(/\*\*(.*?)\*\*/g, "$1") // Remove bold
    .replace(/\*(.*?)\*/g, "$1") // Remove italic
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Remove links, keep text
    .replace(/``````/g, "") // Remove code blocks
    .replace(/`([^`]+)`/g, "$1") // Remove inline code
    .replace(/---/g, "") // Remove horizontal rules
    .trim();

  if (!cleanContent) return "Click to read more...";

  // Get first paragraph or truncate to maxLength
  const firstParagraph = cleanContent.split("\n\n")[0];
  if (firstParagraph.length <= maxLength) {
    return firstParagraph;
  }

  return cleanContent.substring(0, maxLength).replace(/\s+\S*$/, "") + "...";
}

/**
 * Extract title from markdown content (fallback for files without frontmatter)
 */
function extractTitle(content, filename) {
  const titleMatch = content.match(/^#\s+(.*)/);
  if (titleMatch && titleMatch[1]) {
    return titleMatch[1].trim();
  }

  // Fallback to filename without extension
  return filename
    .replace(/\.md$/i, "")
    .replace(/[-_]/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function inferTags(content, filename) {
  const tags = new Set();
  const techTerms = [
    "javascript",
    "react",
    "node",
    "aws",
    "ai",
    "tech",
    "web",
    "api",
    "css",
    "html",
    "security",
    "performance",
  ];
  const contentLower = content.toLowerCase();

  techTerms.forEach((term) => {
    if (contentLower.includes(term)) {
      tags.add(term.charAt(0).toUpperCase() + term.slice(1));
    }
  });

  if (tags.size === 0) {
    tags.add("General");
  }
  return Array.from(tags).slice(0, 3);
}

function processMarkdownFile(filePath, id) {
  try {
    const fileContent = fs.readFileSync(filePath, "utf8");
    const filename = path.basename(filePath);
    const stats = fs.statSync(filePath);
    console.log(`Processing: ${filename}`);

    const { data, content: mainContent } = matter(fileContent);
    const hasValidFrontmatter = data && Object.keys(data).length > 0;

    const contentForExcerpt = mainContent
      .replace(/^#\s+.+(\r\n|\n|\r)?/, "")
      .trim();

    const blogPost = {
      id,
      title:
        (hasValidFrontmatter && data.title) ||
        extractTitle(mainContent, filename),
      excerpt:
        (hasValidFrontmatter && data.excerpt) ||
        generateExcerpt(contentForExcerpt),
      content: mainContent, // Full content for the modal view
      date:
        (hasValidFrontmatter && data.date) ||
        stats.mtime.toISOString().split("T")[0],
      readTime:
        (hasValidFrontmatter && data.readTime) ||
        calculateReadTime(mainContent),
      tags:
        (hasValidFrontmatter && data.tags) || inferTags(mainContent, filename),
      author: (hasValidFrontmatter && data.author) || "Oliver",
    };

    console.log(` → Title: "${blogPost.title}"`);
    return blogPost;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return null;
  }
}

function buildBlogPosts() {
  const startTime = Date.now();
  console.log("🚀 Starting markdown blog build process...");

  if (!fs.existsSync(BLOGS_DIR)) {
    console.error(`❌ Error: ${BLOGS_DIR} directory not found!`);
    fs.writeFileSync(OUTPUT_FILE, `export const blogPosts = [];`, "utf8");
    process.exit(1);
  }

  const files = fs
    .readdirSync(BLOGS_DIR)
    .filter((file) => file.endsWith(".md"));

  if (files.length === 0) {
    console.warn(
      `⚠️ No markdown files found in ${BLOGS_DIR}. Generating empty posts file.`,
    );
    fs.writeFileSync(OUTPUT_FILE, `export const blogPosts = [];`, "utf8");
    return;
  }

  console.log(`📝 Found ${files.length} markdown files.`);
  const blogPosts = files
    .map((file, index) => {
      const filePath = path.join(BLOGS_DIR, file);
      return processMarkdownFile(filePath, index + 1);
    })
    .filter((post) => post !== null);

  blogPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

  const timestamp = new Date().toISOString();
  const moduleContent = `// Auto-generated by build-markdown.js - DO NOT EDIT MANUALLY
// Generated on: ${timestamp}
export const blogPosts = ${JSON.stringify(blogPosts, null, 2)};
`;

  try {
    fs.writeFileSync(OUTPUT_FILE, moduleContent, "utf8");
    console.log(
      `\n✅ Successfully generated ${OUTPUT_FILE} with ${blogPosts.length} posts.`,
    );
    console.log(`⏱️ Build completed in ${Date.now() - startTime}ms`);
  } catch (error) {
    console.error(`❌ Error writing ${OUTPUT_FILE}:`, error.message);
    process.exit(1);
  }
}

buildBlogPosts();
