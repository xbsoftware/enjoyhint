# RTL Support (`dir` option) — Design Spec

**Date:** 2026-07-15  
**Status:** Approved  
**Issue:** [#138](https://github.com/xbsoftware/enjoyhint/issues/138)  
**Plan:** `docs/superpowers/plans/2026-07-15-rtl-support.md`

## Summary

Add an explicit tour-wide `dir: "ltr" | "rtl"` option (default `"ltr"`) so EnjoyHint chrome can mirror for RTL tours independently of the host page’s direction. Spotlight/highlight geometry stays physical and correct in all cases. The overlay root isolates itself from host `direction` so RTL pages no longer break layout (the reporter’s `direction: initial` workaround).

## Problem

On RTL host pages, EnjoyHint inherits `direction: rtl` and mis-lays out overlay chrome. The issue reporter fixed it locally by forcing `direction: initial` on the library CSS. Separately, apps that *want* an RTL tour need mirrored chrome (button order, close corner, label hide slide) without flipping the spotlight off the real target.

## Goals

- Expose `dir?: "ltr" | "rtl"` on `EnjoyHintOptions`, default `"ltr"`.
- Isolate the overlay root from host page direction via HTML `dir` + CSS `direction`.
- When `dir: "rtl"`, mirror EnjoyHint chrome only.
- Keep spotlight, event blockers, and arrow geometry tied to element/viewport physical coordinates in both modes.
- Cover with unit tests; keep existing LTR behavior unchanged.

## Non-Goals

- Auto-detecting page `dir` / `lang`
- Per-step `dir` or a runtime setter
- Mirroring spotlight, arrows, or step shape offsets (`left` / `right` / etc.)
- Translating default button label strings
- Rewriting placement to CSS logical properties across the codebase

## Decisions

| Decision | Choice |
| --- | --- |
| API shape | `dir?: "ltr" \| "rtl"` on constructor options; default `"ltr"` |
| Scope | Tour-wide only; set at construction; passed into `OverlayRenderer` like `backgroundColor` |
| Host isolation | Always set overlay root `dir` / `direction` from the option so host LTR/RTL cannot leak |
| What mirrors | Close corner, nav button row order, label hide slide direction, toggle close-zone corner, label text flow |
| What does not | Spotlight/mask, blockers, arrow endpoints, step shape offsets |
| Approach | Targeted JS mirroring + root `dir` (not CSS-only, not a full logical-coordinate rewrite) |

## API & Isolation

```ts
new EnjoyHint({ dir: "rtl" })
```

- Add `dir?: "ltr" | "rtl"` to `EnjoyHintOptions`.
- `StepController` constructs / configures `OverlayRenderer` with the resolved `dir` (default `"ltr"`).
- On `mount()`, set `root.setAttribute("dir", dir)` and ensure CSS `direction` matches (via attribute or `.enjoyhint { direction: ... }` driven by the attribute).
- Default `"ltr"` restores correct layout on RTL host pages without any caller change (fixes #138 for the common case). Callers who want mirrored chrome opt in with `dir: "rtl"`.

## Chrome Mirroring (`dir: "rtl"`)

| Chrome | LTR (default) | RTL |
| --- | --- | --- |
| Close button | top-right (`right: 10px`) | top-left (`left: 10px`) |
| Nav button row | Prev → Next → Skip (left → right) | Skip → Next → Prev (mirrored along the row’s horizontal axis) |
| Label hide slide | `translateX(-offset)` off the left edge | `translateX(+offset)` off the right edge |
| Toggle close-zone | Avoid top-right corner | Avoid top-left corner |
| Label text | `direction: ltr` on root | `direction: rtl` on root |

Nav-row mirroring: keep the same row anchor/`distance` clamping logic, then place buttons so their order is the horizontal mirror of the LTR order (Skip at the start edge of the row in RTL, Prev at the end). `buttonRowRect` remains the physical bounding box of the placed buttons.

Label hide: extend `computeLabelHideOffsetPx` (or a sibling helper) to accept `dir` (and viewport width for RTL) and return the distance to clear the appropriate viewport edge (`label.left + width + margin` for LTR; `viewportWidth - label.left + margin` for RTL). `OverlayRenderer` applies `translateX(-N)` or `translateX(+N)` accordingly.

Toggle placement: `computeToggleButtonPosition` skips the close-button corner for the active `dir` (top-right in LTR, top-left in RTL). `StepController` builds the close avoid-rect from the mirrored corner.

## Spotlight & Geometry (unchanged)

Spotlight shape/position, event blockers, and arrow endpoints continue to use physical viewport and element geometry. `dir` must not alter:

- `SvgMaskSpotlight` / mask hole placement
- Blocker rects around the spotlight
- Arrow `xFrom`/`yFrom`/`xTo`/`yTo` derived from target placement
- Step `left` / `right` / `top` / `bottom` / `margin` shape offsets (physical insets on the target)

## Files Touched

| File | Change |
| --- | --- |
| `src/types.ts` | Add `dir?: "ltr" \| "rtl"` to `EnjoyHintOptions` |
| `src/overlay/OverlayRenderer.ts` | Accept `dir`; set root `dir`; mirror close, button row, hide slide |
| `src/overlay/labelOverlapToggle.ts` | Dir-aware hide offset + close-corner skip |
| `src/StepController.ts` | Pass `dir`; mirrored close avoid-rect |
| `src/jquery.enjoyhint.css` | Ensure direction isolation (if not fully covered by the `dir` attribute) |
| `tests/OverlayRenderer.test.ts` | Close corner, root `dir`, button order, hide transform |
| `tests/labelOverlapToggle.test.ts` | RTL hide offset + corner candidates |
| `tests/` (spotlight / renderer) | Assert highlight rect unchanged under `dir: "rtl"` and under host `direction: rtl` |

## Testing Plan

- Unit: root `dir` for `"ltr"` and `"rtl"`; close button corner; nav row order mirrored; label hide `+translateX` in RTL; toggle avoids mirrored close corner.
- Regression: existing LTR overlay / button / toggle tests pass with default `dir`.
- Spotlight: highlight rect identical with `dir: "rtl"` and when `document.documentElement` (or body) has `direction: rtl`.
- Optional e2e/example fixture with `dir: "rtl"` for visual check — not required if unit coverage is solid.
