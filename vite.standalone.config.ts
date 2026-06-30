import { copyFileSync, mkdirSync } from "fs";
import { dirname, resolve } from "path";
import { defineConfig, type Plugin } from "vite";

function copyCss(): Plugin {
  const source = resolve(__dirname, "src/jquery.enjoyhint.css");
  const target = resolve(__dirname, "dist/enjoyhint.css");

  return {
    name: "copy-enjoyhint-css",
    closeBundle() {
      mkdirSync(dirname(target), { recursive: true });
      copyFileSync(source, target);
    },
  };
}

export default defineConfig({
  resolve: {
    extensions: [".ts", ".tsx", ".mjs", ".js", ".mts", ".jsx", ".json"],
  },
  plugins: [copyCss()],
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
