# RTL Support (`dir` option) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add tour-wide `dir: "ltr" | "rtl"` so EnjoyHint chrome mirrors for RTL tours while spotlight geometry stays physical and correct on both LTR and RTL host pages.

**Architecture:** `EnjoyHintOptions.dir` flows into `OverlayRenderer` at construction. The overlay root always sets HTML `dir` (isolating from the host). When `"rtl"`, renderer and `labelOverlapToggle` helpers mirror close corner, nav button order, label-hide slide, and toggle close-zone; spotlight/blockers/arrows stay unchanged.

**Tech Stack:** TypeScript, Vitest (unit), existing OverlayRenderer/StepController DOM patterns — no new dependencies.

**Spec:** `docs/superpowers/specs/2026-07-15-rtl-support-design.md`

---

## File map

| File | Responsibility |
| --- | --- |
| `src/types.ts` | `TextDirection` + `dir` on `EnjoyHintOptions` |
| `src/overlay/labelOverlapToggle.ts` | Dir-aware hide offset + close-corner candidates |
| `src/overlay/OverlayRenderer.ts` | Store `dir`; root `dir`; mirror close / buttons / hide |
| `src/StepController.ts` | Pass `dir` into renderer; mirrored close avoid-rect |
| `src/jquery.enjoyhint.css` | Explicit `direction` isolation for `.enjoyhint` |
| `tests/labelOverlapToggle.test.ts` | Helper RTL cases |
| `tests/OverlayRenderer.test.ts` | Root `dir`, close, button order, hide transform, host isolation |
| `tests/StepController.test.ts` (optional assert) | Close avoid-rect corner when `dir: "rtl"` if covered via renderer tests |

---

### Task 1: Types — `TextDirection` and `dir` option

**Files:**
- Modify: `src/types.ts`
- Modify: `src/index.ts` (re-export type if other option types are exported)

- [ ] **Step 1: Add the type and option**

In `src/types.ts`, add:

```typescript
export type TextDirection = "ltr" | "rtl";

export interface EnjoyHintOptions {
  onStart?: () => void;
  onEnd?: () => void;
  onSkip?: () => void;
  onNext?: () => void;
  btnNextText?: string;
  btnSkipText?: string;
  backgroundColor?: string;
  /** Tour chrome direction. Independent of the host page. Default `"ltr"`. */
  dir?: TextDirection;
}
```

In `src/index.ts`, extend the type export:

```typescript
export type { ButtonConfig, EnjoyHintOptions, NormalizedStep, TextDirection } from "./types";
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`  
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/types.ts src/index.ts
git commit -m "$(cat <<'EOF'
feat: add TextDirection and dir option to EnjoyHintOptions

EOF
)"
```

---

### Task 2: Dir-aware hide offset and toggle corner helpers

**Files:**
- Modify: `src/overlay/labelOverlapToggle.ts`
- Modify: `tests/labelOverlapToggle.test.ts`

- [ ] **Step 1: Write failing tests**

Append to `tests/labelOverlapToggle.test.ts`:

```typescript
import type { TextDirection } from "../src/types";

describe("computeLabelHideOffsetPx", () => {
  // keep existing LTR tests

  it("clears the right viewport edge when dir is rtl", () => {
    expect(
      computeLabelHideOffsetPx(
        { left: 100, width: 200 },
        { dir: "rtl", viewportWidth: 800 },
      ),
    ).toBe(800 - 100 + LABEL_HIDE_MARGIN_PX);
  });

  it("uses custom margin for rtl", () => {
    expect(
      computeLabelHideOffsetPx(
        { left: 50, width: 80 },
        { dir: "rtl", viewportWidth: 500, marginPx: 10 },
      ),
    ).toBe(500 - 50 + 10);
  });
});

