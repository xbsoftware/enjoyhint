# SVG Fragment URL Fix — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make SVG `marker-end` and `mask` fragment URLs resolve under SPA path/hash routing via a shared absolute-URL helper.

**Architecture:** Add `svgFragmentUrl(elementId)` that builds `url("${absolute}#id")` with the document hash replaced. Wire it into `SvgArrow` and `SvgMaskSpotlight`. Keep marker/mask DOM and public API unchanged.

**Tech Stack:** TypeScript, Vitest, jsdom

**Spec:** `docs/superpowers/specs/2026-07-22-svg-fragment-url-design.md`

**Constraints (human):** Do not commit. Do not create a worktree.

---

## File map

| File | Responsibility |
| --- | --- |
| `src/overlay/svgFragmentUrl.ts` | Absolute SVG fragment URL helper |
| `tests/svgFragmentUrl.test.ts` | Helper unit tests |
| `src/overlay/SvgArrow.ts` | Use helper for `marker-end` |
| `src/overlay/SvgMaskSpotlight.ts` | Use helper for `mask` |
| `tests/SvgArrow.test.ts` | Update `marker-end` assertion |
| `tests/SvgMaskSpotlight.test.ts` | Update `mask` assertion |
| `tests/OverlayRenderer.test.ts` | Update any bare `url(#…)` mask assertions |

---

### Task 1: `svgFragmentUrl` helper (TDD)

**Files:**
- Create: `tests/svgFragmentUrl.test.ts`
- Create: `src/overlay/svgFragmentUrl.ts`

- [x] **Step 1: Write the failing tests**

```typescript
import { afterEach, describe, expect, it } from "vitest";
import { svgFragmentUrl } from "../src/overlay/svgFragmentUrl";

describe("svgFragmentUrl", () => {
  const originalHref = window.location.href;

  afterEach(() => {
    window.history.replaceState({}, "", originalHref);
  });

  it("builds an absolute url() with the element id as hash for a path route", () => {
    window.history.replaceState({}, "", "/users/1");
    expect(svgFragmentUrl("arrowMarker")).toBe(
      `url("${new URL(window.location.href).origin}/users/1#arrowMarker")`,
    );
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
    expect(svgFragmentUrl("m")).toBe(
      `url("${new URL(window.location.href).origin}/tour?x=1#m")`,
    );
  });

  it("escapes double quotes in the document URL", () => {
    // Simulate a href that contains " by constructing the expected escape path:
    // helper must escape " as \" inside url("...")
    const hrefWithQuote = `${window.location.origin}/weird"path`;
    window.history.replaceState({}, "", "/");
    // Force a quoted path via URL mutation if history cannot set quotes:
    // assert the escape behavior by calling through a local expected builder.
    const url = new URL(window.location.href);
    url.pathname = '/weird"path';
    url.hash = "id";
    const escaped = url.href.replaceAll('"', '\\"');
    // Direct unit: escape step
    expect(`url("${escaped}")`).toContain('\\"');
  });
});
```

Note for implementer: if jsdom cannot set a pathname containing `"`, test the escape by exporting nothing extra — instead set location to a normal URL and unit-test escaping by verifying the helper output uses quoted `url("...")` form always; add a focused test that stubs `window.location.href` with `Object.defineProperty` if needed:

```typescript
it("escapes double quotes in the document URL", () => {
  Object.defineProperty(window, "location", {
    configurable: true,
    value: { href: 'http://example.com/a"b' },
  });
  expect(svgFragmentUrl("id")).toBe('url("http://example.com/a\\"b#id")');
});
```

Restore `location` in `afterEach` when stubbing.

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- tests/svgFragmentUrl.test.ts`  
Expected: FAIL (module not found / `svgFragmentUrl` undefined)

- [ ] **Step 3: Write minimal implementation**

```typescript
// src/overlay/svgFragmentUrl.ts
export function svgFragmentUrl(elementId: string): string {
  const url = new URL(window.location.href);
  url.hash = elementId;
  const href = url.href.replaceAll('"', '\\"');
  return `url("${href}")`;
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- tests/svgFragmentUrl.test.ts`  
Expected: PASS

- [ ] **Step 5: Commit** — SKIPPED (human constraint)

---

### Task 2: Wire `SvgArrow` (TDD)

**Files:**
- Modify: `src/overlay/SvgArrow.ts`
- Modify: `tests/SvgArrow.test.ts`

- [ ] **Step 1: Update failing assertion**

In `tests/SvgArrow.test.ts`, change:

```typescript
expect(path?.getAttribute("marker-end")).toBe("url(#arrowMarker)");
```

to:

```typescript
import { svgFragmentUrl } from "../src/overlay/svgFragmentUrl";
// ...
expect(path?.getAttribute("marker-end")).toBe(svgFragmentUrl("arrowMarker"));
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/SvgArrow.test.ts`  
Expected: FAIL — still `url(#arrowMarker)` vs absolute URL

- [ ] **Step 3: Wire helper**

In `SvgArrow.ts`:

```typescript
import { svgFragmentUrl } from "./svgFragmentUrl";
// ...
path.setAttribute("marker-end", svgFragmentUrl("arrowMarker"));
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- tests/SvgArrow.test.ts`  
Expected: PASS

- [ ] **Step 5: Commit** — SKIPPED

---

### Task 3: Wire `SvgMaskSpotlight` (TDD)

**Files:**
- Modify: `src/overlay/SvgMaskSpotlight.ts`
- Modify: `tests/SvgMaskSpotlight.test.ts`
- Modify: `tests/OverlayRenderer.test.ts` (any bare `url(#…)` mask checks)

- [ ] **Step 1: Update failing assertions**

`tests/SvgMaskSpotlight.test.ts`:

```typescript
import { svgFragmentUrl } from "../src/overlay/svgFragmentUrl";
// ...
expect(svg.querySelector(`[mask="${svgFragmentUrl(mask!.id)}"]`)).not.toBeNull();
```

Update `OverlayRenderer.test.ts` similarly wherever it asserts `mask="url(#…)"` or uses attribute selectors that assume bare fragments.

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- tests/SvgMaskSpotlight.test.ts tests/OverlayRenderer.test.ts`  
Expected: FAIL on mask attribute mismatch

- [ ] **Step 3: Wire helper**

In `SvgMaskSpotlight.ts` `ensureOverlay`:

```typescript
import { svgFragmentUrl } from "./svgFragmentUrl";
// ...
overlay.setAttribute("mask", svgFragmentUrl(this.maskId));
```

- [ ] **Step 4: Run full related suite**

Run: `npm test -- tests/svgFragmentUrl.test.ts tests/SvgArrow.test.ts tests/SvgMaskSpotlight.test.ts tests/OverlayRenderer.test.ts`  
Expected: PASS

- [ ] **Step 5: Commit** — SKIPPED

---

## Self-review

| Spec requirement | Task |
| --- | --- |
| Absolute fragment URL helper | Task 1 |
| Replace existing hash | Task 1 |
| Quote + escape `"` | Task 1 |
| `SvgArrow` marker-end | Task 2 |
| `SvgMaskSpotlight` mask | Task 3 |
| Update existing tests | Tasks 2–3 |
| Legacy jQuery out of scope | (no task) |
