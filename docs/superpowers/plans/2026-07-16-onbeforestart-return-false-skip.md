# onBeforeStart Return `false` Skip Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Let `onBeforeStart` return `false` to skip rendering the current step and advance to the next one (chain-skipping consecutive falses), without firing tour `onNext` for skipped steps.

**Architecture:** In `StepController.renderStep()`, call `onBeforeStart` before `onNext`. If the return value is strictly `false`, bump `currentStep` and re-enter `renderStep` without scheduling overlay work. Update the `NormalizedStep` type and README accordingly.

**Tech Stack:** TypeScript, Vitest, existing `StepController` patterns — no new dependencies.

**Spec:** `docs/superpowers/specs/2026-07-16-onbeforestart-return-false-skip-design.md`

---

## File map

| File | Responsibility |
| --- | --- |
| `src/types.ts` | `onBeforeStart?: () => void \| false` |
| `src/StepNormalizer.ts` | Cast `onBeforeStart` to the new return type |
| `src/StepController.ts` | Check return value; skip + re-enter `renderStep`; call `onNext` only when continuing |
| `tests/StepController.test.ts` | Unit coverage for skip, chain-skip, `onNext`, last-step finish |
| `README.md` | Document return-`false` skip behavior |

---

### Task 1: Failing tests for skip-on-false

**Files:**
- Modify: `tests/StepController.test.ts`

- [x] **Step 1: Write the failing tests**

Append these cases inside the existing `describe("StepController", () => { ... })` in `tests/StepController.test.ts`, after the existing `"calls onBeforeStart before rendering the step"` test:

```typescript
  it("skips a step when onBeforeStart returns false without rendering it", () => {
    addTarget("first");
    addTarget("second");
    const onNext = vi.fn();
    const controller = new StepController(
      [
        makeStep({
          selector: ".first",
          event: "next",
          eventType: "next",
          description: "Skip me",
          onBeforeStart: () => false,
        }),
        makeStep({
          selector: ".second",
          event: "next",
          eventType: "next",
          description: "Keep me",
        }),
      ],
      { onNext },
    );

    controller.run();
    advanceStepPresentation();

    expect(controller.getCurrentStep()).toBe(1);
    expect(onNext).toHaveBeenCalledTimes(1);
    expect(document.querySelector(".enjoy_hint_label")?.textContent).toBe("Keep me");
  });

  it("chain-skips consecutive steps that return false from onBeforeStart", () => {
    addTarget("first");
    addTarget("second");
    addTarget("third");
    const onNext = vi.fn();
    const controller = new StepController(
      [
        makeStep({
          selector: ".first",
          event: "next",
          eventType: "next",
          onBeforeStart: () => false,
        }),
        makeStep({
          selector: ".second",
          event: "next",
          eventType: "next",
          onBeforeStart: () => false,
        }),
        makeStep({
          selector: ".third",
          event: "next",
          eventType: "next",
          description: "Land here",
        }),
      ],
      { onNext },
    );

    controller.run();
    advanceStepPresentation();

    expect(controller.getCurrentStep()).toBe(2);
    expect(onNext).toHaveBeenCalledTimes(1);
    expect(document.querySelector(".enjoy_hint_label")?.textContent).toBe("Land here");
  });

  it("finishes the tour when onBeforeStart returns false on the last remaining step", () => {
    addTarget();
    const onNext = vi.fn();
    const onEnd = vi.fn();
    const controller = new StepController(
      [
        makeStep({
          event: "next",
          eventType: "next",
          onBeforeStart: () => false,
        }),
      ],
      { onNext, onEnd },
    );

    controller.run();

    expect(onNext).not.toHaveBeenCalled();
    expect(onEnd).toHaveBeenCalledTimes(1);
    expect(document.querySelector(".enjoyhint")).toBeNull();
  });

  it("still renders the step when onBeforeStart returns undefined", () => {
    addTarget();
    const onBeforeStart = vi.fn(() => undefined);
    const controller = new StepController([
      makeStep({ event: "next", eventType: "next", onBeforeStart }),
    ]);

    controller.run();
    advanceStepPresentation();

    expect(onBeforeStart).toHaveBeenCalledTimes(1);
    expect(document.querySelector(".enjoyhint")).toBeInstanceOf(HTMLElement);
  });
```