describe("computeToggleButtonPosition close corner", () => {
  const viewport = { width: 400, height: 300 };
  const tinyLabel = { top: 140, right: 210, bottom: 160, left: 190 };
  const spotlight = {
    top: 100,
    right: 220,
    bottom: 180,
    left: 180,
    centerX: 200,
    centerY: 140,
  };
  // Fill edges so only corners are viable.
  const avoidRects = [
    { top: 0, right: 400, bottom: 120, left: 0 },
    { top: 180, right: 400, bottom: 300, left: 0 },
    { top: 0, right: 120, bottom: 300, left: 0 },
    { top: 0, right: 400, bottom: 300, left: 280 },
  ];

  it("never uses top-right in ltr (close reserved)", () => {
    const position = computeToggleButtonPosition({
      labelRect: tinyLabel,
      spotlight,
      viewport,
      avoidRects,
      dir: "ltr",
    });
    expect(position.x).toBeLessThan(viewport.width - 40);
  });

  it("never uses top-left in rtl (close reserved)", () => {
    const position = computeToggleButtonPosition({
      labelRect: tinyLabel,
      spotlight,
      viewport,
      avoidRects,
      dir: "rtl",
    });
    expect(position.x).toBeGreaterThan(40);
  });
});
```

Adapt the “fill edges” fixture if needed so the test actually forces a corner fallback (mirror the existing corner test style in this file). The assertion that matters: LTR candidates exclude top-right; RTL candidates exclude top-left.

Update existing `computeLabelHideOffsetPx` calls if the signature changes to an options object — keep LTR defaults so existing expectations stay `100 + 200 + LABEL_HIDE_MARGIN_PX`.

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- tests/labelOverlapToggle.test.ts`  
Expected: FAIL (unknown options / `dir` not accepted)

- [ ] **Step 3: Implement helpers**

In `src/overlay/labelOverlapToggle.ts`:

1. Import `TextDirection` from `../types`.
2. Extend `ToggleButtonPositionInput` with `dir?: TextDirection` (default `"ltr"`).
3. Change `CornerName` to `"bottom-right" | "bottom-left" | "top-left" | "top-right"`.
4. Replace the fixed corner list with:

```typescript
const dir: TextDirection = input.dir ?? "ltr";
const cornerCandidates: CornerName[] =
  dir === "rtl"
    ? ["bottom-right", "bottom-left", "top-right"]
    : ["bottom-right", "bottom-left", "top-left"];
```

Add `top-right` to `cornerAnchor`:

```typescript
case "top-right":
  return {
    x: input.viewport.width - VIEWPORT_CLAMP_MARGIN_PX - half,
    y: VIEWPORT_CLAMP_MARGIN_PX + half,
  };
```

5. Replace `computeLabelHideOffsetPx` with options-object form (backward-compatible defaults):

```typescript
export function computeLabelHideOffsetPx(
  label: { left: number; width: number },
  options: {
    marginPx?: number;
    dir?: TextDirection;
    viewportWidth?: number;
  } = {},
): number {
  const marginPx = options.marginPx ?? LABEL_HIDE_MARGIN_PX;
  const dir = options.dir ?? "ltr";
  if (dir === "rtl") {
    const viewportWidth = options.viewportWidth ?? 0;
    return viewportWidth - label.left + marginPx;
  }
  return label.left + label.width + marginPx;
}
```

Update existing unit tests that passed a bare number as the second arg:

```typescript
expect(computeLabelHideOffsetPx({ left: 50, width: 80 }, { marginPx: 10 })).toBe(140);
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- tests/labelOverlapToggle.test.ts`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/overlay/labelOverlapToggle.ts tests/labelOverlapToggle.test.ts
git commit -m "$(cat <<'EOF'
feat: make label hide offset and toggle corners dir-aware

EOF
)"
```

---

### Task 3: OverlayRenderer — store `dir`, isolate root, mirror chrome

**Files:**
- Modify: `src/overlay/OverlayRenderer.ts`
- Modify: `tests/OverlayRenderer.test.ts`
- Modify: `src/StepController.ts` (constructor default only if needed in Task 4; prefer wiring there)

- [ ] **Step 1: Write failing tests**

Add to `tests/OverlayRenderer.test.ts`:

```typescript
it("sets root dir to ltr by default and pins the close button top-right", () => {
  const renderer = new OverlayRenderer();
  renderer.mount();
  const root = document.querySelector(".enjoyhint");
  expect(root?.getAttribute("dir")).toBe("ltr");
  const closeButton = root?.querySelector<HTMLElement>(".enjoyhint_close_btn");
  expect(closeButton?.style.right).toBe("10px");
  expect(closeButton?.style.left).toBe("");
  renderer.destroy();
});

it("sets root dir to rtl and pins the close button top-left", () => {
  const renderer = new OverlayRenderer(document.body, "rgba(0,0,0,0.6)", "rtl");
  renderer.mount();
  const root = document.querySelector(".enjoyhint");
  expect(root?.getAttribute("dir")).toBe("rtl");
  const closeButton = root?.querySelector<HTMLElement>(".enjoyhint_close_btn");
  expect(closeButton?.style.left).toBe("10px");
  expect(closeButton?.style.right).toBe("");
  renderer.destroy();
});

