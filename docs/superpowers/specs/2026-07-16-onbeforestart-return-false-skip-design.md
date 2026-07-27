# onBeforeStart Return `false` to Skip Step — Design Spec

**Date:** 2026-07-16  
**Status:** Approved  
**Issue:** [#115](https://github.com/xbsoftware/enjoyhint/issues/115)

## Summary

Allow `onBeforeStart` to return `false` to cancel the current step before it renders. The tour advances to the next step without showing an overlay. Consecutive skips chain until a step continues or the tour ends. Tour-level `onNext` does not fire for skipped steps.

## Problem

Authors want to skip steps when a target is hidden or irrelevant (e.g. conditional UI). The workaround used in [#115](https://github.com/xbsoftware/enjoyhint/issues/115) — calling `trigger('next')` inside `onBeforeStart` — races with the in-flight step start: the tour briefly advances, then the original step’s scheduled render snaps back.

## Goals

- `onBeforeStart` may return `false` to skip the current step without rendering.
- Chain-skip consecutive steps that return `false`.
- Do not fire tour `onNext` for skipped steps.
- Keep existing void/`undefined` callbacks compatible.
- Cover with unit tests.

## Non-Goals

- Making `trigger('next')` inside `onBeforeStart` race-safe (return `false` is the supported skip API).
- A separate `skipIf` / `shouldSkip` step option.
- Changing missing-selector / missing-element behavior for non-skipped steps.
- Changing Prev / Skip button semantics.

## Decisions

| Decision | Choice |
| --- | --- |
| Skip signal | Strict `false` only (`undefined` / `true` / other values continue) |
| Consecutive skips | Chain immediately via re-entering `renderStep` |
| `onNext` on skip | Do not fire |
| Call order | `onBeforeStart` before `onNext` |
| Exhausted skips | If every remaining step returns `false`, call `finish()` |
| `trigger('next')` in hook | Out of scope; document return `false` instead |

## API

```ts
onBeforeStart?: () => void | false;
```

Example (issue #115 pattern):

```js
{
  selector: "#valve-default-area",
  event: "next",
  description: "Default area",
  onBeforeStart: function () {
    if (document.querySelector("#valve-default-area")?.hidden) {
      return false;
    }
  }
}
```

## Implementation

In `StepController.renderStep()`:

1. Resolve current step; if none → `finish()`.
2. Call `step.onBeforeStart?.()`.
3. If result is `false`:
   - Do not schedule timeout / scroll / overlay / events.
   - `currentStep += 1`.
   - Call `renderStep()` again (chain-skip).
4. Otherwise call `callbacks.onNext()`, then the existing schedule/render path.

Update:

- `NormalizedStep.onBeforeStart` type to `() => void | false`
- `StepNormalizer` cast accordingly
- README: document that returning `false` skips the step without rendering

## Tests

In `StepController.test.ts`:

1. Return `false` → skipped step never renders; next step does; `onNext` not called for skipped step.
2. Several consecutive `false` returns → lands on first non-false step (or `onEnd` if all remaining skip).
3. Return `undefined` / nothing → step still renders (existing behavior).
4. `false` on the last remaining step → tour finishes; no overlay left.

## Out of Scope

- Race-safe `trigger('next')` from inside `onBeforeStart`
- Auto-skip when selector element is missing or `:hidden` without an author callback
