# Targetless Steps (No Selector / No Spotlight) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Allow steps with no `selector` to show a full-screen dim, centered plain description, and nav buttons — with no spotlight hole and no arrow.

**Architecture:** After normalize, `selector === ""` selects a dedicated branch in `StepController`: skip query/scroll, render a collapsed (zero-size) spotlight via existing `OverlayRenderer.renderSpotlight` + `LEGACY_COLLAPSED_SPOTLIGHT_STATE`, center the label with `scheduleLabelPresentation` (`oversized: false`), position buttons against that label, and bind custom/key/DOM events on `document` when there is no target element.

**Tech Stack:** TypeScript, Vitest, Playwright e2e — no new dependencies.

**Spec:** `docs/superpowers/specs/2026-07-16-targetless-steps-design.md`

---

## File structure

| File | Responsibility |
| --- | --- |
| `src/StepController.ts` | Detect empty selector; targetless render + event bind + resize refresh |
| `src/overlay/SvgMaskSpotlight.ts` | Already exports `LEGACY_COLLAPSED_SPOTLIGHT_STATE` (reuse; no behavior change) |
| `src/overlay/OverlayRenderer.ts` | No required API change if collapsed spotlight is rendered via public `renderSpotlight` |
| `src/StepNormalizer.ts` | Already leaves `selector: ""` when omitted — add a unit test only |
| `tests/StepController.test.ts` | Unit coverage for targetless path |
| `tests/StepNormalizer.test.ts` | Object form without selector |

---

### Task 1: Normalizer — empty selector preserved

**Files:**
- Modify: `tests/StepNormalizer.test.ts`
- No production change expected (normalize already defaults `selector: ""`)

- [ ] **Step 1: Write the failing/expected test**

Add to `tests/StepNormalizer.test.ts`:

```ts
it("keeps selector empty for object-form steps without selector", () => {
  const step = normalizeStep({
    event: "next",
    description: "Welcome with no target",
  });

  expect(step.selector).toBe("");
  expect(step.event).toBe("next");
  expect(step.eventType).toBeUndefined();
  expect(step.description).toBe("Welcome with no target");
});

it("sets eventType next when provided explicitly without selector", () => {
  const step = normalizeStep({
    event: "next",
    event_type: "next",
    description: "Welcome",
  });

  expect(step.selector).toBe("");
  expect(step.eventType).toBe("next");
});
```

Note: `normalizeStep` only sets `eventType` from `event_type` or from shorthand. Object-form `{ event: "next" }` does **not** currently set `eventType: "next"`. Targeted steps that use shorthand get `eventType` from the key. For targetless object form, authors must pass `event_type: "next"` **or** the controller must treat `event === "next"` like `eventType === "next"` for button visibility.

**Plan decision (lock this in):** In `renderButtons` / advance rules, treat `step.event === "next"` the same as `step.eventType === "next"` when showing Next (minimal change so `{ event: "next", description }` works without requiring `event_type`). Prefer also setting `eventType` in the normalizer when `event === "next"` and no shorthand was used — do that in Task 1 Step 3 if the test above fails on `eventType`.

- [ ] **Step 2: Run test**

```bash
npx vitest run tests/StepNormalizer.test.ts
```

Expected: new tests may fail on `eventType` if not set; `selector` / `description` should already pass.

- [ ] **Step 3: Minimal normalizer fix (only if needed)**

In `src/StepNormalizer.ts`, after copying `event` / `event_type`, if `step.eventType` is still undefined and `step.event === "next"`, set `step.eventType = "next"`. Same for `step.event === "auto"` → `"auto"`. Do **not** invent custom from arbitrary event names here (shorthand path already handles `custom*`).

```ts
if (step.eventType === undefined) {
  if (step.event === "next") step.eventType = "next";
  else if (step.event === "auto") step.eventType = "auto";
}
```

- [ ] **Step 4: Re-run tests**

```bash
npx vitest run tests/StepNormalizer.test.ts
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add tests/StepNormalizer.test.ts src/StepNormalizer.ts
git commit -m "test: cover object-form steps with empty selector"
```

---

### Task 2: Failing StepController tests for targetless next step

