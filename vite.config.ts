import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [dts({ rollupTypes: true })],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "EnjoyHint",
      formats: ["es", "cjs", "umd"],
      fileName: (format) =>
        format === "es"
          ? "enjoyhint.js"
          : format === "cjs"
            ? "enjoyhint.cjs"
            : "enjoyhint.min.js",
    },
    rollupOptions: {
      output: { exports: "named" },
    },
    sourcemap: true,
    minify: "esbuild",
  },
});
