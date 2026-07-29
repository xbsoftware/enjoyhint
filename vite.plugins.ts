import { copyFileSync, cpSync, mkdirSync, readFileSync } from "fs";
import { dirname, extname, resolve } from "path";
import type { Plugin } from "vite";

const SOURCE_CSS = resolve(__dirname, "src/jquery.enjoyhint.css");
const DIST_CSS = resolve(__dirname, "dist/enjoyhint.css");
const SOURCE_FONTS = resolve(__dirname, "src/Casino_Hand");
const DIST_FONTS = resolve(__dirname, "dist/Casino_Hand");
const STYLE_ELEMENT_ID = "enjoyhint-styles";

const FONT_MIME: Record<string, string> = {
  ".woff": "font/woff",
  ".ttf": "font/ttf",
  ".eot": "application/vnd.ms-fontobject",
  ".svg": "image/svg+xml",
};

/** Build CSS with font files inlined as data URIs (safe for runtime <style> injection). */
export function buildInjectableCss(): string {
  const css = readFileSync(SOURCE_CSS, "utf8");
  return css.replace(
    /url\((['"]?)(\.\/Casino_Hand\/[^)'"?#]+)([^)'"]*)\1\)/g,
    (_match, _quote: string, filePath: string, suffix: string) => {
      const absolute = resolve(__dirname, "src", filePath.replace(/^\.\//, ""));
      const data = readFileSync(absolute);
      const mime = FONT_MIME[extname(filePath).toLowerCase()] ?? "application/octet-stream";
      return `url("data:${mime};base64,${data.toString("base64")}${suffix}")`;
    },
  );
}

function buildStyleInjectorSnippet(): string {
  const cssLiteral = JSON.stringify(buildInjectableCss());
  return [
    "(function(){",
    `if(typeof document==="undefined")return;`,
    `if(document.getElementById(${JSON.stringify(STYLE_ELEMENT_ID)}))return;`,
    `var s=document.createElement("style");`,
    `s.id=${JSON.stringify(STYLE_ELEMENT_ID)};`,
    `s.textContent=${cssLiteral};`,
    `document.head.appendChild(s);`,
    "})();",
    "",
  ].join("");
}

/**
 * Prepend a runtime <style> injector for ESM/CJS.
 * Do NOT emit `import/require("./enjoyhint.css")` — Angular/Webpack cannot
 * process CSS imported from inside node_modules JS.
 * UMD stays CSS-free (use <link href="dist/enjoyhint.css">).
 */
export function preserveEnjoyHintCssSideEffect(): Plugin {
  return {
    name: "preserve-enjoyhint-css-side-effect",
    generateBundle(options, bundle) {
      for (const fileName of Object.keys(bundle)) {
        if (fileName.endsWith(".css")) {
          delete bundle[fileName];
        }
      }

      if (options.format !== "es" && options.format !== "cjs") return;

      const snippet = buildStyleInjectorSnippet();
      for (const file of Object.values(bundle)) {
        if (file.type !== "chunk" || !file.isEntry) continue;
        if (!file.code.includes(STYLE_ELEMENT_ID)) {
          file.code = snippet + file.code;
        }
      }
    },
  };
}

/** Copy stylesheet + webfonts for optional <link> / angular.json usage. */
export function copyEnjoyHintAssets(): Plugin {
  return {
    name: "copy-enjoyhint-assets",
    closeBundle() {
      mkdirSync(dirname(DIST_CSS), { recursive: true });
      copyFileSync(SOURCE_CSS, DIST_CSS);
      cpSync(SOURCE_FONTS, DIST_FONTS, { recursive: true });
    },
  };
}