**Files:**
- Modify: `tests/StepController.test.ts`

- [ ] **Step 1: Write failing tests**

Append inside `describe("StepController", ...)`:

```ts
it("renders a targetless next step with no spotlight hole and centered label", () => {
  const onEnd = vi.fn();
  const controller = new StepController(
    [
      makeStep({
        selector: "",
        event: "next",
        eventType: "next",
        description: "Targetless welcome",
      }),
    ],
    { onEnd },
  );

  controller.run();
  advanceStepPresentation();

  expect(onEnd).not.toHaveBeenCalled();
  expect(controller.getCurrentStep()).toBe(0);

  const label = document.querySelector<HTMLElement>("#enjoyhint_label");
  expect(label).toBeTruthy();
  expect(label?.textContent).toContain("Targetless welcome");
  expect(label?.style.backgroundColor).not.toBe("rgb(39, 42, 38)");

  const viewportW = window.innerWidth || document.documentElement.clientWidth;
  const viewportH = window.innerHeight || document.documentElement.clientHeight;
  const labelLeft = Number.parseFloat(label!.style.left);
  const labelTop = Number.parseFloat(label!.style.top);
  expect(labelLeft).toBeGreaterThan(viewportW * 0.1);
  expect(labelLeft).toBeLessThan(viewportW * 0.9);
  expect(labelTop).toBeGreaterThan(viewportH * 0.1);
  expect(labelTop).toBeLessThan(viewportH * 0.9);

  const hole = document.querySelector("rect[data-enjoyhint-spotlight-hole]");
  const holeW = Number(hole?.getAttribute("width") ?? "-1");
  const holeH = Number(hole?.getAttribute("height") ?? "-1");
  expect(holeW).toBe(0);
  expect(holeH).toBe(0);

  expect(document.querySelector("#enjoyhint_arrpw_line")).toBeNull();
  expect(document.querySelector(".enjoyhint_next_btn")).toBeTruthy();
});

it("advances a targetless next step via Next trigger", () => {
  addTarget();
  const controller = new StepController([
    makeStep({
      selector: "",
      event: "next",
      eventType: "next",
      description: "Intro",
    }),
    makeStep({ event: "next", eventType: "next", description: "Click me" }),
  ]);

  controller.run();
  advanceStepPresentation();
  expect(controller.getCurrentStep()).toBe(0);

  controller.trigger("next");
  advanceStepPresentation();
  expect(controller.getCurrentStep()).toBe(1);
});

it("still finishes when a non-empty selector is missing", () => {
  const onEnd = vi.fn();
  const controller = new StepController(
    [makeStep({ selector: ".does-not-exist", event: "next", eventType: "next" })],
    { onEnd },
  );

  controller.run();
  advanceStepRender();

  expect(onEnd).toHaveBeenCalled();
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npx vitest run tests/StepController.test.ts -t "targetless|still finishes"
```

Expected: FAIL — empty selector currently hits `finish()` / `onEnd`.

- [ ] **Step 3: Commit failing tests**

```bash
git add tests/StepController.test.ts
git commit -m "test: add failing coverage for targetless steps"
```

---

### Task 3: Implement targetless render path in StepController

**Files:**
- Modify: `src/StepController.ts`

- [ ] **Step 1: Import collapsed spotlight constant**

At top of `src/StepController.ts`:

```ts
import {
  LEGACY_COLLAPSED_SPOTLIGHT_STATE,
} from "./overlay/SvgMaskSpotlight";
```

- [ ] **Step 2: Branch in `renderStep` before query**

Inside `scheduleStep` (the callback that currently queries the target), replace the early missing-target finish with:

```ts
const scheduleStep = () => {
  if (!this.isCurrentStepToken(token)) {
    return;
  }

  if (!step.selector) {
    this.scheduleStepTimeout(() => {
      if (!this.isCurrentStepToken(token)) {
        return;
      }
      this.renderTargetlessOverlay(step);
      this.bindStepEvents(step, null);
    }, getLegacyStepRenderDelay(LEGACY_DEFAULT_SCROLL_SPEED_MS));
    return;
  }

  const target = this.dom.query(step.selector);
  if (!target) {
    this.finish();
    return;
  }

  // ... existing scroll + renderOverlay path unchanged ...
};
```

