import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  const port = parseInt(env.VITE_PORT || "7600", 10);
  const apiUrl = env.VITE_API_URL || "http://localhost:3000";

  return {
    build: {
      outDir: "dist",
      assetsDir: "assets",
    },
    server: {
      host: "0.0.0.0",
      port,
      proxy: {
        "/api": apiUrl,
        "/photos": apiUrl,
        "/cache": apiUrl,
      },
    },
  };
});
