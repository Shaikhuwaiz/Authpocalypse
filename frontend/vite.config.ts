import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default {
  server: {
    proxy: {
      "/api": "https://simplebackend-production.up.railway.app",
    },
  },
};
