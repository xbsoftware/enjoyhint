# EnjoyHint TypeScript Rewrite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite EnjoyHint as a zero-runtime-dependency TypeScript library using native DOM and SVG masks, with full backward compatibility for the public API and step configs.

**Architecture:** Incremental strangler — build TypeScript modules alongside legacy JS (`src/enjoyhint.js`, `src/jquery.enjoyhint.js`). Wire examples to the new build only after automated parity passes in Milestone 6. Archive legacy source to `src/legacy/` at Milestone 8.

**Tech Stack:** TypeScript (strict), Vite (library mode: ESM/CJS/IIFE), Vitest, native DOM/SVG APIs

**Spec:** `docs/superpowers/specs/2026-06-14-enjoyhint-typescript-rewrite-design.md`

---

## File Map

| File                              | Responsibility                                                        |
| --------------------------------- | --------------------------------------------------------------------- |
| `package.json`                    | Scripts, devDeps; runtime deps removed at M7 after parity passes       |
| `tsconfig.json`                   | Strict TS, DOM lib                                                    |
| `vite.config.ts`                  | ESM + CJS + IIFE library builds                                       |
| `vitest.config.ts`                | Test runner config                                                    |
| `src/index.ts`                    | Public entry; exports `EnjoyHint`, types; IIFE global                 |
| `src/types.ts`                    | `EnjoyHintOptions`, `NormalizedStep`, `ButtonConfig`, `SpotlightRect` |
| `src/EnjoyHint.ts`                | Public class delegating to `StepController`                           |
| `src/StepNormalizer.ts`           | Legacy step → `NormalizedStep`                                        |
| `src/StepController.ts`           | Step flow, events, callbacks                                          |
| `src/DomAdapter.ts`               | Selectors, listeners, `getBoundingClientRect`                         |
| `src/ScrollHelper.ts`             | Scroll with `-200px` offset + `onAfter`                               |
| `src/EventBus.ts`                 | Custom event dispatch for `trigger()`                                 |
| `src/overlay/OverlayRenderer.ts`  | Mount/unmount overlay shell                                           |
| `src/overlay/SvgMaskSpotlight.ts` | SVG mask dark overlay + spotlight                                     |
| `src/overlay/SvgArrow.ts`         | Curved arrow path + `arrowColor`                                      |
| `src/overlay/EventBlockers.ts`    | Four blocker div positioning                                          |
| `src/overlay/labelPlacement.ts`   | Label side selection + coordinates                                    |
| `src/overlay/geometry.ts`         | Spotlight bounds from element + offsets                               |
| `src/enjoyhint.css`               | Trimmed CSS (copied from `jquery.enjoyhint.css`)                      |
| `tests/*.test.ts`                 | Vitest unit tests                                                     |
| `src/legacy/`                     | Archived `enjoyhint.js`, `jquery.enjoyhint.js` (M8)                   |

**Unchanged during migration:** `examples/example1/script.js`, step configs inside HTML/JS — only `<script>`/`<link>` tags change after automated parity passes.

---

## Hard Parity Rule

This rewrite removes dependencies; it must not redesign EnjoyHint. All visual output and runtime behavior must remain the same as the legacy implementation for the same options, step configs, DOM, viewport, scroll position, and user action sequence.

No visual/runtime task is complete until tests compare the new implementation against the legacy implementation and prove parity for the behavior being changed. Manual browser checks are required but not sufficient.

Tests must cover, as applicable:

- Overlay color, opacity, spotlight shape, margins, radius, animation timing, and movement
- Label HTML rendering, dimensions, placement, fallback behavior, and responsive behavior
- Arrow path, marker, endpoint selection, color validation, and timing
- Next/Prev/Skip/Close button visibility, text, classes, placement, and click behavior
- Event blockers, target click-through behavior, body scroll lock, touch handling, resize, scroll, and cleanup
- Public callbacks and event flows: click, key, next, previous, skip, auto, custom trigger, resume, stop, end

If a test shows a visual or behavioral difference, treat it as a bug and fix it before moving to the next task. Do not remove dependencies, migrate examples, or archive legacy code until automated parity tests pass.

### Renderer And Animation Requirements

SVG is the selected dependency-free replacement for the KineticJS canvas renderer. Canvas is not required for animation: SVG can animate the spotlight mask, arrow, opacity, and geometry with CSS transitions, the Web Animations API, or `requestAnimationFrame`.

Implementation requirements:

- Do not ship a static spotlight. Match the legacy Kinetic tween timing, movement, start geometry, midpoint samples, and final geometry.
- Port close button placement exactly. The close button must appear where legacy places it, including the expected top-right placement relative to the active label/button cluster, not a default top-left position.
- Port button, label, arrow, blocker, and spotlight positioning from legacy formulas before attempting cleanup or simplification.
- Add automated parity checks for animation samples and close-button placement before migrating examples or removing runtime dependencies.
- If SVG cannot match a legacy animation or placement after evidence from parity tests, stop and update the spec/plan for approval before considering a canvas fallback. Do not silently reintroduce canvas.

