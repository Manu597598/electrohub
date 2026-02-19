import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
  },
  build: {
    outDir: "dist",
  },
  // 🔹 Important for React Router dynamic routes
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  // Vite handles all 404s by serving index.html
  base: "/",
});



