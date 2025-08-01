#!/usr/bin/env node

/**
 * Build Script for Dynamic Markdown Blog Processing
 * 
 * This script processes markdown files from the /blogs directory during AWS Amplify build
 * and generates a blogPosts.js module for dynamic import in the main application.
 * 
 * Features:
 * - Processes markdown files with or without frontmatter
 * - Generates excerpts, calculates read time, and handles fallbacks
 * - Maintains compatibility with existing blog post structure
 * - Optimized for AWS Amplify build environment
 */

const fs = require('fs');
const path = require('path');

// Install gray-matter if not present (for AWS Amplify builds)
try {
  require('gray-matter');
} catch (error) {
  console.log('Installing gray-matter dependency...');
  require('child_process').execSync('npm install gray-matter', { stdio: 'inherit' });
}

const matter = require('gray-matter');

// Configuration
const BLOGS_DIR = './blogs';
const OUTPUT_FILE = './blogPosts.js';
const WORDS_PER_MINUTE = 250;

/**
 * Calculate reading time based on word count
 * @param {string} content - The markdown content
 * @returns {string} - Formatted read time (e.g., "5 min read")
 */
function calculateReadTime(content) {
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
  // Remove markdown headers and format to get clean text
  const cleanContent = content
    .replace(/^#{1,6}\s+/gm, '') // Remove headers
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.*?)\*/g, '$1') // Remove italic
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links, keep text
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/`([^`]+)`/g, '$1') // Remove inline code
    .trim();

  // Get first paragraph or truncate to maxLength
  const firstParagraph = cleanContent.split('\n\n')[0];
  if (firstParagraph.length <= maxLength) {
    return firstParagraph;
  }

  return cleanContent.substring(0, maxLength).replace(/\s+\S*$/, '') + '...';
}

/**
 * Extract title from markdown content (fallback for files without frontmatter)
 * @param {string} content - The markdown content
 * @param {string} filename - The filename as fallback
 * @returns {string} - Extracted or fallback title
 */
function extractTitle(content, filename) {
  const lines = content.split('\n');
  const titleLine = lines.find(line => line.startsWith('# '));

  if (titleLine) {
    return titleLine.substring(2).trim();
  }

  // Fallback to filename without extension
  return filename.replace(/\.md$/i, '').replace(/[-_]/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Infer tags from content and filename
 * @param {string} content - The markdown content
 * @param {string} filename - The filename
 * @returns {string[]} - Array of inferred tags
 */
function inferTags(content, filename) {
  const tags = [];

  // Common technical terms that might be tags
  const techTerms = ['javascript', 'react', 'node', 'aws', 'ai', 'tech', 'web', 'api', 'css', 'html'];
  const contentLower = content.toLowerCase();

  techTerms.forEach(term => {
    if (contentLower.includes(term)) {
      tags.push(term.charAt(0).toUpperCase() + term.slice(1));
    }
  });

  // Add filename-based tag if no tech terms found
  if (tags.length === 0) {
    const baseTag = filename.replace(/\.md$/i, '').replace(/[-_]/g, ' ');
    tags.push('General');
  }

  return tags.slice(0, 3); // Limit to 3 tags
}

/**
 * Process a single markdown file
 * @param {string} filePath - Path to the markdown file
 * @param {number} id - Post ID
 * @returns {Object} - Processed blog post object
 */
function processMarkdownFile(filePath, id) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const filename = path.basename(filePath);
    const stats = fs.statSync(filePath);

    console.log(`Processing: ${filename}`);

    // Parse with gray-matter
    const parsed = matter(content);
    const hasValidFrontmatter = parsed.data && Object.keys(parsed.data).length > 0;

    let blogPost;

    if (hasValidFrontmatter) {
      // Use frontmatter data
      blogPost = {
        id,
        title: parsed.data.title || extractTitle(parsed.content, filename),
        excerpt: parsed.data.excerpt || generateExcerpt(parsed.content),
        content: parsed.content,
        date: parsed.data.date || stats.mtime.toISOString().split('T')[0],
        readTime: parsed.data.readTime || calculateReadTime(parsed.content),
        tags: parsed.data.tags || inferTags(parsed.content, filename),
        author: parsed.data.author || 'Oliver'
      };
    } else {
      // Handle files without frontmatter (like welcome.md)
      console.log(`  → No frontmatter found, using fallback extraction`);
      blogPost = {
        id,
        title: extractTitle(content, filename),
        excerpt: generateExcerpt(content),
        content: content,
        date: stats.mtime.toISOString().split('T')[0],
        readTime: calculateReadTime(content),
        tags: inferTags(content, filename),
        author: 'Oliver'
      };
    }

    console.log(`  → Title: "${blogPost.title}"`);
    console.log(`  → Tags: [${blogPost.tags.join(', ')}]`);
    console.log(`  → Read time: ${blogPost.readTime}`);

    return blogPost;

  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return null;
  }
}

/**
 * Main build function
 */
function buildBlogPosts() {
  console.log('🚀 Starting markdown blog build process...');
  console.log(`📁 Scanning directory: ${BLOGS_DIR}`);

  // Check if blogs directory exists
  if (!fs.existsSync(BLOGS_DIR)) {
    console.error(`❌ Error: ${BLOGS_DIR} directory not found!`);
    process.exit(1);
  }

  // Read all markdown files
  const files = fs.readdirSync(BLOGS_DIR)
    .filter(file => file.endsWith('.md'))
    .sort(); // Ensure consistent ordering

  if (files.length === 0) {
    console.warn(`⚠️  No markdown files found in ${BLOGS_DIR}`);
    return;
  }

  console.log(`📝 Found ${files.length} markdown files:`);
  files.forEach(file => console.log(`   • ${file}`));
  console.log('');

  // Process each file
  const blogPosts = [];
  let id = 1;

  for (const file of files) {
    const filePath = path.join(BLOGS_DIR, file);
    const post = processMarkdownFile(filePath, id);

    if (post) {
      blogPosts.push(post);
      id++;
    }
  }

  // Sort by date (newest first)
  blogPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Generate the JavaScript module content
  const timestamp = new Date().toISOString();
  const moduleContent = `// Auto-generated by build-markdown.js - DO NOT EDIT MANUALLY
// Generated on: ${timestamp}
// Source files: ${files.join(', ')}

export const blogPosts = ${JSON.stringify(blogPosts, null, 2)};

// Export count for debugging
export const postCount = ${blogPosts.length};

// Export generation timestamp
export const generatedAt = "${timestamp}";
`;

  // Write the generated module
  try {
    fs.writeFileSync(OUTPUT_FILE, moduleContent, 'utf8');
    console.log(`✅ Successfully generated ${OUTPUT_FILE}`);
    console.log(`📊 Generated ${blogPosts.length} blog posts`);
    console.log(`⏱️  Build completed in ${Date.now() - startTime}ms`);
  } catch (error) {
    console.error(`❌ Error writing ${OUTPUT_FILE}:`, error.message);
    process.exit(1);
  }
}

// Execute the build process
const startTime = Date.now();

try {
  buildBlogPosts();
} catch (error) {
  console.error('❌ Build failed:', error.message);
  console.error(error.stack);
  process.exit(1);
}
