import { resolve } from "path";
import { defineConfig } from "vite";
import {
  copyEnjoyHintAssets,
  preserveEnjoyHintCssSideEffect,
} from "./vite.plugins";

export default defineConfig({
  resolve: {
    extensions: [".ts", ".tsx", ".mjs", ".js", ".mts", ".jsx", ".json"],
  },
  // preserveEnjoyHintCssSideEffect injects CSS only for es/cjs; UMD stays clean.
  // standalone entry has no CSS import, so CJS still needs the inject path —
  // keep the plugin so CJS gets require("./enjoyhint.css").
  plugins: [preserveEnjoyHintCssSideEffect(), copyEnjoyHintAssets()],
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