it("mirrors nav button order for rtl (skip, next, prev left-to-right)", () => {
  const renderer = new OverlayRenderer(document.body, "rgba(0,0,0,0.6)", "rtl");
  renderer.mount();
  renderer.show();
  renderer.showNext();
  renderer.showPrev();
  renderer.showSkip();
  // Force known widths via text if needed, then:
  renderer.positionButtons({
    labelX: 100,
    labelY: 80,
    labelWidth: 120,
    labelHeight: 30,
    xFrom: 160,
    yFrom: 100,
    xTo: 200,
    yTo: 200,
    viewportWidth: 800,
    viewportHeight: 600,
  });
  const prev = document.querySelector<HTMLElement>(".enjoyhint_prev_btn")!;
  const next = document.querySelector<HTMLElement>(".enjoyhint_next_btn")!;
  const skip = document.querySelector<HTMLElement>(".enjoyhint_skip_btn")!;
  const prevLeft = Number.parseFloat(prev.style.left);
  const nextLeft = Number.parseFloat(next.style.left);
  const skipLeft = Number.parseFloat(skip.style.left);
  expect(skipLeft).toBeLessThan(nextLeft);
  expect(nextLeft).toBeLessThan(prevLeft);
  renderer.destroy();
});

it("slides the label to the right when hidden in rtl", () => {
  vi.useFakeTimers();
  const renderer = new OverlayRenderer(document.body, "rgba(0,0,0,0.6)", "rtl");
  renderer.mount();
  renderer.scheduleLabelPresentation("Click the target", { x: 40, y: 60 }, { oversized: true });
  vi.advanceTimersByTime(450);
  renderer.configureLabelOverlapToggle({
    overlaps: true,
    anchorX: 100,
    anchorY: 200,
    labelLeft: 40,
    labelWidth: 120,
    viewportWidth: 800,
    resetHidden: true,
  });
  document.querySelector<HTMLElement>(".enjoyhint_label_toggle_btn")!.click();
  const label = document.querySelector<HTMLElement>(".enjoy_hint_label")!;
  // offset = viewportWidth - labelLeft + margin = 800 - 40 + 24
  expect(label.style.transform).toBe(`translateX(${800 - 40 + 24}px)`);
  renderer.destroy();
  vi.useRealTimers();
});

it("keeps spotlight blockers identical for ltr and rtl dir", () => {
  document.documentElement.style.direction = "rtl";

  const measure = (dir: "ltr" | "rtl") => {
    const renderer =
      dir === "rtl"
        ? new OverlayRenderer(document.body, "rgba(0,0,0,0.6)", "rtl")
        : new OverlayRenderer();
    renderer.mount();
    expect(document.querySelector(".enjoyhint")?.getAttribute("dir")).toBe(dir);
    renderer.renderSpotlight(
      { shape: "rect", x: 100, y: 120, width: 80, height: 40 },
      { immediate: true },
    );
    const styles = [...document.querySelectorAll<HTMLElement>(".enjoyhint_disable_events")].map(
      (el) => ({
        top: el.style.top,
        left: el.style.left,
        width: el.style.width,
        height: el.style.height,
      }),
    );
    renderer.destroy();
    return styles;
  };

  expect(measure("rtl")).toEqual(measure("ltr"));
  document.documentElement.style.direction = "";
});
```

If comparing `cssText` is brittle, assert each blocker’s `top`/`left`/`width`/`height` instead. Prefer matching whatever existing blocker tests already assert.

Also update the existing close-button assertion in `"mounts and controls the overlay shell"` so it still expects top-right for the default constructor.

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- tests/OverlayRenderer.test.ts`  
Expected: FAIL (constructor arity / missing `dir` behavior)

- [ ] **Step 3: Implement OverlayRenderer changes**

1. Import `TextDirection` and update hide-offset call site.
2. Constructor:

```typescript
private readonly dir: TextDirection;

constructor(
  container: HTMLElement = document.body,
  spotlightFill = "rgba(0,0,0,0.6)",
  dir: TextDirection = "ltr",
) {
  this.container = container;
  this.spotlightFill = spotlightFill;
  this.dir = dir;
}
```

3. In `mount()`, after creating `root`:

```typescript
root.setAttribute("dir", this.dir);
```

