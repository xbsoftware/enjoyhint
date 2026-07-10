# Label/Target Overlap Toggle Button — Design Spec

**Date:** 2026-07-10
**Status:** Approved

## Summary

Add a small toggle button that appears whenever a step's label (caption) visually overlaps the spotlight area, letting the user temporarily hide the label (sliding it off-screen to the left) to see and click the highlighted target, then bring it back with a second click.

## Problem

The label is centered in the viewport for "oversized" placements, and can also end up close to the target after clamping for side placements. In both cases the label can visually cover part or all of the spotlight — including the target itself — even though the label has `pointer-events: none` and clicks still pass through to the target underneath. The user can't see what they're supposed to click.

## Goals

- Detect, per step, whether the rendered label actually overlaps the spotlight area (not just the "oversized" case).
- Give the user a way to temporarily hide the label to see the target, and bring it back.
- Reuse existing geometry, styling, and animation conventions already in the codebase (no new dependencies).

## Non-Goals

- Changing label placement/sizing logic (`labelPlacement.ts`) to avoid overlap in the first place.
- Persisting hidden state across steps.
- Configurability (enable/disable via public API options) — this ships as always-on behavior.

## Decisions

| Decision | Choice |
| --- | --- |
| Trigger condition | Rectangle intersection between the label's rendered bounds and the **spotlight rect** (`SpotlightRect` from `computeStepSpotlight`, not the raw target rect), gated by a small minimum overlap-area threshold to avoid flicker on near-miss/edge-touch cases |
| Button placement | Anchored just outside the spotlight hole, on the side of the target opposite the label (computed from the label-center → spotlight-center vector), ~12px offset from the hole edge |
| Button style | Circular button matching `.enjoyhint_close_btn` conventions (size, colors, hover transition), with an eye / eye-slash icon that swaps synchronously on click |
| Hide animation | Label always slides left: `transform: translateX(-(label.right + margin))` combined with an opacity fade, using the existing 400ms `cubic-bezier(0.42, 0, 0.58, 1)` transition already used for label reveal |
| Show animation | Reverse of hide: transform back to `translate(0, 0)`, opacity back to 1, same transition |
| State scope | Per-step `labelHidden` boolean on `StepController`, always reset to `false` when a new step's overlay renders |
| Geometry recompute | Reuses the existing `requestAnimationFrame`-driven geometry pipeline (resize/scroll/reflow) — no new observers |

## Detection Mechanism

`StepController.renderLabel()` already computes:
- `spotlight: SpotlightRect` (`top`/`right`/`bottom`/`left`/`centerX`/`centerY`) — passed in from `computeStepSpotlight()`, and is frequently larger than the raw target rect (default `margin: 10`, configurable per-step `top`/`right`/`bottom`/`left` offsets, or `radius + 5` for circle shapes).
- `placement.label` (`x`, `y`, `width`) plus `labelHeight` from measurement.

New logic computes the intersection rectangle between the label's box (`x`, `y`, `width`, `labelHeight`) and the spotlight rect, and compares its area against a small constant threshold (e.g. a handful of px² — exact value tuned during implementation, not user-visible/configurable). If the intersection area exceeds the threshold, the step is flagged as overlapping and the toggle button is mounted for that step; otherwise no button is mounted.

This runs for every placement side, not just `"oversized"`, so side-placements that end up close to the target after viewport clamping are covered too.

## Button Component

- New button element, created/destroyed alongside the rest of the step's overlay chrome (same lifecycle as the existing close button in `OverlayRenderer`).
- Positioned by computing the vector from the label's center to the spotlight's center, then placing the button on the spotlight's edge in that direction (i.e. the edge of the target away from the label), offset ~12px outward from the hole boundary.
- Repositioned on the same geometry recompute pass as the spotlight/label (resize, scroll, reflow) — no independent observer.
- z-index and visual styling follow the existing button-layer conventions (matches `.enjoyhint_close_btn` circular styling, same hover transition).
- Icon: eye (label visible) / eye-slash (label hidden), swapped immediately on click — no separate icon transition.

## Animation

- **Hide:** on click, apply `transform: translateX(-(label.getBoundingClientRect().right + margin))` (moves the entire label fully past the left edge of the viewport) plus `opacity: 0`, using the existing 400ms `cubic-bezier(0.42, 0, 0.58, 1)` transition timing already used elsewhere for label reveal/hide.
- **Show:** on second click, reverse — `transform: translate(0, 0)`, `opacity: 1`, same transition.
- Direction is always left, regardless of the label's current position on screen (no per-step direction calculation).
- The label already has `pointer-events: none`, so no click-blocking concerns while off-screen or mid-transition.

## State Management

- `StepController` tracks `labelHidden: boolean` for the current step, initialized to `false` whenever a new step's overlay is rendered (`renderOverlay`/`renderLabel`).
- The toggle button's click handler flips this boolean and applies the corresponding animation/icon state; it does not affect step progression, spotlight, arrow, or nav buttons.
- Moving to the next/previous step tears down and recreates the label, button, and this state from scratch — hidden state never carries over between steps.

## Error Handling / Edge Cases

- If the window is resized mid-step such that the label no longer overlaps the spotlight, the button unmounts on the next geometry recompute pass (same pass that already repositions spotlight/label/arrow).
- If the label is hidden and geometry recomputes (e.g. scroll), it stays hidden and re-anchors to its new off-screen position instantly, without re-triggering the slide transition.
- Steps without a resolvable target/selector never produce a spotlight intersection, so the button simply never mounts — no special-casing required.

## Testing Plan

- Unit tests for the rect-intersection + threshold helper (pure function; fixture rects covering no-overlap, edge-touch-only, partial-overlap, and full-overlap cases).
- Unit tests for the leftward hide/show transform calculation given various label rects and viewport widths.
- Extend existing Playwright-based test coverage (see `tests/parity/issues/`) with a scenario that forces an oversized/overlapping label, asserting: the button appears, clicking it hides the label (transform/opacity applied) without affecting the target's clickability, and clicking again restores it.

## Files Likely Touched

| File | Change |
| --- | --- |
| `src/StepController.ts` | Add overlap detection in `renderLabel()`, add `labelHidden` state, wire toggle button click handling, reset state per step |
| `src/overlay/OverlayRenderer.ts` | Add toggle button creation/mount/positioning (mirrors close-button patterns), hide/show animation application |
| `src/overlay/geometry.ts` (or a new small helper module) | Rect-intersection-with-threshold helper, leftward-offset transform helper |
| `src/jquery.enjoyhint.css` | Toggle button styles (circular, eye/eye-slash icon, transition) |
| `tests/` | New unit tests for intersection/threshold and transform helpers; extended Playwright scenario |
