import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  testMatch: ["e2e/**/*.test.ts", "parity/parity.test.ts"],
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  use: {
    viewport: { width: 1280, height: 800 },
    actionTimeout: 10_000,
  },
  reporter: [["list"]],
});
