import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    include: ["tests/**/*.test.ts"],
    exclude: ["tests/e2e/**", "tests/parity/parity.test.ts", "tests/parity/placementParity.test.ts"],
  },
});
