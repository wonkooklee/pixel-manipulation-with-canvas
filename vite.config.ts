import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const fromRoot = (path: string) => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
  base: "./",
  server: {
    host: "0.0.0.0",
    port: 4000,
    open: true,
  },
  build: {
    rollupOptions: {
      input: {
        parse: fromRoot("index.html"),
        crop: fromRoot("crop.html"),
      },
    },
  },
});
