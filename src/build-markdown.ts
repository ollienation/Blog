import * as fs from "fs";
import * as path from "path";
import matter from "gray-matter";
import type { MarkdownFrontmatter, ProcessedMarkdownFile } from "./types";

// Configuration
const BLOGS_DIR = "./blogs";
const OUTPUT_FILE = "./src/assets/blogPosts.ts";
const WORDS_PER_MINUTE = 250;

/**
 * Calculate reading time based on word count
 */
function calculateReadTime(content: string): string {
  if (!content) return "1 min read";

  const words = content.trim().split(/\\s+/).length;
  const timeMinutes = Math.ceil(words / WORDS_PER_MINUTE);

  return `${timeMinutes} min read`;
}

/**
 * Generate excerpt from markdown content
 */
function generateExcerpt(content: string, maxLength = 150): string {
  if (!content) return "Click to read more...";

  // Remove markdown formatting to get clean text for the excerpt
  const cleanContent = content
    .replace(/^#{1,6}\\s+.*/gm, "") // Remove all headers
    .replace(/\\*\\*(.*?)\\*\\*/g, "$1") // Remove bold
    .replace(/\\*(.*?)\\*/g, "$1") // Remove italic
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1") // Remove links, keep text
    .replace(/``````/g, "") // Remove code blocks
    .replace(/`([^`]+)`/g, "$1") // Remove inline code
    .replace(/---/g, "") // Remove horizontal rules
    .trim();

  if (!cleanContent) return "Click to read more...";

  // Get first paragraph or truncate to maxLength
  const firstParagraph = cleanContent.split("\\n\\n")[0];
  if (firstParagraph.length <= maxLength) {
    return firstParagraph;
  }

  return cleanContent.substring(0, maxLength).replace(/\\s+\\S*$/, "") + "...";
}

/**
 * Extract title from markdown content (fallback for files without frontmatter)
 */
function extractTitle(content: string, filename: string): string {
  const titleMatch = content.match(/^#\\s+(.*)/);
  if (titleMatch && titleMatch[1]) {
    return titleMatch[1].trim();
  }

  // Fallback to filename without extension
  return filename
    .replace(/\\.md$/i, "")
    .replace(/[-_]/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Infer tags from content and filename
 */
function inferTags(content: string, filename: string): string[] {
  const tags = new Set<string>();
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

/**
 * Process a single markdown file
 */
function processMarkdownFile(
  filePath: string,
  id: number,
): ProcessedMarkdownFile | null {
  try {
    const fileContent = fs.readFileSync(filePath, "utf8");
    const filename = path.basename(filePath);
    const stats = fs.statSync(filePath);

    console.log(`Processing: ${filename}`);

    const { data, content: mainContent } = matter(fileContent);
    const hasValidFrontmatter = data && Object.keys(data).length > 0;

    const contentForExcerpt = mainContent
      .replace(/^#\\s+.+(\\r\\n|\\n|\\r)?/, "")
      .trim();

    const frontmatter = data as MarkdownFrontmatter;

    const blogPost: ProcessedMarkdownFile = {
      id,
      title:
        (hasValidFrontmatter && frontmatter.title) ||
        extractTitle(mainContent, filename),
      excerpt:
        (hasValidFrontmatter && frontmatter.excerpt) ||
        generateExcerpt(contentForExcerpt),
      content: mainContent, // Full content for the modal view
      date:
        (hasValidFrontmatter && frontmatter.date) ||
        stats.mtime.toISOString().split("T")[0],
      readTime:
        (hasValidFrontmatter && frontmatter.readTime) ||
        calculateReadTime(mainContent),
      tags:
        (hasValidFrontmatter && frontmatter.tags) ||
        inferTags(mainContent, filename),
      author: (hasValidFrontmatter && frontmatter.author) || "Oliver",
    };

    console.log(` → Title: "${blogPost.title}"`);
    return blogPost;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, (error as Error).message);
    return null;
  }
}

/**
 * Main build function
 */
function buildBlogPosts(): void {
  const startTime = Date.now();
  console.log("🚀 Starting markdown blog build process...");

  if (!fs.existsSync(BLOGS_DIR)) {
    console.error(`❌ Error: ${BLOGS_DIR} directory not found!`);
    fs.writeFileSync(
      OUTPUT_FILE,
      "export const blogPosts: any[] = [];",
      "utf8",
    );
    process.exit(1);
  }

  const files = fs
    .readdirSync(BLOGS_DIR)
    .filter((file) => file.endsWith(".md"));

  if (files.length === 0) {
    console.warn(
      `⚠️ No markdown files found in ${BLOGS_DIR}. Generating empty posts file.`,
    );
    fs.writeFileSync(
      OUTPUT_FILE,
      "export const blogPosts: any[] = [];",
      "utf8",
    );
    return;
  }

  console.log(`📝 Found ${files.length} markdown files.`);

  const blogPosts = files
    .map((file, index) => {
      const filePath = path.join(BLOGS_DIR, file);
      return processMarkdownFile(filePath, index + 1);
    })
    .filter((post): post is ProcessedMarkdownFile => post !== null);

  blogPosts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const timestamp = new Date().toISOString();
  const moduleContent = `// Auto-generated by build-markdown.ts - DO NOT EDIT MANUALLY
// Generated on: ${timestamp}

import type { BlogPost } from '../types';

export const blogPosts: BlogPost[] = ${JSON.stringify(blogPosts, null, 2)};
`;

  try {
    fs.writeFileSync(OUTPUT_FILE, moduleContent, "utf8");
    console.log(
      `\✅ Successfully generated ${OUTPUT_FILE} with ${blogPosts.length} posts.`,
    );
    console.log(`⏱️ Build completed in ${Date.now() - startTime}ms`);
  } catch (error) {
    console.error(`❌ Error writing ${OUTPUT_FILE}:`, (error as Error).message);
    process.exit(1);
  }
}

// Run the build process
buildBlogPosts();
