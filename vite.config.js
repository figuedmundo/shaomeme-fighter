import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "dist",
    assetsDir: "assets",
  },
  server: {
    host: "localhost",
    port: 7600,
  },
});
