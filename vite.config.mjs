import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@assets": path.resolve(__dirname, "src/assets"),
      "@utils": path.resolve(__dirname, "src/utils"),
      "@types": path.resolve(__dirname, "src/types"),
    },
    extensions: [".js", ".ts", ".mjs"],
  },
  build: {
    target: "esnext",
    minify: "esbuild",
    assetsDir: "assets",
    sourcemap: true,
    chunkSizeWarningLimit: 500, // Alert on large chunks
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor libraries into separate chunks
          vendor: ["marked", "highlight.js", "dompurify"],
          mermaid: ["mermaid"],
        },
      },
    },
  },
  optimizeDeps: {
    include: ["marked", "highlight.js", "mermaid", "dompurify"], // Pre-bundle heavy deps
  },
  server: {
    port: 3000,
    open: true,
    host: true,
  },
});