---

## Milestone 1: Vite + TypeScript Scaffolding

### Task 1: Tooling and placeholder entry

**Files:**

- Create: `tsconfig.json`, `vite.config.ts`, `vitest.config.ts`
- Create: `src/index.ts`, `src/types.ts`
- Modify: `package.json`

- [ ] **Step 1: Add dev dependencies**

```bash
npm install --save-dev typescript vite vitest @vitest/coverage-v8 vite-plugin-dts
```

- [ ] **Step 2: Create `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "strict": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "dist",
    "rootDir": "src",
    "skipLibCheck": true,
    "esModuleInterop": true,
    "isolatedModules": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  },
  "include": ["src"],
  "exclude": ["src/legacy", "node_modules", "dist"]
}
```

- [ ] **Step 3: Create `vite.config.ts`**

```typescript
import { defineConfig } from "vite";
import { resolve } from "path";
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
      output: { exports: "default" },
    },
    sourcemap: true,
    minify: "esbuild",
  },
});
```

- [ ] **Step 4: Create `vitest.config.ts`**

```typescript
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    include: ["tests/**/*.test.ts"],
  },
});
```

- [ ] **Step 5: Create `src/types.ts` (placeholder types)**

```typescript
export interface ButtonConfig {
  className?: string;
  text?: string;
}

export interface EnjoyHintOptions {
  onStart?: () => void;
  onEnd?: () => void;
  onSkip?: () => void;
  onNext?: () => void;
  btnNextText?: string;
  btnSkipText?: string;
  backgroundColor?: string;
}

export interface NormalizedStep {
  selector: string;
  event: string;
  eventType?: "auto" | "custom" | "next";
  eventSelector?: string;
  description: string;
  keyCode?: number;
  shape?: "rect" | "circle";
  radius?: number;
  margin?: number;
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
  scrollAnimationSpeed?: number;
  timeout?: number;
  arrowColor?: string;
  showNext?: boolean;
  showPrev?: boolean;
  showSkip?: boolean;
  nextButton?: ButtonConfig;
  prevButton?: ButtonConfig;
  skipButton?: ButtonConfig;
  onBeforeStart?: () => void;
}

export interface SpotlightRect {
  top: number;
  right: number;
  bottom: number;
  left: number;
  centerX: number;
  centerY: number;
}
```

- [ ] **Step 6: Create `src/index.ts` (placeholder export)**

```typescript
export type { EnjoyHintOptions, NormalizedStep, ButtonConfig } from "./types";

export class EnjoyHint {
  constructor(_options: import("./types").EnjoyHintOptions = {}) {
    throw new Error("EnjoyHint TypeScript implementation not yet wired");
  }
}

export default EnjoyHint;
```

- [ ] **Step 7: Update `package.json` scripts**

```json
{
  "main": "dist/enjoyhint.cjs",
  "module": "dist/enjoyhint.js",
  "types": "dist/index.d.ts",
  "files": ["dist"],
  "scripts": {
    "build": "vite build",
    "dev": "vite build --watch",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

Keep existing `dependencies` (jquery, kinetic, jquery.scrollto) — do not remove yet.

- [ ] **Step 8: Run validation**

```bash
npm run typecheck
npm run build
npm test
```

Expected: typecheck PASS, build produces `dist/enjoyhint.js`, `dist/enjoyhint.cjs`, `dist/enjoyhint.min.js`, vitest PASS (0 tests).

- [ ] **Step 9: Verify legacy examples still work**

Open `examples/example1.html` in browser (serves legacy `../src/enjoyhint.js`). Tour must still run.

- [ ] **Step 10: Commit**

```bash
git add package.json package-lock.json tsconfig.json vite.config.ts vitest.config.ts src/index.ts src/types.ts
git commit -m "chore: add Vite, TypeScript, and Vitest scaffolding"
```

---

## Milestone 2: Step Normalizer + Public API Skeleton

### Task 2: StepNormalizer with tests

**Files:**

- Create: `src/StepNormalizer.ts`
- Create: `tests/StepNormalizer.test.ts`
- Test: `tests/StepNormalizer.test.ts`

- [ ] **Step 1: Write failing tests**

Create `tests/StepNormalizer.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { normalizeStep } from "../src/StepNormalizer";