4. Close button positioning:

```typescript
this.closeButton.style.top = "10px";
if (this.dir === "rtl") {
  this.closeButton.style.left = "10px";
  this.closeButton.style.right = "";
} else {
  this.closeButton.style.right = "10px";
  this.closeButton.style.left = "";
}
```

5. In `positionButtons`, keep the existing LTR `distance` / `nextLeft` / `skipLeft` computation and `clampButtonRowToViewport` call unchanged. After clamp, branch on `dir`:

```typescript
const rowSkipWidth = this.getLayoutButtonWidth(this.skipButton, 0, isMobileViewport);
const clampedRow = this.clampButtonRowToViewport({
  distance,
  verticalPosition,
  nextLeft,
  skipLeft,
  skipWidth: rowSkipWidth,
  // ...existing viewport / label / spotlight / arrow fields
});

if (this.dir === "rtl") {
  const left = clampedRow.distance;
  const skipW = rowSkipWidth;
  const nextW = resolvedNextWidth;
  const prevW = resolvedPrevWidth;
  // Order Skip → Next → Prev from the clamped row start, then shift so the
  // row's right edge matches the LTR-clamped right edge.
  let skipL = left;
  let nextL = left + skipW + 10;
  let prevL = left + skipW + nextW + 20;
  if (!this.nextVisible) {
    prevL = left + skipW + 10;
  }
  if (!this.prevVisible) {
    nextL = left + skipW + 10;
  }
  const rtlRight = this.prevVisible
    ? prevL + prevW
    : this.nextVisible
      ? nextL + nextW
      : skipL + skipW;
  const ltrRight = clampedRow.skipLeft + skipW;
  const shift = ltrRight - rtlRight;
  skipL += shift;
  nextL += shift;
  prevL += shift;

  this.setButtonPosition(this.skipButton, skipL, clampedRow.verticalPosition);
  this.setButtonPosition(this.nextButton, nextL, clampedRow.verticalPosition);
  this.setButtonPosition(this.prevButton, prevL, clampedRow.verticalPosition);
  this.buttonRowRect = {
    top: clampedRow.verticalPosition,
    bottom: clampedRow.verticalPosition + LEGACY_BUTTON_HEIGHT_PX,
    left: Math.min(skipL, nextL, prevL),
    right: Math.max(skipL + skipW, nextL + nextW, prevL + prevW),
  };
} else {
  this.setButtonPosition(this.prevButton, clampedRow.distance, clampedRow.verticalPosition);
  this.setButtonPosition(this.nextButton, clampedRow.nextLeft, clampedRow.verticalPosition);
  this.setButtonPosition(this.skipButton, clampedRow.skipLeft, clampedRow.verticalPosition);
  this.buttonRowRect = {
    top: clampedRow.verticalPosition,
    bottom: clampedRow.verticalPosition + LEGACY_BUTTON_HEIGHT_PX,
    left: clampedRow.distance,
    right: clampedRow.skipLeft + rowSkipWidth,
  };
}
this.revealPositionedButtons();
```

6. Update `configureLabelOverlapToggle` input to include `viewportWidth?: number` and:

```typescript
this.labelHideOffsetPx = computeLabelHideOffsetPx(
  { left: input.labelLeft, width: input.labelWidth },
  {
    dir: this.dir,
    viewportWidth: input.viewportWidth ?? window.innerWidth,
  },
);
```

7. Update `applyLabelHiddenTransform`:

```typescript
this.labelContainer.style.transform =
  this.dir === "rtl"
    ? `translateX(${this.labelHideOffsetPx}px)`
    : `translateX(-${this.labelHideOffsetPx}px)`;
this.labelContainer.style.opacity = "0";
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- tests/OverlayRenderer.test.ts`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/overlay/OverlayRenderer.ts tests/OverlayRenderer.test.ts
git commit -m "$(cat <<'EOF'
feat: mirror EnjoyHint overlay chrome when dir is rtl

EOF
)"
```

---

### Task 4: Wire `dir` through StepController + close avoid-rect

**Files:**
- Modify: `src/StepController.ts`
- Modify: `tests/StepController.test.ts` (only if a focused test is needed)

- [ ] **Step 1: Pass `dir` into the default OverlayRenderer**

In `StepController` constructor:

```typescript
renderer: OverlayRenderer = new OverlayRenderer(
  document.body,
  options.backgroundColor,
  options.dir ?? "ltr",
),
```

- [ ] **Step 2: Mirror the close avoid-rect and pass `dir` + `viewportWidth` into toggle helpers**

In `renderLabel`’s deferred toggle block (~lines 309–332):

```typescript
const closeButtonRect =
  (this.callbacks.dir ?? "ltr") === "rtl"
    ? { top: 0, right: 60, bottom: 60, left: 0 }
    : { top: 0, right: viewport.width, bottom: 60, left: viewport.width - 60 };

