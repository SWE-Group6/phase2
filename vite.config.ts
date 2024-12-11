import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://qualified-schnauzer-510.convex.site',
        changeOrigin: true, // Ensures the Origin header matches the target
        rewrite: (path) => path.replace(/^\/api/, ''), // Removes '/api' from the request URL
      },
    },
  },
});
