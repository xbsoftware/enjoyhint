# Targetless Steps (No Selector / No Spotlight) — Design Spec

**Date:** 2026-07-16  
**Status:** Approved  
**Plan:** `docs/superpowers/plans/2026-07-16-targetless-steps.md`

## Summary

Allow a tour step with no target element and no spotlight hole. The step shows a full-screen dim, centered plain description text (transparent label background, no arrow), and the usual Next / Prev / Skip / Close chrome. Authors declare this by omitting `selector` in the object-form step config.

## Problem

Every step today requires a resolvable `selector`. If the element is missing, the tour ends. There is no supported way to show an intro/outro or interstitial message that is not tied to a page control. Authors want a modal-like step: message + buttons only.

## Goals

- Support steps with no `selector` (empty after normalize).
- Full-screen dim with **no** spotlight cutout.
- Center the description as a normal (non-oversized) label: transparent background, no arrow, no label-overlap toggle.
- Advance via Next (and Prev/Skip as usual), custom `trigger`, or document-level key / other DOM events.
- Cover with unit tests; keep targeted-step behavior unchanged.

## Non-Goals

- Shorthand syntax for targetless steps (e.g. `"next": "..."` alone)
- Treating a non-empty but missing selector as a targetless/modal step
- New card/modal visual chrome beyond centered plain label text
- Changing RTL, label-overlap toggle, or normal target-step placement
- Auto-detecting page language / direction (unrelated)

## Decisions

| Decision | Choice |
| --- | --- |
| Authoring API | Omit `selector`; use object form `{ event, description, ... }` |
| Normalized signal | `selector === ""` after `normalizeStep` |
| Missing element | Non-empty selector not found → still `finish()` (unchanged) |
| Approach | Dedicated targetless branch in `StepController` (not a synthetic spotlight, not a new renderer type) |
| Overlay | Full dim; collapsed / zero-size spotlight hole (same idea as scroll-prep collapsed state) |
| Label look | Plain centered text (not oversized dark `#272A26` style) |
| Arrow / overlap toggle | Never shown on targetless steps |

## API & Detection

```js
{
  event: "next",
  description: "Welcome. Click Next to begin."
}
```

Also valid with `event: "custom"` (+ matching `trigger`), or `event: "key"` (+ `keyCode`), and other document-bound DOM event names.

- Shorthand keys like `"next #banner": "..."` always imply a selector; they cannot declare a targetless step.
- After normalize, empty `selector` selects the targetless path.
- A non-empty `selector` whose element is missing continues to end the tour.

## Rendering

Targetless path in `StepController`:

1. Skip DOM query, scroll, and dialog-closing handler.
2. Mount overlay and show the dimmed layer.
3. Render a collapsed / zero-size spotlight so there is no hole.
4. Measure `description`, place the label at the viewport center with transparent background (not `oversized`).
5. Do not schedule an arrow; disable / never show the label-overlap toggle.
6. Apply existing Next / Prev / Skip visibility rules; position the button row relative to the centered label (no spotlight band to avoid).

**Ignored when targetless:** `shape`, `radius`, `margin`, `top` / `right` / `bottom` / `left`, `scrollAnimationSpeed`, `arrowColor`, `event_selector`.

On resize, re-center the label and reposition buttons; still no spotlight hole.

## Events & Interaction

| Config | Behavior |
| --- | --- |
| `event: "next"` (or `eventType: "next"`) | Advance via Next / Prev / Skip / Close only |
| `event_type: "custom"` / custom event name | `enjoyhint.trigger(event)` as today |
| `event: "key"` (+ optional `keyCode`) | `keydown` listener on `document` |
| Other DOM events (e.g. `"click"`) | Listener on `document` (note: full dim blocks page clicks; prefer Next / custom / key for real tours) |
| `event_type: "auto"` | Requires a selector. Without one: no auto-dispatch and no auto-advance (use `next` or `custom`) |

Blockers: full-screen dim with no hole keeps the page non-interactive; only overlay chrome is usable.

## Files Touched

| File | Change |
| --- | --- |
| `src/StepController.ts` | Targetless branch: no query/scroll; collapsed spotlight; centered label; document event binding |
| `src/overlay/OverlayRenderer.ts` | Reuse collapsed / zero-size spotlight for no hole; add a centered-label presentation path only if `StepController` cannot place the label with existing APIs |
| `src/types.ts` | Keep `selector: string`; empty string means targetless. No new fields. |
| `tests/StepController.test.ts` | Targetless render, advance (next / custom / key), missing-selector regression |

## Testing Plan

- Unit: empty selector does not `finish()` for “missing target”; overlay has no hole; label near viewport center; no arrow; no overlap toggle.
- Unit: Next advances; `trigger` advances custom steps; `key` + `keyCode` advances.
- Regression: non-empty missing selector still ends the tour; normal target steps unchanged.
