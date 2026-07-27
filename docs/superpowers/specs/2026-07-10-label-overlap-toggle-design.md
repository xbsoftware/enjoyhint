# Label/Target Overlap Toggle Button — Design Spec

**Date:** 2026-07-10  
**Status:** Approved (amended 2026-07-14 after implementation bugfixes)  
**Plan:** `docs/superpowers/plans/2026-07-13-label-overlap-toggle.md`

## Summary

Add a small toggle button that appears when an **oversized** (centered, black-background, no-arrow) label overlaps the spotlight, letting the user slide that label off-screen to the left to see and click the target, then bring it back with a second click.

## Problem

Oversized placements center a dark `#272A26` label in the viewport. That label can cover the spotlight and the target. Clicks still pass through (`pointer-events: none`), but the user cannot see what to click. Default side placements with arrows and a transparent label background do not have this problem and must not show the toggle.

## Goals

- Detect, per step, whether an **oversized** label overlaps the spotlight rect.
- Let the user temporarily hide that label with a leftward slide animation, and bring it back.
- Keep the toggle clear of the label, spotlight, nav buttons, and close button.
- Reuse existing geometry, styling, and animation conventions (no new dependencies).

## Non-Goals

- Changing label placement/sizing logic (`labelPlacement.ts`) to avoid overlap.
- Showing the toggle for arrow / transparent-background labels.
- Persisting hidden state across steps.
- Public API options to enable/disable the feature.

## Decisions

| Decision | Choice |
| --- | --- |
| Trigger condition | `placement.side === "oversized"` **and** label∩spotlight area &gt; threshold (`LABEL_OVERLAP_AREA_THRESHOLD_PX2`, 200). Not every placement side. |
| Button placement | `computeToggleButtonPosition`: try spotlight edges (away from label), then **label edges**, then viewport corners (skip top-right). Avoid label, spotlight, button row, close zone. Outer button size 36px; edge offset 30px. |
| Button style | Circular control matching close-button colors; **inline SVG** eye / eye-off via `currentColor` (not CSS pseudo-eyes). |
| CSS hide | `.enjoyhint_label_toggle_btn.enjoyhint_hide { display: none }` must win over the toggle’s `display: inline-flex`. |
| Hide animation | Left slide: `translateX(-(left + width + margin))` + opacity fade, 400ms `cubic-bezier(0.42, 0, 0.58, 1)`. Oversized inline `transition` **must include `transform` and `opacity`**, not only `background-color`. |
| Show animation | Reverse of hide, same transition. |
| State scope | Per-step `labelHidden` on `OverlayRenderer`, reset when `resetHidden: true` (new step render, not resize recompute with `immediate: true`). |
| Geometry recompute | Same deferred pass as `positionButtons` (`scheduleStepTimeout(..., 0)`), after the button row is laid out. |

## Detection Mechanism

In `StepController.renderLabel()`:

1. Compute placement as today.
2. If not oversized → force toggle off; return after positioning nav buttons.
3. If oversized → intersect `labelRect` with `spotlight`, compare to threshold, then position and show the toggle when overlapping.

## Button Component

- Lifecycle aligned with other overlay chrome in `OverlayRenderer`.
- Positioned by `computeToggleButtonPosition` with `avoidRects` for the nav button row and close corner.
- Icon swapped immediately on click (SVG open eye ↔ eye-off).

## Animation

- **Hide:** `transform: translateX(-offset)` + `opacity: 0` (offset from `computeLabelHideOffsetPx`).
- **Show:** clear transform/opacity; transition reverses.
- Always slide left. Only the oversized label participates.

## State Management

- Hidden state does not carry across steps.
- Resize recompute (`immediate: true`) keeps hidden state and repositions without resetting.

## Testing Plan

- Unit: overlap helpers, position candidates (including label-edge clearance), OverlayRenderer toggle + oversized transform transition, StepController oversized-only wiring.
- E2E: oversized fixture (slide mid-animation + target clickable); desktop example1 arrow step (toggle `display: none`).

## Files Touched

| File | Change |
| --- | --- |
| `src/overlay/labelOverlapToggle.ts` | Overlap + `computeToggleButtonPosition` + hide offset |
| `src/overlay/OverlayRenderer.ts` | Button, SVG icons, hide/show, button-row rect, oversized transition |
| `src/StepController.ts` | Oversized-only gate; position after `positionButtons` |
| `src/jquery.enjoyhint.css` | Toggle styles + hide specificity; label transform transition |
| `tests/` | Unit + Playwright coverage as above |