- [x] **Step 2: Run tests to verify they fail**

Run: `npx vitest run tests/StepController.test.ts -t "skips a step when onBeforeStart|chain-skips consecutive|finishes the tour when onBeforeStart|still renders the step when onBeforeStart"`

Expected: FAIL — skipped step still renders / `onNext` count wrong / tour does not finish on last-step `false`.

- [x] **Step 3: Commit the failing tests**

```bash
git add tests/StepController.test.ts
git commit -m "$(cat <<'EOF'
test: add failing coverage for onBeforeStart false skip

EOF
)"
```

---

### Task 2: Implement skip-on-false in StepController + types

**Files:**
- Modify: `src/types.ts`
- Modify: `src/StepNormalizer.ts`
- Modify: `src/StepController.ts`

- [x] **Step 1: Update the `onBeforeStart` type**

In `src/types.ts`, change:

```typescript
  onBeforeStart?: () => void;
```

to:

```typescript
  onBeforeStart?: () => void | false;
```

- [x] **Step 2: Update the normalizer cast**

In `src/StepNormalizer.ts`, change:

```typescript
    step.onBeforeStart = raw.onBeforeStart as () => void;
```

to:

```typescript
    step.onBeforeStart = raw.onBeforeStart as () => void | false;
```

- [x] **Step 3: Implement skip check in `renderStep`**

In `src/StepController.ts`, replace:

```typescript
    this.callbacks.onNext();
    step.onBeforeStart?.();

    const scheduleStep = () => {
```

with:

```typescript
    if (step.onBeforeStart?.() === false) {
      this.currentStep += 1;
      this.renderStep();
      return;
    }

    this.callbacks.onNext();

    const scheduleStep = () => {
```

Do not change the rest of `scheduleStep` / timeout / overlay logic.

- [x] **Step 4: Run the new tests to verify they pass**

Run: `npx vitest run tests/StepController.test.ts -t "skips a step when onBeforeStart|chain-skips consecutive|finishes the tour when onBeforeStart|still renders the step when onBeforeStart|calls onBeforeStart before rendering"`

Expected: PASS (including the existing `onBeforeStart` test).

- [x] **Step 5: Run the full StepController suite**

Run: `npx vitest run tests/StepController.test.ts`

Expected: PASS — all existing cases still green (especially the `onNext` per-step test).

- [x] **Step 6: Commit**

```bash
git add src/types.ts src/StepNormalizer.ts src/StepController.ts tests/StepController.test.ts
git commit -m "$(cat <<'EOF'
feat: skip step when onBeforeStart returns false

EOF
)"
```

---

### Task 3: Document return-false skip in README

**Files:**
- Modify: `README.md`

- [x] **Step 1: Update the `onBeforeStart` docs**

Replace the Step Events `onBeforeStart` block in `README.md` with:

```markdown
**Step Events**:  
* `onBeforeStart` - fires before the step is started. Return `false` to skip the step without rendering and advance to the next one (consecutive skips chain). Tour `onNext` does not fire for skipped steps.
```javascript
var enjoyhint_script_steps = [
  {
    selector:'.some_btn',//jquery selector
    event:'click',
    description:'Click on this btn',
    onBeforeStart:function(){
      //do something
      // return false; // skip this step
    }
  }
];
```
```

- [x] **Step 2: Commit**

```bash
git add README.md
git commit -m "$(cat <<'EOF'
docs: document onBeforeStart false skip

EOF
)"
```

---

## Spec coverage checklist

| Spec requirement | Task |
| --- | --- |
| Return `false` skips without render | Task 1–2 |
| Chain consecutive `false` | Task 1–2 |
| `onNext` not fired for skipped steps | Task 1–2 |
| Void/`undefined` still renders | Task 1–2 |
| Last remaining `false` → `finish()` | Task 1–2 |
| Type `() => void \| false` | Task 2 |
| README documentation | Task 3 |
| `trigger('next')` race-safe — out of scope | — |
