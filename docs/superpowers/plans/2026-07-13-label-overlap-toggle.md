# Label/Target Overlap Toggle Button Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]` / `- [x]`) syntax for tracking.

**Goal:** Add a toggle that appears only on oversized (black-background, no-arrow) labels that overlap the spotlight, so the user can slide that label off-screen to the left and bring it back.

**Architecture:** Pure helpers in `src/overlay/labelOverlapToggle.ts` detect overlap and pick a non-colliding button position. `OverlayRenderer` owns the eye-button DOM, SVG icons, hide/show transform+opacity, and the next/prev/skip button-row rect. `StepController` enables the toggle only when `placement.side === "oversized"` and the label overlaps the spotlight; it positions the button after `positionButtons()` so the button row can be avoided.

**Tech Stack:** TypeScript, Vitest (unit tests), Playwright (e2e), vanilla DOM/CSS — no new dependencies.

**Spec:** `docs/superpowers/specs/2026-07-10-label-overlap-toggle-design.md`  
**(Amended by this plan — see “Post-implementation amendments” below; when they conflict, this plan wins.)**

---

## Post-implementation amendments (from bugfixes)

These decisions supersede the original plan/spec wording:

| Topic | Original plan | Final (fixed) behavior |
| --- | --- | --- |
| When the eye appears | Any placement whose label overlaps the spotlight | **Only oversized** labels (`placement.side === "oversized"`): black background, no arrow. Arrow / transparent labels never show the toggle and never slide. |
| What moves on hide | Any overlapping label | **Only the oversized black-background label** slides left. Default arrow text stays put. |
| Button icon | CSS pseudo-element eye + slash span (ugly on hover) | Inline **SVG** eye / eye-off using `currentColor` (hover fills the circle green, icon turns white) |
| Button placement | Spotlight-edge opposite the label (~12px) | `computeToggleButtonPosition`: spotlight edges → **label edges** → viewport corners (skip top-right/close). Avoids label, spotlight, **button row**, and **close button**. Outer size **36px** (32 content + 2px border); default edge offset **30px**. |
| CSS hide | Rely on `.enjoyhint_hide { display: none }` | Must also have **`.enjoyhint_label_toggle_btn.enjoyhint_hide { display: none }`** — otherwise `display: inline-flex` on the toggle overrides hide and the eye stays painted on arrow steps. Clear `left`/`top` when hiding. |
| Hide animation | Stylesheet `transform` transition | Oversized labels set an inline `transition`. It **must include `transform` and `opacity`**, not only `background-color`, or the slide snaps instead of animating left. |
| Wire-up timing | Sync in `renderLabel` before `positionButtons` | Configure toggle **inside the same `scheduleStepTimeout(..., 0)`** as `positionButtons`, after it runs, so `getButtonRowRect()` is available. Flush with `vi.advanceTimersByTime(1)` in unit tests. |

---

### Task 1: Pure overlap / position / offset helpers

**Files:**
- Create: `src/overlay/labelOverlapToggle.ts`
- Test: `tests/labelOverlapToggle.test.ts`

- [x] **Step 1: Write failing tests** for `computeOverlapArea`, `doesLabelOverlapSpotlight`, `computeToggleButtonPosition` (not `computeToggleButtonAnchor`), and `computeLabelHideOffsetPx`

Key position cases to cover:

- Preferred spotlight-edge opposite the label
- Fallback to another spotlight edge when the preferred edge collides with the label
- Fallback **outside the label’s own edges** when the label covers the spotlight (oversized case)
- Avoid `avoidRects` (button row / close zone)
- Zero overlap with label + spotlight when corners are occupied
- Never use the top-right corner (reserved for close)

- [x] **Step 2: Implement helpers**

Exports / constants (final):

```typescript
export const LABEL_OVERLAP_AREA_THRESHOLD_PX2 = 200;
export const LABEL_HIDE_MARGIN_PX = 24;
/** Outer diameter including 2px border (content box is 32px). */
export const LABEL_TOGGLE_BUTTON_SIZE_PX = 36;

// DEFAULT_TOGGLE_BUTTON_OFFSET_PX = 30  // 12px gap + ~18px outer radius
export function computeToggleButtonPosition(input: {
  labelRect: OverlapRect;
  spotlight: SpotlightRect;
  avoidRects?: OverlapRect[];
  buttonSize?: number;
  viewport: { width: number; height: number };
  offsetPx?: number;
}): { x: number; y: number };
```

Candidate order: preferred spotlight edge → other spotlight edges → preferred label edge → other label edges → bottom-right / bottom-left / top-left corners. Score by total `computeOverlapArea` against label + spotlight + `avoidRects`; pick lowest (ideally 0). Clamp to viewport with an 8px margin.

- [x] **Step 3: Tests pass + typecheck**

---

### Task 2: Toggle button CSS

**Files:**
- Modify: `src/jquery.enjoyhint.css`

- [x] **Step 1: Styles for SVG eye button**

```css
.enjoyhint_label_toggle_btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  /* ... 32x32, 2px green border, color: rgb(30, 205, 151) ... */
}

/* Critical: beat the flex display rule so hide actually removes the button. */
.enjoyhint_label_toggle_btn.enjoyhint_hide {
  display: none;
}

.enjoyhint_label_toggle_btn svg {
  display: block;
  pointer-events: none;
}

.enjoyhint_label_toggle_btn:hover {
  background: rgb(30, 205, 151);
  color: rgba(255, 255, 255, 1);
}
```

