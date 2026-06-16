import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    extensions: [".ts", ".tsx", ".mjs", ".js", ".mts", ".jsx", ".json"],
  },
  test: {
    environment: "jsdom",
    include: ["tests/**/*.test.ts"],
  },
});