describe("normalizeStep", () => {
  it("parses legacy shorthand click step", () => {
    const step = normalizeStep({ "click .new_btn": "Click the button" });
    expect(step).toEqual({
      selector: ".new_btn",
      event: "click",
      description: "Click the button",
    });
  });

  it("parses next event type from shorthand", () => {
    const step = normalizeStep({ "next #block": "Hello" });
    expect(step.event).toBe("next");
    expect(step.eventType).toBe("next");
    expect(step.selector).toBe("#block");
    expect(step.description).toBe("Hello");
  });

  it("parses custom event type from shorthand", () => {
    const step = normalizeStep({ "custom_event .el": "Wait for data" });
    expect(step.event).toBe("custom_event");
    expect(step.eventType).toBe("custom");
  });

  it("parses explicit step config", () => {
    const step = normalizeStep({
      selector: ".btn",
      event: "click",
      description: "Click me",
      shape: "circle",
      radius: 30,
      showPrev: false,
      event_selector: ".other",
    });
    expect(step.selector).toBe(".btn");
    expect(step.event).toBe("click");
    expect(step.shape).toBe("circle");
    expect(step.radius).toBe(30);
    expect(step.showPrev).toBe(false);
    expect(step.eventSelector).toBe(".other");
  });

  it("maps snake_case event_selector", () => {
    const step = normalizeStep({
      selector: ".x",
      event: "click",
      description: "x",
      event_selector: "#y",
    });
    expect(step.eventSelector).toBe("#y");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- tests/StepNormalizer.test.ts
```

Expected: FAIL — module not found

- [ ] **Step 3: Implement `src/StepNormalizer.ts`**

```typescript
import type { NormalizedStep } from "./types";

type RawStep = Record<string, unknown>;

const EVENT_TYPES = new Set(["next", "auto", "custom"]);

export function normalizeStep(raw: RawStep): NormalizedStep {
  const step: NormalizedStep = { selector: "", event: "", description: "" };

  if (typeof raw.selector === "string") step.selector = raw.selector;
  if (typeof raw.event === "string") step.event = raw.event;
  if (typeof raw.description === "string") step.description = raw.description;
  if (typeof raw.event_selector === "string")
    step.eventSelector = raw.event_selector;
  if (typeof raw.event_type === "string")
    step.eventType = raw.event_type as NormalizedStep["eventType"];
  if (typeof raw.keyCode === "number") step.keyCode = raw.keyCode;
  if (raw.shape === "rect" || raw.shape === "circle") step.shape = raw.shape;
  if (typeof raw.radius === "number") step.radius = raw.radius;
  if (typeof raw.margin === "number") step.margin = raw.margin;
  if (typeof raw.top === "number") step.top = raw.top;
  if (typeof raw.right === "number") step.right = raw.right;
  if (typeof raw.bottom === "number") step.bottom = raw.bottom;
  if (typeof raw.left === "number") step.left = raw.left;
  if (typeof raw.scrollAnimationSpeed === "number")
    step.scrollAnimationSpeed = raw.scrollAnimationSpeed;
  if (typeof raw.timeout === "number") step.timeout = raw.timeout;
  if (typeof raw.arrowColor === "string") step.arrowColor = raw.arrowColor;
  if (typeof raw.showNext === "boolean") step.showNext = raw.showNext;
  if (typeof raw.showPrev === "boolean") step.showPrev = raw.showPrev;
  if (typeof raw.showSkip === "boolean") step.showSkip = raw.showSkip;
  if (raw.nextButton && typeof raw.nextButton === "object")
    step.nextButton = raw.nextButton as NormalizedStep["nextButton"];
  if (raw.prevButton && typeof raw.prevButton === "object")
    step.prevButton = raw.prevButton as NormalizedStep["prevButton"];
  if (raw.skipButton && typeof raw.skipButton === "object")
    step.skipButton = raw.skipButton as NormalizedStep["skipButton"];
  if (typeof raw.onBeforeStart === "function")
    step.onBeforeStart = raw.onBeforeStart as () => void;

  if (!step.selector) {
    for (const prop of Object.keys(raw)) {
      const parts = prop.split(" ");
      if (parts.length >= 2 && parts[1]) {
        step.selector = parts.slice(1).join(" ");
        step.event = parts[0];
        if (EVENT_TYPES.has(parts[0]))
          step.eventType = parts[0] as NormalizedStep["eventType"];
        step.description = String(raw[prop]);
        break;
      }
    }
  }

  return step;
}

export function normalizeSteps(rawSteps: RawStep[]): NormalizedStep[] {
  return rawSteps.map(normalizeStep);
}
```

- [ ] **Step 4: Run tests**

```bash
npm test -- tests/StepNormalizer.test.ts
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/StepNormalizer.ts tests/StepNormalizer.test.ts
git commit -m "feat: add StepNormalizer with legacy step parsing"
```

### Task 3: EnjoyHint public API skeleton

**Files:**

- Create: `src/EnjoyHint.ts`, `src/EventBus.ts`
- Modify: `src/index.ts`
- Create: `tests/EnjoyHint.test.ts`

- [ ] **Step 1: Write failing test for trigger custom event**

Create `tests/EnjoyHint.test.ts`:

```typescript
import { describe, it, expect, vi } from "vitest";
import { EnjoyHint } from "../src/EnjoyHint";

describe("EnjoyHint API skeleton", () => {
  it("exposes set, run, getCurrentStep, trigger aliases", () => {
    const hint = new EnjoyHint({});
    expect(typeof hint.set).toBe("function");
    expect(typeof hint.setSteps).toBe("function");
    expect(typeof hint.setScript).toBe("function");
    expect(typeof hint.run).toBe("function");
    expect(typeof hint.resume).toBe("function");
    expect(typeof hint.getCurrentStep).toBe("function");
    expect(typeof hint.trigger).toBe("function");
    expect(typeof hint.clear).toBe("function");
    expect(typeof hint.destroy).toBe("function");
    expect(hint.getCurrentStep()).toBe(0);
  });

  it("trigger next advances current step index", () => {
    const hint = new EnjoyHint({});
    hint.set([{ "next .a": "step 1" }, { "next .b": "step 2" }]);
    hint.run();
    expect(hint.getCurrentStep()).toBe(0);
    hint.trigger("next");
    expect(hint.getCurrentStep()).toBe(1);
  });
});
```

Note: full rendering not wired yet — `StepController` stub advances index only.

- [ ] **Step 2: Run test — expect FAIL**

```bash
npm test -- tests/EnjoyHint.test.ts
```

- [ ] **Step 3: Create `src/EventBus.ts`**

```typescript
export class EventBus {
  private target = new EventTarget();

  on(eventName: string, callback: () => void): void {
    this.target.addEventListener(this.eventName(eventName), callback);
  }

  off(eventName: string): void {
    this.target.removeEventListener(this.eventName(eventName), callback);
  }

  trigger(eventName: string): void {
    this.target.dispatchEvent(new Event(this.eventName(eventName)));
  }

  private eventName(name: string): string {
    return `${name}custom.enjoy_hint`;
  }
}
```

Fix `off` — store callback reference. Revised implementation:

```typescript
export class EventBus {
  private target = new EventTarget();
  private listeners = new Map<string, Set<() => void>>();

  on(eventName: string, callback: () => void): void {
    const key = this.eventName(eventName);
    if (!this.listeners.has(key)) this.listeners.set(key, new Set());
    this.listeners.get(key)!.add(callback);
    this.target.addEventListener(key, callback);
  }

  off(eventName: string): void {
    const key = this.eventName(eventName);
    const set = this.listeners.get(key);
    if (!set) return;
    for (const cb of set) this.target.removeEventListener(key, cb);
    this.listeners.delete(key);
  }

  trigger(eventName: string): void {
    this.target.dispatchEvent(new Event(this.eventName(eventName)));
  }

  private eventName(name: string): string {
    return `${name}custom.enjoy_hint`;
  }
}
```

- [ ] **Step 4: Create `src/EnjoyHint.ts` skeleton**

```typescript
import type { EnjoyHintOptions } from "./types";
import { normalizeSteps } from "./StepNormalizer";
import type { NormalizedStep } from "./types";

export class EnjoyHint {
  private steps: NormalizedStep[] = [];
  private currentStep = 0;
  private options: Required<
    Pick<EnjoyHintOptions, "onStart" | "onEnd" | "onSkip" | "onNext">
  > &
    EnjoyHintOptions;

  constructor(configs: EnjoyHintOptions = {}) {
    this.options = {
      onStart: configs.onStart ?? (() => {}),
      onEnd: configs.onEnd ?? (() => {}),
      onSkip: configs.onSkip ?? (() => {}),
      onNext: configs.onNext ?? (() => {}),
      ...configs,
    };
  }

  setScript(data: Record<string, unknown>[]): void {
    if (!Array.isArray(data) || data.length < 1) {
      throw new Error("Configurations list isn't correct.");
    }
    this.steps = normalizeSteps(data);
  }

  set = (data: Record<string, unknown>[]): void => this.setScript(data);
  setSteps = (data: Record<string, unknown>[]): void => this.setScript(data);

  getCurrentStep(): number {
    return this.currentStep;
  }

  setCurrentStep(cs: number): void {
    this.currentStep = cs;
  }

  runScript(): void {
    this.currentStep = 0;
    this.options.onStart();
    // StepController wired in M5
  }

  run = (): void => this.runScript();
  resumeScript = (): void => {};
  resume = (): void => this.resumeScript();

  trigger(eventName: string): void {
    if (eventName === "next") {
      this.currentStep++;
      return;
    }
    if (eventName === "skip") {
      this.stop();
      return;
    }
    // EventBus wired in M5
  }

  stop(): void {
    this.destroy();
  }

  clear(): void {
    // Button reset wired in M5
  }

  destroy(): void {
    // Cleanup wired in M5
  }
}
```

- [ ] **Step 5: Update `src/index.ts`**

```typescript
export { EnjoyHint } from "./EnjoyHint";
export type { EnjoyHintOptions, NormalizedStep, ButtonConfig } from "./types";
export { normalizeStep, normalizeSteps } from "./StepNormalizer";
export default EnjoyHint;
```

- [ ] **Step 6: Run tests**

```bash
npm test
npm run typecheck
```

Expected: all PASS

- [ ] **Step 7: Commit**

```bash
git add src/EnjoyHint.ts src/EventBus.ts src/index.ts tests/EnjoyHint.test.ts
git commit -m "feat: add EnjoyHint public API skeleton"
```

---

## Milestone 3: Native DOM Overlay Shell

### Task 4: OverlayRenderer shell

**Files:**

- Create: `src/overlay/OverlayRenderer.ts`
- Create: `tests/OverlayRenderer.test.ts`

- [ ] **Step 1: Write failing test**

```typescript
import { describe, it, expect, afterEach } from "vitest";
import { OverlayRenderer } from "../src/overlay/OverlayRenderer";

describe("OverlayRenderer", () => {
  let renderer: OverlayRenderer;

  afterEach(() => {
    renderer?.destroy();
  });

  it("mounts enjoyhint root with buttons and blockers", () => {
    renderer = new OverlayRenderer(document.body, { fill: "rgba(0,0,0,0.6)" });
    renderer.mount();
    expect(document.querySelector(".enjoyhint")).not.toBeNull();
    expect(document.querySelector(".enjoyhint_next_btn")).not.toBeNull();
    expect(document.querySelector(".enjoyhint_prev_btn")).not.toBeNull();
    expect(document.querySelector(".enjoyhint_skip_btn")).not.toBeNull();
    expect(document.querySelectorAll(".enjoyhint_disable_events")).toHaveLength(
      4,
    );
    expect(document.querySelector("canvas")).toBeNull();
  });

  it("destroy removes overlay from DOM", () => {
    renderer = new OverlayRenderer(document.body, { fill: "rgba(0,0,0,0.6)" });
    renderer.mount();
    renderer.destroy();
    expect(document.querySelector(".enjoyhint")).toBeNull();
  });
});
```

- [ ] **Step 2: Run test — FAIL**

- [ ] **Step 3: Implement `src/overlay/OverlayRenderer.ts`**

Mount structure per spec:

- Root `.enjoyhint.enjoyhint_hide` (shown via `show()`)
- SVG wrapper `.enjoyhint_svg_wrapper.enjoyhint_svg_transparent`
- SVG `.enjoyhint_svg.enjoyhint_svg_transparent` with `<defs>` marker stub
- Label container (created on demand)
- Buttons: `.enjoyhint_next_btn`, `.enjoyhint_prev_btn`, `.enjoyhint_skip_btn`, `.enjoyhint_close_btn`
- Four `.enjoyhint_disable_events` divs with click `stopImmediatePropagation`

Methods: `mount()`, `show()`, `hide()`, `destroy()`, `onNextClick(cb)`, `onPrevClick(cb)`, `onSkipClick(cb)`, `showNext()`, `hideNext()`, `showPrev()`, `hidePrev()`, `showSkip()`, `hideSkip()`.

No canvas. No Kinetic container.

Close-button requirement: do not leave `.enjoyhint_close_btn` at an unpositioned browser default. Port the legacy close-button placement exactly and add a test proving its computed rectangle matches legacy for representative label/button positions.

- [ ] **Step 4: Run tests — PASS**

- [ ] **Step 5: Commit**

```bash
git add src/overlay/OverlayRenderer.ts tests/OverlayRenderer.test.ts
git commit -m "feat: add native DOM overlay shell"
```

---

## Milestone 4: SVG Mask Spotlight + Geometry

### Task 5: Geometry helpers with tests

**Files:**

- Create: `src/overlay/geometry.ts`
- Create: `tests/geometry.test.ts`

- [ ] **Step 1: Write failing tests**

```typescript
import { describe, it, expect } from "vitest";
import {
  computeSpotlightRect,
  positionBlockers,
} from "../src/overlay/geometry";

describe("geometry", () => {
  it("computes rect spotlight from element bounds and margin", () => {
    const rect = computeSpotlightRect({
      left: 100,
      top: 200,
      width: 80,
      height: 40,
      margin: 10,
      shape: "rect",
    });
    expect(rect.left).toBe(90);
    expect(rect.top).toBe(190);
    expect(rect.right).toBe(190);
    expect(rect.bottom).toBe(250);
  });

  it("positions four blockers around spotlight", () => {
    const styles = positionBlockers({
      top: 100,
      left: 50,
      right: 300,
      bottom: 400,
    });
    expect(styles.top.height).toBe("100px");
    expect(styles.left.width).toBe("50px");
    expect(styles.bottom.top).toBe("400px");
    expect(styles.right.left).toBe("300px");
  });
});
```

- [ ] **Step 2–4: Implement, test PASS**

Port math from `renderRect` / `disableEventsNearRect` in `src/jquery.enjoyhint.js`.

- [ ] **Step 5: Commit**

### Task 6: SvgMaskSpotlight

**Files:**

- Create: `src/overlay/SvgMaskSpotlight.ts`
- Modify: `src/overlay/OverlayRenderer.ts` — integrate spotlight
- Create: `tests/SvgMaskSpotlight.test.ts`

- [ ] **Step 1: Write failing test**

```typescript
it("creates SVG mask with spotlight hole", () => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const spotlight = new SvgMaskSpotlight(svg, "rgba(0,0,0,0.6)");
  spotlight.update({
    shape: "rect",
    x: 50,
    y: 50,
    width: 100,
    height: 60,
    radius: 4,
  });
  expect(svg.querySelector("mask")).not.toBeNull();
  expect(svg.querySelector("mask rect, mask circle")).not.toBeNull();
  expect(
    svg.querySelector('[mask="url(#enjoyhint-spotlight-mask)"]'),
  ).not.toBeNull();
});
```

- [ ] **Step 2–4: Implement `SvgMaskSpotlight`**

- `update({ shape, x, y, width, height, radius })` for rect/circle
- SVG-compatible animation that matches the legacy Kinetic tween timing and movement. CSS transitions are acceptable only if parity tests prove they match; otherwise use the Web Animations API or `requestAnimationFrame`.
- Full-viewport dark `<rect>` masked by spotlight

Wire into `OverlayRenderer.renderSpotlight()`.

- [ ] **Step 5: Add animation parity tests**

Compare legacy and new spotlight geometry at start, midpoint, and end of the transition. The test must fail if animation is absent, if timing differs, or if the movement path differs outside the approved antialiasing/rounding tolerance.

- [ ] **Step 6: Run tests + manual check**

Mount overlay in jsdom test; verify no `<canvas>` in DOM.

- [ ] **Step 7: Commit**

```bash
git commit -m "feat: replace canvas spotlight with SVG mask"
```

### Task 7: EventBlockers module

**Files:**

- Create: `src/overlay/EventBlockers.ts`
- Wire into `OverlayRenderer`

- [ ] **Step 1: Test `EventBlockers.apply(rect)` sets inline styles on four divs**
- [ ] **Step 2–4: Implement, PASS**
- [ ] **Step 5: Commit**

---

## Milestone 5: Label, Arrow, Scroll, Step Flow

### Task 8: ScrollHelper

**Files:**

- Create: `src/ScrollHelper.ts`
- Create: `tests/ScrollHelper.test.ts`

- [ ] **Step 1: Test scroll target calculation**

```typescript
import { computeScrollTarget } from "../src/ScrollHelper";

it("applies -200px offset to element top", () => {
  const el = {
    getBoundingClientRect: () => ({ top: 500, bottom: 540 }),
  } as Element;
  Object.defineProperty(window, "scrollY", { value: 100, writable: true });
  expect(computeScrollTarget(el)).toBe(400); // 500 + 100 - 200
});
```

- [ ] **Step 2–4: Implement `scrollToElement(el, speed, onAfter)`**

Use `scrollIntoView({ behavior: 'smooth', block: 'center' })`, then `scrollBy(0, -200)` after scroll completes (listen for `scrollend` or timeout fallback), call `onAfter`.

- [ ] **Step 5: Commit**

### Task 9: Label placement + SvgArrow

**Files:**

- Create: `src/overlay/labelPlacement.ts`
- Create: `src/overlay/SvgArrow.ts`

- [ ] **Step 1: Port `renderLabelWithShape` area-priority algorithm verbatim from `src/jquery.enjoyhint.js` lines 830–950**
- [ ] **Step 2: Port `renderArrow` quadratic Bézier + `setMarkerColor`**
- [ ] **Step 3: Unit test label side selection for known viewport/element geometry**
- [ ] **Step 4: Commit**

### Task 10: StepController — wire full flow

**Files:**

- Create: `src/StepController.ts`, `src/DomAdapter.ts`
- Modify: `src/EnjoyHint.ts` — delegate to `StepController`
- Create: `tests/StepController.test.ts`

- [ ] **Step 1: Port `stepAction` logic from `src/enjoyhint.js`**

Key behaviors to wire:

- Init: body `overflow: hidden`, touchmove lock
- Per step: `onBeforeStart`, `timeout`, scroll-if-out-of-viewport, show overlay
- Events: click, key, next, auto, custom (via `EventBus`)
- Button visibility: `showNext`, `showPrev`, `showSkip`, custom button text/classes
- Shape data from element `getBoundingClientRect()` + margin/radius
- `MD-DIALOG` / `dialogClosing` listener preserved
- Resize handler recalculates blockers
- End: `onEnd`, destroy, restore scroll
- `trigger("next"|"skip"|custom)`

- [ ] **Step 2: Integration test with jsdom**

```typescript
it("runs a click step and advances on click", async () => {
  document.body.innerHTML = '<button class="target">Go</button>';
  const hint = new EnjoyHint({});
  hint.set([{ "click .target": "Click me" }]);
  hint.run();
  document.querySelector(".target")!.dispatchEvent(new Event("click"));
  expect(hint.getCurrentStep()).toBe(1);
});
```

- [ ] **Step 3: Run full test suite**

```bash
npm test && npm run typecheck && npm run build
```

- [ ] **Step 4: Manual browser test**

Temporarily point `examples/example1.html` at `../dist/enjoyhint.min.js` (keep jQuery deps for comparison OR run side-by-side). Verify basic tour works on new build.

- [ ] **Step 5: Commit**

```bash
git commit -m "feat: wire step flow with overlay rendering"
```

---

## Milestone 6: Automated Visual And Behavior Parity

### Task 11: Legacy/New parity test harness

**Files:**

- Create: `tests/parity/legacy-fixture.html`
- Create: `tests/parity/new-fixture.html`
- Create: `tests/parity/parity.test.ts`
- Modify: `package.json`

- [ ] **Step 1: Create paired fixture pages**

Create two fixture pages with identical markup and step configs. The legacy fixture loads `src/jquery.enjoyhint.js`, `src/enjoyhint.js`, jQuery, KineticJS, and jquery.scrollTo. The new fixture loads the TypeScript build. The page body, target elements, viewport assumptions, and EnjoyHint config must be identical.

- [ ] **Step 2: Add browser parity test runner**

Use a browser test runner (for example Playwright) to open both fixtures. The test must execute the same action sequence in both pages and collect comparable data for overlay, spotlight, label, arrow, buttons, blockers, scroll position, callbacks, and cleanup.

The collected data must include computed rectangles/classes/text for Next, Previous, Skip, and Close buttons. Close-button placement must be compared explicitly; a top-left default position fails.

- [ ] **Step 3: Add visual snapshot checks**

Capture screenshots for representative steps in both fixtures. Compare screenshots with a small tolerance only for browser antialiasing noise. Layout, color, placement, missing animation, and animation-timing differences fail the test.

- [ ] **Step 4: Add animation sampling checks**

For spotlight transitions, sample geometry at start, midpoint, and end. The new implementation must match the legacy timing and movement within the approved tolerance. A static SVG spotlight or delayed final-only update fails this test.

- [ ] **Step 5: Add npm script**

Add a script such as:

```json
"test:parity": "playwright test tests/parity/parity.test.ts"
```

- [ ] **Step 6: Run parity validation**

```bash
npm run build
npm run test:parity
```

Expected: PASS. Do not continue to example migration or dependency removal until this passes.

- [ ] **Step 7: Commit**

```bash
git commit -m "test: add legacy visual and behavior parity checks"
```

---

## Milestone 7: Examples, README, Remove Runtime Deps

### Task 12: CSS migration

**Files:**

- Create: `src/enjoyhint.css` (copy from `src/jquery.enjoyhint.css`, remove canvas/kinetic rules)
- Modify: `vite.config.ts` — copy CSS to `dist/enjoyhint.css` on build

- [ ] **Step 1: Copy CSS, remove `.enjoyhint_canvas`, `#kinetic_container`, `.canvas-container`, `div.kineticjs-content`**
- [ ] **Step 2: Add minimal `.enjoyhint_svg { position: fixed; top: 0; left: 0; width: 100%; height: 100%; }` if needed**
- [ ] **Step 3: Run parity validation**

```bash
npm run build
npm run test:parity
```

Expected: PASS. CSS changes that alter visible output fail parity and must be fixed.

- [ ] **Step 4: Commit**

### Task 13: Migrate examples

**Files:**

- Modify: `examples/example1.html`
- Modify: `examples/all-features.html`

- [ ] **Step 1: Replace script tags**

Remove:

```html
<script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/kineticjs/5.2.0/kinetic.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-scrollTo/2.1.2/jquery.scrollTo.min.js"></script>
<script src="../src/jquery.enjoyhint.js"></script>
<script src="../src/enjoyhint.js"></script>
```

Add:

```html
<link href="../dist/enjoyhint.css" rel="stylesheet" />
<script src="../dist/enjoyhint.min.js"></script>
```

**Do not change** `examples/example1/script.js` or step configs in HTML.

- [ ] **Step 2: Build, parity test, and manual test both examples**

```bash
npm run build
npm run test:parity
# Open examples/example1.html and examples/all-features.html
```

Verify: automated parity passes first, then manually check linear tour, shapes, prev/next/skip, custom trigger, arrow color, resize.

- [ ] **Step 3: Commit**

### Task 14: README + package.json cleanup

**Files:**

- Modify: `README.md`, `package.json`

- [ ] **Step 1: Update README Dependencies section** — remove jQuery/KineticJS/scrollTo; document zero runtime deps
- [ ] **Step 2: Add v5 migration note** — remove external script tags, no config changes
- [ ] **Step 3: Remove runtime `dependencies` from package.json** (jquery, kinetic, jquery.scrollto)
- [ ] **Step 4: Bump version to `5.0.0`**
- [ ] **Step 5: Deprecate bower note in README**
- [ ] **Step 6: Run parity validation**

```bash
npm run build
npm run test:parity
```

Expected: PASS before runtime dependencies are removed from the shipped path.

- [ ] **Step 7: Commit**

```bash
git commit -m "docs: migrate README and examples to dependency-free v5"
```

---

## Milestone 8: Archive Legacy + Final Polish

### Task 15: Archive legacy source

**Files:**

- Move: `src/enjoyhint.js` → `src/legacy/enjoyhint.js`
- Move: `src/jquery.enjoyhint.js` → `src/legacy/jquery.enjoyhint.js`
- Keep: `src/jquery.enjoyhint.css` (reference until removed) or move to legacy

- [ ] **Step 1: Create `src/legacy/` and move files (do not delete)**
- [ ] **Step 2: Verify `npm run build` and `npm run test:parity` still succeed**
- [ ] **Step 3: Verify examples still use `dist/` only**
- [ ] **Step 4: Commit**

```bash
git commit -m "chore: archive legacy jQuery/KineticJS source"
```

### Task 16: Regression tests + final validation

**Files:**

- Create: `tests/EventBus.test.ts`
- Expand: `tests/geometry.test.ts`, `tests/StepController.test.ts`

- [ ] **Step 1: Add EventBus tests**

```typescript
it("trigger dispatches custom.enjoy_hint event", () => {
  const bus = new EventBus();
  const fn = vi.fn();
  bus.on("data_loaded", fn);
  bus.trigger("data_loaded");
  expect(fn).toHaveBeenCalled();
});
```

- [ ] **Step 2: Run full validation suite**

```bash
npm run typecheck
npm run build
npm test
npm run test:parity
```

Expected: all PASS, including automated legacy-vs-new visual and behavior parity. `dist/` contains `enjoyhint.js`, `enjoyhint.cjs`, `enjoyhint.min.js`, `enjoyhint.css`, `index.d.ts`.

- [ ] **Step 3: Manual browser checklist**

| Check                  | example1 | all-features |
| ---------------------- | -------- | ------------ |
| Tour starts            | ✓        | ✓            |
| Spotlight on target    | ✓        | ✓            |
| Label + arrow visible  | ✓        | ✓            |
| Next/Prev/Skip buttons | ✓        | ✓            |
| Custom trigger         | —        | ✓            |
| Resize recalculates    | ✓        | ✓            |
| Skip ends tour         | ✓        | ✓            |

- [ ] **Step 4: Grep for removed deps in src/ (excluding legacy/)**

```bash
rg -i "jquery|kinetic|scrollto|canvas" src/ --glob '!src/legacy/**'
```

Expected: no matches in production TypeScript source.

- [ ] **Step 5: Commit**

```bash
git commit -m "test: add regression coverage for v5 rewrite"
```

---

## Agent Operating Rules

Apply to every task:

- Keep changes limited to the current milestone
- Do not rewrite example EnjoyHint step configs
- Do not delete legacy files — archive only in Task 15 after automated parity passes
- Run the smallest relevant validation after each task
- Report behavior changes, files touched, and manual browser checks still needed

## Spec Coverage Checklist

| Spec requirement              | Task               |
| ----------------------------- | ------------------ |
| Vite ESM/CJS/IIFE             | Task 1             |
| StepNormalizer legacy parsing | Task 2             |
| Public API preserved          | Task 3, 10         |
| Native DOM overlay            | Task 4             |
| SVG mask spotlight            | Task 6             |
| Event blockers                | Task 5, 7          |
| Label + arrow placement       | Task 9             |
| ScrollHelper -200px offset    | Task 8             |
| Step flow all event types     | Task 10            |
| Vitest unit tests             | Tasks 2, 5, 8, 16  |
| Automated visual/behavior parity | Task 11         |
| Examples migrated             | Task 13            |
| Runtime deps removed          | Task 14            |
| Legacy archived               | Task 15            |
| CSS class names preserved     | Task 12            |
| window.EnjoyHint global       | Task 1 (UMD build) |
| MD-DIALOG support             | Task 10            |
| v5.0.0 release                | Task 14            |