Do **not** use `::before` / `::after` pseudo-eyes or a `.enjoyhint_label_toggle_btn_slash` span — they paint badly on hover.

- [x] **Step 2: Label must transition `transform` as well as opacity**

`.enjoy_hint_label` already includes:

```css
transition: opacity 400ms cubic-bezier(0.42, 0, 0.58, 1),
  transform 400ms cubic-bezier(0.42, 0, 0.58, 1);
```

Do not regress this.

---

### Task 3: OverlayRenderer toggle button

**Files:**
- Modify: `src/overlay/OverlayRenderer.ts`
- Test: `tests/OverlayRenderer.test.ts`

- [x] **Step 1: Mount eye button, configure API, hide/show**

- Import `LABEL_TOGGLE_BUTTON_SIZE_PX` from `labelOverlapToggle` (outer size for centering).
- Create button with **inline SVG** open-eye / eye-off (`currentColor`); swap `innerHTML` in `setLabelHidden`.
- `configureLabelOverlapToggle`: on `!overlaps`, hide via `enjoyhint_hide`, **clear `left`/`top`**, and un-hide the label if needed.
- `getButtonRowRect()`: record the next/prev/skip row bbox at the end of `positionButtons`.
- **Oversized transition fix:** `applyOversizedLabelStyles` must set:

```typescript
label.style.transition =
  "background-color ease-out 0.5s, opacity 400ms cubic-bezier(0.42, 0, 0.58, 1), transform 400ms cubic-bezier(0.42, 0, 0.58, 1)";
```

A background-only inline transition overrides the stylesheet and makes the left slide snap.

- [x] **Step 2: Unit tests** — show/hide, slide transform, icon swap, `resetHidden`, pending-label remount, oversized transition includes `transform`, `getButtonRowRect`

---

### Task 4: Wire detection into StepController (oversized only)

**Files:**
- Modify: `src/StepController.ts`
- Test: `tests/StepController.test.ts`

- [x] **Step 1: Gate + position after buttons**

Inside the existing `scheduleStepTimeout(..., 0)` that calls `positionButtons`:

1. Call `positionButtons(...)`.
2. If `!isOversized`, call `configureLabelOverlapToggle({ overlaps: false, ... })` and return — **no arrow-label toggle, ever**.
3. Else build `labelRect`, `doesLabelOverlapSpotlight`, then:

```typescript
const buttonRowRect = this.renderer.getButtonRowRect();
const closeButtonRect = {
  top: 0,
  right: viewport.width,
  bottom: 60,
  left: viewport.width - 60,
};
const togglePosition = computeToggleButtonPosition({
  labelRect,
  spotlight,
  avoidRects: [closeButtonRect, ...(buttonRowRect ? [buttonRowRect] : [])],
  buttonSize: LABEL_TOGGLE_BUTTON_SIZE_PX,
  viewport,
});
this.renderer.configureLabelOverlapToggle({
  overlaps: overlapsSpotlight,
  anchorX: togglePosition.x,
  anchorY: togglePosition.y,
  labelLeft: labelRect.left,
  labelWidth: placement.label.width,
  resetHidden: !options.immediate,
});
```

- [x] **Step 2: Unit tests**

- Shows button on tiny viewport / oversized path (after `vi.advanceTimersByTime(1)`).
- Hides button on large viewport / arrow path.
- Resets hidden state on next step.
- Toggle does not overlap the positioned button row when overlaps.

---

### Task 5: Browser-level verification (Playwright)

**Files:**
- Create: `tests/e2e/fixtures/label-overlap-toggle.html` (use a tall enough `#target`, e.g. height `200px`, if needed to force oversized)
- Create: `tests/e2e/labelOverlapToggle.test.ts`

- [x] **Step 1: Oversized fixture** — force black-background overlapping label; assert toggle visible, mid-click `transform` tx &lt; 0 (slide in progress), then opacity `0`, target still clickable

- [x] **Step 2: Arrow / transparent step** (e.g. `examples/example1.html` at desktop size) — assert `hasArrow`, transparent label background, toggle has `enjoyhint_hide` **and** `getComputedStyle(toggle).display === "none"`

- [x] **Step 3: Build + run** — `npm run build && npx playwright test tests/e2e/labelOverlapToggle.test.ts`

---

## Verification checklist (final)

- [x] Unit: `tests/labelOverlapToggle.test.ts`, `OverlayRenderer` / `StepController` overlap suites
- [x] Typecheck: `npm run typecheck`
- [x] Full unit: `npm run test`
- [x] E2E: oversized slide + arrow steps never paint the eye
- [x] Rebuild `dist/` after CSS/JS changes so `examples/example1.html` picks up fixes

---

## Plan Self-Review Notes

- Spec’s “run for every placement side” clause is **withdrawn**; product requirement is oversized-only.
- Original `computeToggleButtonAnchor` API is **replaced** by `computeToggleButtonPosition`.
- Two regressions that look like “logic bugs” but were CSS/style: (1) hide overridden by `inline-flex`, (2) oversized inline `transition` dropping `transform`. Both must stay called out in this plan so they are not reintroduced.
