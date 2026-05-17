import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/pollinations": {
        target: "https://image.pollinations.ai",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/pollinations/, ""),
      },
    },
  },
});
 