Keep the outer `timeout` handling that wraps `scheduleStep` unchanged.

- [ ] **Step 3: Add `renderTargetlessOverlay`**

```ts
private renderTargetlessOverlay(
  step: NormalizedStep,
  options: { immediate?: boolean } = {},
): void {
  const viewport = {
    width: window.innerWidth || document.documentElement.clientWidth,
    height: window.innerHeight || document.documentElement.clientHeight,
  };

  this.renderer.mount();
  this.renderer.setStepClass(this.currentStep + 1);
  this.renderer.show();
  this.renderer.renderSpotlight(
    {
      shape: "rect",
      x: LEGACY_COLLAPSED_SPOTLIGHT_STATE.centerX,
      y: LEGACY_COLLAPSED_SPOTLIGHT_STATE.centerY,
      width: LEGACY_COLLAPSED_SPOTLIGHT_STATE.width,
      height: LEGACY_COLLAPSED_SPOTLIGHT_STATE.height,
      radius: LEGACY_COLLAPSED_SPOTLIGHT_STATE.radius,
    },
    options,
  );

  this.renderButtons(step);

  const { width: labelWidth, height: labelHeight } = this.renderer.measureLabel(
    step.description,
  );
  const labelX = Math.round((viewport.width - labelWidth) / 2);
  const labelY = Math.round((viewport.height - labelHeight) / 2);

  this.renderer.scheduleLabelPresentation(step.description, {
    x: labelX,
    y: labelY,
  }, {
    oversized: false,
  });

  // Match renderLabel: position buttons on a 0ms scheduled tick so tests that
  // only advance the step-render delay still see chrome; label itself appears
  // after LEGACY_LABEL_ARROW_DELAY_MS via scheduleLabelPresentation.
  this.scheduleStepTimeout(() => {
    this.renderer.positionButtons({
      labelX,
      labelY,
      labelWidth,
      labelHeight,
      xFrom: labelX + labelWidth / 2,
      yFrom: labelY + labelHeight,
      xTo: labelX + labelWidth / 2,
      yTo: labelY + labelHeight,
      viewportWidth: viewport.width,
      viewportHeight: viewport.height,
    });

    this.renderer.configureLabelOverlapToggle({
      overlaps: false,
      anchorX: 0,
      anchorY: 0,
      labelLeft: 0,
      labelWidth: 0,
      resetHidden: !options.immediate,
    });
  }, 0);
}
```

- [ ] **Step 4: Update `bindStepEvents` to accept `null` target**

Change signature to `bindStepEvents(step: NormalizedStep, target: Element | null)`.

```ts
private bindStepEvents(step: NormalizedStep, target: Element | null): void {
  if (step.eventType === "auto") {
    if (!target) {
      // Spec: auto requires a selector — do not auto-advance.
      return;
    }
    if (step.event === "click" && target instanceof HTMLElement) {
      target.click();
    } else {
      target.dispatchEvent(new Event(step.event));
    }
    this.next();
    return;
  }

  if (step.eventType === "custom") {
    this.eventBus.on(step.event, () => this.next());
    this.stepDisposers.push(() => this.eventBus.off(step.event));
    return;
  }

  if (step.eventType === "next" || step.event === "next") {
    return;
  }

  const eventName = step.event === "key" ? "keydown" : step.event;
  const handler = (event: Event) => {
    if (step.keyCode !== undefined && this.getEventKeyCode(event) !== step.keyCode) {
      return;
    }
    this.next();
  };

  if (!target) {
    this.stepDisposers.push(this.dom.addDocumentEvent(eventName, handler));
    return;
  }

  const eventTarget = step.eventSelector ? this.dom.query(step.eventSelector) : target;
  if (!eventTarget) {
    return;
  }

  this.stepDisposers.push(this.dom.addEvent(eventTarget, eventName, handler));
}
```

- [ ] **Step 5: Update `refreshCurrentStep` for resize**

