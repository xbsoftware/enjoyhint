# Clickable Overlay Description Links Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make HTML `<a href>` tags inside step `description` clickable, always opening in a new tab, without blocking click-through on the rest of the label.

**Architecture:** Keep label `pointer-events: none` and enable `pointer-events: all` only on anchors via CSS. After label HTML is applied in `OverlayRenderer`, a small helper forces `target="_blank"` and `rel="noopener noreferrer"` on every `a[href]`. No new step API.

**Tech Stack:** TypeScript, Vitest, existing OverlayRenderer DOM patterns — no new dependencies.

**Spec:** `docs/superpowers/specs/2026-07-16-clickable-overlay-links-design.md`

---

## File map

| File | Responsibility |
| --- | --- |
| `src/overlay/OverlayRenderer.ts` | `prepareLabelLinks` helper; call after `renderLabel` and when `scheduleLabelPresentation` mounts the label |
| `src/jquery.enjoyhint.css` | `.enjoy_hint_label a { pointer-events: all; cursor: pointer; }` |
| `tests/OverlayRenderer.test.ts` | Assert link attributes on immediate + delayed label presentation; overwrite behavior; CSS contract |
| `README.md` | Document that description may include `<a href>` and links open in a new tab |

---

### Task 1: Force new-tab attributes on label links

**Files:**
- Modify: `tests/OverlayRenderer.test.ts`
- Modify: `src/overlay/OverlayRenderer.ts`

- [x] **Step 1: Write the failing tests**

Append inside the existing `describe("OverlayRenderer", () => { ... })` in `tests/OverlayRenderer.test.ts`:

```typescript
  it("makes description links open in a new tab via renderLabel", () => {
    const renderer = new OverlayRenderer();
    renderer.mount();

    const label = renderer.renderLabel(
      'See <a href="https://example.com/docs" target="_self" rel="nofollow">docs</a>',
      { x: 10, y: 20 },
    );
    const anchor = label.querySelector("a");

    expect(anchor?.getAttribute("href")).toBe("https://example.com/docs");
    expect(anchor?.getAttribute("target")).toBe("_blank");
    expect(anchor?.getAttribute("rel")).toBe("noopener noreferrer");

    renderer.destroy();
  });

  it("prepares links when scheduleLabelPresentation mounts the label", () => {
    vi.useFakeTimers();
    const renderer = new OverlayRenderer();
    renderer.mount();

    renderer.scheduleLabelPresentation(
      'Read <a href="https://example.com/help">help</a>',
      { x: 10, y: 20 },
    );

    expect(document.querySelector(".enjoy_hint_label")).toBeNull();

    vi.advanceTimersByTime(400);

    const anchor = document.querySelector<HTMLAnchorElement>(".enjoy_hint_label a");
    expect(anchor?.getAttribute("href")).toBe("https://example.com/help");
    expect(anchor?.getAttribute("target")).toBe("_blank");
    expect(anchor?.getAttribute("rel")).toBe("noopener noreferrer");

    renderer.destroy();
    vi.useRealTimers();
  });

  it("prepares every href anchor in the label", () => {
    const renderer = new OverlayRenderer();
    renderer.mount();

    const label = renderer.renderLabel(
      '<a href="https://a.example">A</a> and <a href="https://b.example">B</a>',
      { x: 0, y: 0 },
    );
    const anchors = label.querySelectorAll("a");

    expect(anchors).toHaveLength(2);
    for (const anchor of anchors) {
      expect(anchor.getAttribute("target")).toBe("_blank");
      expect(anchor.getAttribute("rel")).toBe("noopener noreferrer");
    }

    renderer.destroy();
  });
```

- [x] **Step 2: Run tests to verify they fail**

Run: `npx vitest run tests/OverlayRenderer.test.ts -t "makes description links|prepares links when|prepares every href"`

Expected: FAIL — anchors keep author `target`/`rel` or lack `_blank` / `noopener noreferrer`.

- [x] **Step 3: Implement `prepareLabelLinks` and call it from both label paths**

In `src/overlay/OverlayRenderer.ts`, add a private method near the other label helpers (e.g. after `applyOversizedLabelStyles`):

```typescript
  private prepareLabelLinks(label: ParentNode): void {
    label.querySelectorAll("a[href]").forEach((anchor) => {
      anchor.setAttribute("target", "_blank");
      anchor.setAttribute("rel", "noopener noreferrer");
    });
  }
```

In `renderLabel`, call it after setting `innerHTML`:

```typescript
  renderLabel(html: string, position: { x: number; y: number }): HTMLDivElement {
    const label = this.getLabelContainer();
    label.innerHTML = html;
    label.style.position = "absolute";
    label.style.left = `${position.x}px`;
    label.style.top = `${position.y}px`;
    this.prepareLabelLinks(label);
    return label;
  }
```

In `scheduleLabelPresentation`, call it inside the timeout after the label is appended (and `this.labelContainer` is set), so the mounted node is prepared:

