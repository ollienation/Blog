export type Theme = "light" | "dark";

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  tags: string[];
  author: string;
}

export interface LibraryCache {
  dompurify?: any;
  hljs?: any;
  mermaid?: any;
}

export interface LibraryLoadingPromises {
  dompurify?: Promise<any>;
  hljs?: Promise<any>;
  mermaid?: Promise<any>;
}

export interface MarkdownFrontmatter {
  title?: string;
  excerpt?: string;
  date?: string;
  readTime?: string;
  tags?: string[];
  author?: string;
}

export interface ProcessedMarkdownFile {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  tags: string[];
  author: string;
}

export interface MarkedInstance {
  parse: (content: string) => string;
  setOptions?: (options: any) => void;
}