```ts
private refreshCurrentStep(): void {
  const step = this.steps[this.currentStep];
  if (!step) {
    return;
  }

  if (!step.selector) {
    this.renderTargetlessOverlay(step, { immediate: true });
    return;
  }

  const target = this.dom.query(step.selector);
  if (target) {
    this.renderOverlay(step, target, undefined, { immediate: true });
  }
}
```

- [ ] **Step 6: Run Task 2 tests**

```bash
npx vitest run tests/StepController.test.ts -t "targetless|still finishes"
```

Expected: PASS

Also run full suite for this file:

```bash
npx vitest run tests/StepController.test.ts
```

Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add src/StepController.ts tests/StepController.test.ts
git commit -m "feat: support targetless steps with centered label and no spotlight"
```

---

### Task 4: Targetless custom + key events

**Files:**
- Modify: `tests/StepController.test.ts`
- Modify: `src/StepController.ts` only if tests reveal gaps

- [ ] **Step 1: Write tests**

```ts
it("advances a targetless custom step on matching trigger", () => {
  const controller = new StepController([
    makeStep({
      selector: "",
      event: "proceed",
      eventType: "custom",
      description: "Wait for trigger",
    }),
    makeStep({
      selector: "",
      event: "next",
      eventType: "next",
      description: "After",
    }),
  ]);

  controller.run();
  advanceStepPresentation();
  controller.trigger("other");
  expect(controller.getCurrentStep()).toBe(0);

  controller.trigger("proceed");
  advanceStepPresentation();
  expect(controller.getCurrentStep()).toBe(1);
});

it("advances a targetless key step on document keydown", () => {
  const controller = new StepController([
    makeStep({
      selector: "",
      event: "key",
      keyCode: 13,
      description: "Press enter",
    }),
  ]);

  controller.run();
  advanceStepPresentation();

  document.dispatchEvent(new KeyboardEvent("keydown", { keyCode: 27 }));
  expect(controller.getCurrentStep()).toBe(0);

  document.dispatchEvent(new KeyboardEvent("keydown", { keyCode: 13 }));
  expect(controller.getCurrentStep()).toBe(1);
});

it("does not auto-advance a targetless auto step", () => {
  const controller = new StepController([
    makeStep({
      selector: "",
      event: "click",
      eventType: "auto",
      description: "Should stay",
    }),
  ]);

  controller.run();
  advanceStepPresentation();
  expect(controller.getCurrentStep()).toBe(0);
});
```

- [ ] **Step 2: Run tests**

```bash
npx vitest run tests/StepController.test.ts -t "targetless custom|targetless key|targetless auto"
```

Expected: PASS with Task 3 implementation. If document listener is missing, fix `bindStepEvents` as in Task 3.

- [ ] **Step 3: Commit**

```bash
git add tests/StepController.test.ts src/StepController.ts
git commit -m "test: cover targetless custom, key, and auto edge cases"
```

---

### Task 5: Verification + spec plan link

**Files:**
- Modify: `docs/superpowers/specs/2026-07-16-targetless-steps-design.md` (plan path status only)

- [ ] **Step 1: Full verification**

```bash
npm test
npm run typecheck
```

Expected: all green.

- [ ] **Step 2: Point the spec at the plan**

In the design spec header, ensure:

```md
**Plan:** `docs/superpowers/plans/2026-07-16-targetless-steps.md`
```

(remove any “to be written” note)

- [ ] **Step 3: Commit**

```bash
git add docs/superpowers/specs/2026-07-16-targetless-steps-design.md
git commit -m "docs: link targetless-steps plan from design spec"
```

---

## Spec coverage checklist

| Spec requirement | Task |
| --- | --- |
| Omit `selector` object-form API | Task 1 |
| Empty selector → targetless; missing non-empty → finish | Task 2, Task 3 |
| Full dim, no hole | Task 2, Task 3 |
| Centered plain label, no arrow, no overlap toggle | Task 3 |
| Next / custom / key / document events; auto no-op without selector | Task 3, Task 4 |
| Resize re-centers | Task 3 (`refreshCurrentStep`) |
| Unit tests | Task 2–4 |
| Ignored shape/margin/arrow fields | Implicit (targetless path never reads them) |