```typescript
    this.labelPresentationTimeoutId = window.setTimeout(() => {
      this.labelPresentationTimeoutId = undefined;
      this.root?.querySelector("#enjoyhint_label")?.remove();
      this.labelContainer = undefined;
      this.root?.append(detachedLabel);
      this.labelContainer = detachedLabel;
      this.prepareLabelLinks(detachedLabel);

      if (oversized) {
        this.applyOversizedLabelStyles(detachedLabel);
        this.svg?.querySelectorAll("#enjoyhint_arrpw_line").forEach((arrow) => arrow.remove());
        this.root?.classList.remove("enjoyhint_svg_transparent");
      }

      if (this.labelHidden) {
        this.applyLabelHiddenTransform();
      }
    }, delay);
```

Do **not** call `prepareLabelLinks` from `measureLabel` (off-DOM measurement only).

- [x] **Step 4: Run tests to verify they pass**

Run: `npx vitest run tests/OverlayRenderer.test.ts -t "makes description links|prepares links when|prepares every href"`

Expected: PASS

Also run: `npx vitest run tests/OverlayRenderer.test.ts`

Expected: PASS (no regressions)

- [x] **Step 5: Commit**

```bash
git add tests/OverlayRenderer.test.ts src/overlay/OverlayRenderer.ts
git commit -m "$(cat <<'EOF'
feat: open description links in a new tab

EOF
)"
```

---

### Task 2: Enable pointer events on label anchors

**Files:**
- Modify: `src/jquery.enjoyhint.css`
- Modify: `tests/OverlayRenderer.test.ts`

- [x] **Step 1: Write the failing CSS-contract test**

Append to `tests/OverlayRenderer.test.ts` (imports at top of file — add Node builtins if not already present):

```typescript
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
```

Then inside the describe block:

```typescript
  it("allows pointer events on label anchors while the label stays non-interactive", () => {
    const css = readFileSync(resolve(__dirname, "../src/jquery.enjoyhint.css"), "utf8");

    expect(css).toMatch(/\.enjoy_hint_label\s*\{[^}]*pointer-events:\s*none/s);
    expect(css).toMatch(/\.enjoy_hint_label\s+a\s*\{[^}]*pointer-events:\s*all/s);
    expect(css).toMatch(/\.enjoy_hint_label\s+a\s*\{[^}]*cursor:\s*pointer/s);
  });
```

- [x] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/OverlayRenderer.test.ts -t "allows pointer events on label anchors"`

Expected: FAIL — `.enjoy_hint_label a` rule missing.

- [x] **Step 3: Add the CSS rule**

In `src/jquery.enjoyhint.css`, immediately after the `.enjoy_hint_label { ... }` block (after its closing `}`), add:

```css
.enjoy_hint_label a {
  pointer-events: all;
  cursor: pointer;
}
```

Do not change `.enjoy_hint_label { pointer-events: none; }`.

- [x] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/OverlayRenderer.test.ts -t "allows pointer events on label anchors"`

Expected: PASS

- [x] **Step 5: Commit**

```bash
git add src/jquery.enjoyhint.css tests/OverlayRenderer.test.ts
git commit -m "$(cat <<'EOF'
fix: make description links clickable via pointer-events

EOF
)"
```

---

### Task 3: Document clickable links in README

**Files:**
- Modify: `README.md`

- [x] **Step 1: Add the documentation note**

In `README.md`, under **Properties of the step configuration**, after the bullet that describes `selector` / `event` / `description` (around the line that mentions targetless steps), add a new bullet:

```markdown
* `description` may include HTML. Links written as `<a href="...">...</a>` are clickable and always open in a new tab; the rest of the label still lets clicks pass through to the highlighted element.
```

Place it near the other description-related bullets so authors discover it with step config properties.

- [x] **Step 2: Sanity-check wording**

Confirm the note does not claim markdown support or a new `links` field.

- [x] **Step 3: Commit**

```bash
git add README.md
git commit -m "$(cat <<'EOF'
docs: note clickable HTML links in step descriptions

EOF
)"
```

---

### Task 4: Final verification

**Files:** none (verification only)

- [x] **Step 1: Run unit tests and typecheck**

Run:

```bash
npm test
npm run typecheck
```

Expected: both PASS.

- [ ] **Step 2: Manual smoke (optional but recommended)**

In `examples/example1` (or a minimal page), set a step description to:

```javascript
description: 'See <a href="https://example.com">example.com</a> for details.'
```

Run the example, confirm the link is clickable, opens a new tab, and clicks on non-link label text still do not block the spotlight target where applicable.

---

## Spec coverage checklist

| Spec requirement | Task |
| --- | --- |
| HTML `<a>` in `description` (no new API) | Task 1 (uses existing HTML path) |
| Only anchors receive pointer events | Task 2 |
| Force `target="_blank"` + `rel="noopener noreferrer"` | Task 1 |
| Overwrite author `target` / `rel` | Task 1 tests |
| Tour does not advance/skip on link click | Implicit (native navigation only; no tour handlers) |
| README note | Task 3 |
| Unit tests | Tasks 1–2, 4 |
| Both `renderLabel` and delayed presentation | Task 1 |
