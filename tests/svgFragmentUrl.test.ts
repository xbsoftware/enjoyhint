import { afterEach, describe, expect, it } from "vitest";
import { svgFragmentUrl } from "../src/overlay/svgFragmentUrl";

describe("svgFragmentUrl", () => {
  const originalHref = window.location.href;

  afterEach(() => {
    window.history.replaceState({}, "", originalHref);
  });

  it("builds an absolute url() with the element id as hash for a path route", () => {
    window.history.replaceState({}, "", "/users/1");
    const origin = new URL(window.location.href).origin;
    expect(svgFragmentUrl("arrowMarker")).toBe(`url("${origin}/users/1#arrowMarker")`);
  });

  it("replaces an existing hash route instead of appending", () => {
    window.history.replaceState({}, "", "/#/dashboard");
    const value = svgFragmentUrl("arrowMarker");
    expect(value).toContain("#arrowMarker");
    expect(value).not.toContain("#/dashboard#arrowMarker");
    expect(value).toMatch(/^url\("https?:\/\/.+#arrowMarker"\)$/);
  });

  it("preserves the query string", () => {
    window.history.replaceState({}, "", "/tour?x=1");
    const origin = new URL(window.location.href).origin;
    expect(svgFragmentUrl("m")).toBe(`url("${origin}/tour?x=1#m")`);
  });

  it("percent-encodes double quotes from the document URL", () => {
    const locationDescriptor = Object.getOwnPropertyDescriptor(window, "location");
    Object.defineProperty(window, "location", {
      configurable: true,
      value: { href: 'http://example.com/a"b' },
    });

    try {
      expect(svgFragmentUrl("id")).toBe('url("http://example.com/a%22b#id")');
    } finally {
      if (locationDescriptor) {
        Object.defineProperty(window, "location", locationDescriptor);
      }
    }
  });
});