const togglePosition = computeToggleButtonPosition({
  labelRect,
  spotlight,
  avoidRects,
  buttonSize: LABEL_TOGGLE_BUTTON_SIZE_PX,
  viewport,
  dir: this.callbacks.dir ?? "ltr",
});

this.renderer.configureLabelOverlapToggle({
  overlaps: overlapsSpotlight,
  anchorX: togglePosition.x,
  anchorY: togglePosition.y,
  labelLeft: labelRect.left,
  labelWidth: placement.label.width,
  viewportWidth: viewport.width,
  resetHidden: !options.immediate,
});
```

`this.callbacks` already spreads `EnjoyHintOptions`, so `dir` is available. Prefer reading from a dedicated `private readonly dir` set in the constructor for clarity:

```typescript
private readonly dir: TextDirection;

// in constructor:
this.dir = options.dir ?? "ltr";
```

Use `this.dir` everywhere in this task.

- [ ] **Step 3: Add a small unit test (optional but recommended)**

In `tests/StepController.test.ts`, if there is already an oversized/toggle test, extend it with `dir: "rtl"` and assert the toggle button’s `left` is not in the top-left 60×60 close zone when forced into a corner — or skip if OverlayRenderer + helper tests already cover this path.

- [ ] **Step 4: Run unit tests**

Run: `npm test -- tests/StepController.test.ts tests/OverlayRenderer.test.ts tests/labelOverlapToggle.test.ts tests/EnjoyHint.test.ts`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/StepController.ts tests/StepController.test.ts
git commit -m "$(cat <<'EOF'
feat: wire dir option through StepController for RTL chrome

EOF
)"
```

---

### Task 5: CSS direction isolation

**Files:**
- Modify: `src/jquery.enjoyhint.css`

- [ ] **Step 1: Pin direction on the overlay root**

On `.enjoyhint` (existing rule ~line 13), add:

```css
.enjoyhint {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 1010;
  pointer-events: none;
  overflow: hidden;
  direction: ltr; /* isolate from host; overridden by [dir=rtl] */
}

.enjoyhint[dir="rtl"] {
  direction: rtl;
}
```

This matches issue #138’s workaround while still allowing opt-in RTL chrome via the `dir` attribute set in JS.

- [ ] **Step 2: Commit**

```bash
git add src/jquery.enjoyhint.css
git commit -m "$(cat <<'EOF'
fix: isolate overlay direction from host page (#138)

EOF
)"
```

---

### Task 6: Full regression + typecheck

- [ ] **Step 1: Typecheck**

Run: `npm run typecheck`  
Expected: PASS

- [ ] **Step 2: Full unit suite**

Run: `npm test`  
Expected: PASS (all existing LTR tests green; new RTL tests green)

- [ ] **Step 3: Update design spec plan link**

In `docs/superpowers/specs/2026-07-15-rtl-support-design.md` header, add:

```markdown
**Plan:** `docs/superpowers/plans/2026-07-15-rtl-support.md`
```

- [ ] **Step 4: Commit plan + spec link (if not already committed)**

```bash
git add docs/superpowers/plans/2026-07-15-rtl-support.md docs/superpowers/specs/2026-07-15-rtl-support-design.md
git commit -m "$(cat <<'EOF'
docs: add RTL support implementation plan

EOF
)"
```

---

## Spec coverage checklist

| Spec requirement | Task |
| --- | --- |
| `dir?: "ltr" \| "rtl"` on options | Task 1 |
| Default `"ltr"`; host isolation via root `dir` + CSS | Tasks 3, 5 |
| Close corner mirrors | Task 3 |
| Nav button order mirrors | Task 3 |
| Label hide slides opposite edge | Tasks 2, 3 |
| Toggle skips mirrored close corner | Tasks 2, 4 |
| Spotlight/blockers unchanged | Task 3 isolation test |
| Unit coverage + LTR regression | Tasks 2–4, 6 |
| No auto-detect / per-step / string translation | (non-goals — not implemented) |
