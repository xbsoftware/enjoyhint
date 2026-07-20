# Global Button Config on Initialization — Design Spec

**Date:** 2026-07-20  
**Status:** Approved  
**Issue:** [#88](https://github.com/xbsoftware/enjoyhint/issues/88)

## Summary

Allow authors to set default Next / Previous / Skip button `text` and `className` once at `new EnjoyHint({...})`. Per-step `nextButton` / `prevButton` / `skipButton` override those defaults field-by-field. Existing `btnNextText` / `btnSkipText` remain supported but are deprecated in favor of `nextButton.text` / `skipButton.text`.

## Problem

[#88](https://github.com/xbsoftware/enjoyhint/issues/88) asks for global `nextButton` and `skipButton` for all steps. Today:

- Init supports only `btnNextText` / `btnSkipText` (text, no `className`).
- Full `{ text, className }` config exists only per step, so shared styling must be repeated on every step.

## Goals

- Init-level `nextButton`, `prevButton`, and `skipButton` using the existing `ButtonConfig` shape.
- Field-merge: missing step fields fall through to init; missing init fields fall through to legacy text helpers / library defaults.
- Keep `btnNextText` / `btnSkipText` working; mark them deprecated in types and README.
- Resolve at render time (do not mutate normalized steps).
- Cover with unit and one integration-style test; document in README.

## Non-Goals

- Init-level `showNext` / `showSkip` / `showPrev`.
- New `btnPrevText`.
- Removing deprecated text helpers in this change.
- Changing mobile abbreviated button labels.
- Changing `OverlayRenderer`’s public configure API or button visibility rules.
- Baking defaults into `StepNormalizer` / step objects.

## Decisions

| Decision | Choice |
| --- | --- |
| API shape | Flat `nextButton` / `prevButton` / `skipButton` on `EnjoyHintOptions` (same as steps) |
| Scope | All three nav buttons (symmetric with per-step API) |
| Merge | Field merge (text and className independently) |
| Resolve where | `StepController.renderButtons` via a small pure helper |
| Legacy text | Keep `btnNextText` / `btnSkipText`; document as deprecated |
| Object vs legacy text | `options.nextButton.text` wins over `btnNextText` (same for skip) |
| Prev legacy helper | Do not add `btnPrevText` |

## API

```ts
export interface ButtonConfig {
  className?: string;
  text?: string;
}

export interface EnjoyHintOptions {
  // …
  /** @deprecated Prefer `nextButton.text`. */
  btnNextText?: string;
  /** @deprecated Prefer `skipButton.text`. */
  btnSkipText?: string;
  nextButton?: ButtonConfig;
  prevButton?: ButtonConfig;
  skipButton?: ButtonConfig;
}
```

Example:

```js
var enjoyhint_instance = new EnjoyHint({
  nextButton: { text: "Continue", className: "my-next" },
  skipButton: { text: "Exit", className: "my-skip" },
  prevButton: { text: "Back", className: "my-prev" },
});
```

Legacy (still works, deprecated):

```js
new EnjoyHint({
  btnNextText: "Continue",
  btnSkipText: "Exit",
  nextButton: { className: "my-next" }, // class from object; text from btnNextText
});
```

## Precedence

Resolved per button at render time. First defined value wins.

| Field | Order |
| --- | --- |
| Next text | `step.nextButton.text` → `options.nextButton.text` → `options.btnNextText` → `"Next"` |
| Skip text | `step.skipButton.text` → `options.skipButton.text` → `options.btnSkipText` → `"Skip"` |
| Prev text | `step.prevButton.text` → `options.prevButton.text` → `"Previous"` |
| className (any) | `step.*.className` → `options.*.className` → none |

Examples:

- Init `{ nextButton: { className: "g" } }` + step `{ nextButton: { text: "OK" } }` → text `"OK"`, class `"g"`.
- Init `{ btnNextText: "A", nextButton: { text: "B" } }` → `"B"`.
- Init `{ btnNextText: "A", nextButton: { className: "x" } }` → text `"A"`, class `"x"`.

## Implementation

1. **`types.ts`** — add optional button configs to `EnjoyHintOptions`; JSDoc `@deprecated` on `btnNextText` / `btnSkipText`.
2. **Pure helper** (e.g. `mergeButtonConfig`) — given step config, init config, optional legacy text, and library default text, return the merged `ButtonConfig` (and/or the text/`className` pair the renderer expects).
3. **`StepController.renderButtons`** — replace the current “step config + btn*Text default” calls with helper-resolved configs for next / prev / skip.
4. **Unchanged** — `StepNormalizer`, visibility (`showNext` / `showPrev` / `showSkip`), `OverlayRenderer` configure methods.

`EnjoyHint` already forwards full options into `StepController`; no constructor API change beyond the new option fields.

## Tests

1. **Helper unit tests** — field merge; legacy text fallback; object text beats `btnNextText`; step beats init; empty configs → library default text.
2. **Integration-style test** — init `nextButton` / `skipButton` / `prevButton` apply on a step with no per-step button config; a step that sets only `text` keeps init `className`.

## Docs

- README: document init-level `nextButton` / `prevButton` / `skipButton` under initialization options.
- README + types: mark `btnNextText` / `btnSkipText` deprecated; point authors to `nextButton.text` / `skipButton.text`.
- Keep existing per-step button documentation.

## Out of Scope

- Global show/hide defaults for nav buttons
- Removing `btnNextText` / `btnSkipText`
- Nested `buttons: { next, skip, prev }` options object
