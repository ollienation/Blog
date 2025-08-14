import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@assets": path.resolve(__dirname, "src/assets"),
    },
    extensions: [".js", ".ts"],
  },
  build: {
    target: "esnext",
    minify: "esbuild",
    assetsDir: "assets",
    sourcemap: true,
    chunkSizeWarningLimit: 500, // Alert on large chunks
  },
  optimizeDeps: {
    include: ["marked", "highlight.js", "mermaid", "katex"], // Pre-bundle heavy deps
  },
});
