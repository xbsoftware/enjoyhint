# Global Button Config on Initialization — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Support init-level `nextButton` / `prevButton` / `skipButton` with field-merge over per-step configs; deprecate `btnNextText` / `btnSkipText`.

**Architecture:** Add a pure `mergeButtonConfig` helper. `StepController.renderButtons` merges step + init + legacy text, then calls existing `OverlayRenderer.configure*Button`. No step mutation.

**Tech Stack:** TypeScript, Vitest

**Spec:** `docs/superpowers/specs/2026-07-20-global-button-config-design.md`

**Constraints (human):** Do not commit. Do not create a worktree.

---

## File map

| File | Responsibility |
| --- | --- |
| `src/mergeButtonConfig.ts` | Pure field-merge helper |
| `src/types.ts` | Init button options; deprecate legacy text helpers |
| `src/StepController.ts` | Use helper in `renderButtons` |
| `tests/mergeButtonConfig.test.ts` | Helper unit tests |
| `tests/StepController.test.ts` | Integration: init defaults + step partial override |
| `README.md` | Document init buttons; deprecate `btnNextText` / `btnSkipText` |

---

### Task 1: `mergeButtonConfig` helper (TDD)

**Files:**
- Create: `tests/mergeButtonConfig.test.ts`
- Create: `src/mergeButtonConfig.ts`

- [x] **Step 1: Write the failing tests**

```typescript
import { describe, expect, it } from "vitest";
import { mergeButtonConfig } from "../src/mergeButtonConfig";

describe("mergeButtonConfig", () => {
  it("returns undefined when nothing is set", () => {
    expect(mergeButtonConfig(undefined, undefined, undefined)).toBeUndefined();
  });

  it("uses step fields over init fields", () => {
    expect(
      mergeButtonConfig(
        { text: "Step", className: "step" },
        { text: "Init", className: "init" },
        "Legacy",
      ),
    ).toEqual({ text: "Step", className: "step" });
  });

  it("fills missing step fields from init (field merge)", () => {
    expect(
      mergeButtonConfig({ text: "OK" }, { className: "g" }, undefined),
    ).toEqual({ text: "OK", className: "g" });
  });

  it("uses legacy text when step and init text are absent", () => {
    expect(mergeButtonConfig(undefined, { className: "x" }, "A")).toEqual({
      text: "A",
      className: "x",
    });
  });

  it("prefers init text over legacy text", () => {
    expect(mergeButtonConfig(undefined, { text: "B" }, "A")).toEqual({ text: "B" });
  });

  it("returns className-only config when no text sources exist", () => {
    expect(mergeButtonConfig(undefined, { className: "x" }, undefined)).toEqual({
      className: "x",
    });
  });

  it("returns text-only config from legacy helper", () => {
    expect(mergeButtonConfig(undefined, undefined, "Continue")).toEqual({
      text: "Continue",
    });
  });
});
```

- [x] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/mergeButtonConfig.test.ts`

Expected: FAIL — module not found

- [ ] **Step 3: Write minimal implementation**

```typescript
import type { ButtonConfig } from "./types";

export function mergeButtonConfig(
  step?: ButtonConfig,
  init?: ButtonConfig,
  legacyText?: string,
): ButtonConfig | undefined {
  const text = step?.text ?? init?.text ?? legacyText;
  const className = step?.className ?? init?.className;
  if (text === undefined && className === undefined) {
    return undefined;
  }
  return {
    ...(text !== undefined ? { text } : {}),
    ...(className !== undefined ? { className } : {}),
  };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run tests/mergeButtonConfig.test.ts`

Expected: PASS

- [ ] **Step 5: Commit** — SKIPPED per human instruction

---

### Task 2: Types + wire `StepController`

**Files:**
- Modify: `src/types.ts`
- Modify: `src/StepController.ts`
- Modify: `tests/StepController.test.ts`

- [ ] **Step 1: Write the failing integration test**

Append to `tests/StepController.test.ts` (follow existing mount/run patterns in that file):

```typescript
  it("applies init nextButton/skipButton/prevButton across steps and field-merges step overrides", () => {
    document.body.innerHTML = '<button class="target">Go</button>';
    const hint = new EnjoyHint({
      nextButton: { text: "Continue", className: "global-next" },
      skipButton: { text: "Exit", className: "global-skip" },
      prevButton: { text: "Back", className: "global-prev" },
    });
    hint.set([
      {
        selector: ".target",
        event: "next",
        description: "First",
        showNext: true,
      },
      {
        selector: ".target",
        event: "next",
        description: "Second",
        showNext: true,
        nextButton: { text: "OK" },
      },
    ]);
    hint.run();

    const next = document.querySelector<HTMLElement>(".enjoyhint_next_btn");
    const skip = document.querySelector<HTMLElement>(".enjoyhint_skip_btn");
    expect(next?.textContent).toBe("Continue");
    expect(next?.classList.contains("global-next")).toBe(true);
    expect(skip?.textContent).toBe("Exit");
    expect(skip?.classList.contains("global-skip")).toBe(true);

    // advance to second step
    next?.click();
    const next2 = document.querySelector<HTMLElement>(".enjoyhint_next_btn");
    const prev = document.querySelector<HTMLElement>(".enjoyhint_prev_btn");
    expect(next2?.textContent).toBe("OK");
    expect(next2?.classList.contains("global-next")).toBe(true);
    expect(prev?.textContent).toBe("Back");
    expect(prev?.classList.contains("global-prev")).toBe(true);

    hint.destroy();
  });
```

(Adjust to match real StepController test helpers / event advancing if the file uses a different pattern.)

- [x] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/StepController.test.ts -t "applies init nextButton"`

Expected: FAIL — init button options ignored / classes missing

- [ ] **Step 3: Update types**

In `EnjoyHintOptions`:

```typescript
  /** @deprecated Prefer `nextButton.text`. */
  btnNextText?: string;
  /** @deprecated Prefer `skipButton.text`. */
  btnSkipText?: string;
  nextButton?: ButtonConfig;
  prevButton?: ButtonConfig;
  skipButton?: ButtonConfig;
```

- [ ] **Step 4: Wire `renderButtons`**

```typescript
import { mergeButtonConfig } from "./mergeButtonConfig";

private renderButtons(step: NormalizedStep): void {
  const next = mergeButtonConfig(
    step.nextButton,
    this.callbacks.nextButton,
    this.callbacks.btnNextText,
  );
  const prev = mergeButtonConfig(step.prevButton, this.callbacks.prevButton);
  const skip = mergeButtonConfig(
    step.skipButton,
    this.callbacks.skipButton,
    this.callbacks.btnSkipText,
  );

  this.renderer.configureNextButton(next, "Next");
  this.renderer.configurePrevButton(prev, "Previous");
  this.renderer.configureSkipButton(skip, "Skip");
  // … existing show/hide logic unchanged
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run tests/StepController.test.ts tests/mergeButtonConfig.test.ts`

Expected: PASS

- [ ] **Step 6: Commit** — SKIPPED

---

### Task 3: README

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Document init button options** under Initialization; mark `btnNextText` / `btnSkipText` deprecated; point to `nextButton.text` / `skipButton.text`. Keep per-step button docs.

- [ ] **Step 2: Commit** — SKIPPED

---

### Task 4: Verification

- [ ] **Step 1:** `npx vitest run tests/mergeButtonConfig.test.ts tests/StepController.test.ts`
- [ ] **Step 2:** Confirm no regressions in related OverlayRenderer button tests if needed
