import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    emptyOutDir: false,
    lib: {
      entry: resolve(__dirname, "src/standalone.ts"),
      name: "EnjoyHint",
      formats: ["cjs", "umd"],
      fileName: (format) =>
        format === "cjs" ? "enjoyhint.cjs" : "enjoyhint.min.js",
    },
    rollupOptions: {
      output: { exports: "default" },
    },
    sourcemap: true,
    minify: "oxc",
  },
});
