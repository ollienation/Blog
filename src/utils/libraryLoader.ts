import type { LibraryCache, LibraryLoadingPromises } from "../types";

export class LibraryLoader {
  private cache: Map<string, any> = new Map();
  private loadingPromises: Map<string, Promise<any>> = new Map();

  async loadDOMPurify(): Promise<any> {
    if (this.cache.has("dompurify")) {
      return this.cache.get("dompurify");
    }

    if (this.loadingPromises.has("dompurify")) {
      return this.loadingPromises.get("dompurify");
    }

    const loadPromise = import(
      /* webpackChunkName: "dompurify" */
      /* webpackPreload: true */
      "dompurify"
    ).then((module) => {
      const instance = module.default;
      this.cache.set("dompurify", instance);
      this.loadingPromises.delete("dompurify");
      return instance;
    });

    this.loadingPromises.set("dompurify", loadPromise);
    return loadPromise;
  }

  async loadHighlightJS(): Promise<any> {
    if (this.cache.has("hljs")) {
      return this.cache.get("hljs");
    }

    if (this.loadingPromises.has("hljs")) {
      return this.loadingPromises.get("hljs");
    }

    const loadPromise = import(
      /* webpackChunkName: "highlight-js" */
      "highlight.js"
    ).then((module) => {
      const hljs = module.default;
      this.cache.set("hljs", hljs);
      this.loadingPromises.delete("hljs");
      return hljs;
    });

    this.loadingPromises.set("hljs", loadPromise);
    return loadPromise;
  }

  async loadMermaid(): Promise<any> {
    if (this.cache.has("mermaid")) {
      return this.cache.get("mermaid");
    }

    if (this.loadingPromises.has("mermaid")) {
      return this.loadingPromises.get("mermaid");
    }

    const loadPromise = import(
      /* webpackChunkName: "mermaid" */
      "mermaid"
    ).then((module) => {
      const mermaid = module.default;
      this.cache.set("mermaid", mermaid);
      this.loadingPromises.delete("mermaid");
      return mermaid;
    });

    this.loadingPromises.set("mermaid", loadPromise);
    return loadPromise;
  }

  clearCache(): void {
    this.cache.clear();
    this.loadingPromises.clear();
  }

  getCacheSize(): number {
    return this.cache.size;
  }
}

// Global instance
export const libraryLoader = new LibraryLoader();
