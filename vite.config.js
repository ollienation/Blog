import { defineConfig } from "vite";

export default defineConfig({
  build: {
    target: "esnext",
    minify: "esbuild",
    sourcemap: true,
    chunkSizeWarningLimit: 500, // Alert on large chunks
  },
  optimizeDeps: {
    include: ["marked", "mermaid", "katex"], // Pre-bundle heavy deps
  },
});
