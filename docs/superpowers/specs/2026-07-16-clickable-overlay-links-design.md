# Clickable Links in Overlay Description — Design Spec

**Date:** 2026-07-16  
**Status:** Approved  
**Plan:** `docs/superpowers/plans/2026-07-16-clickable-overlay-links.md`

## Summary

Make HTML `<a>` tags inside step `description` text clickable. Links open in a new tab; the tour keeps running. Non-link label area still ignores pointer events so clicks can pass through to the spotlight target.

## Problem

`description` already accepts HTML and is rendered with `innerHTML`. Authors can include `<a href="...">`, but `.enjoy_hint_label` uses `pointer-events: none` so clicks pass through the label to the highlighted element. Links appear but are not clickable.

## Goals

- Authors keep using HTML `<a>` in `description` (no new step API).
- Only anchors receive pointer events; empty label space stays click-through.
- Every label link opens in a new tab (`target="_blank"`) with `rel="noopener noreferrer"`.
- Clicking a link does not advance, skip, or finish the tour.
- Document the behavior in the README.
- Cover with unit tests.

## Non-Goals

- Markdown link syntax
- A separate `links` step field
- Same-tab navigation
- General HTML sanitization beyond forcing link open attributes
- Changing label placement, oversized path, or overlap toggle

## Decisions

| Decision | Choice |
| --- | --- |
| Authoring API | Existing HTML in `description` |
| Pointer events | Label remains `none`; `.enjoy_hint_label a` gets `all` |
| Label stacking | Label `z-index: 1012` (same as nav buttons) so it sits above `.enjoyhint_disable_events` (1011); otherwise transparent blockers intercept link clicks |
| Open behavior | Always force `target="_blank"` and `rel="noopener noreferrer"` (overwrite author values) |
| Tour interaction | No advance/skip/finish on link click |
| Approach | CSS for clickability + small post-process after label HTML is applied |

## Behavior

```js
{
  selector: ".help",
  event: "next",
  description: 'Need help? See <a href="https://example.com/docs">the docs</a>.'
}
```

1. Label HTML renders as today.
2. After the label node is in the DOM (immediate render and delayed `scheduleLabelPresentation` mount), query `a[href]` and set `target="_blank"` and `rel="noopener noreferrer"`.
3. User can click the link; browser opens a new tab. Tour state is unchanged.
4. Clicks on non-`<a>` label pixels still pass through (`pointer-events: none` on the label).

## Files Touched

| File | Change |
| --- | --- |
| `src/jquery.enjoyhint.css` | `.enjoy_hint_label a { pointer-events: all; cursor: pointer; }` |
| `src/overlay/OverlayRenderer.ts` | Helper to prepare label anchors; call after label HTML is applied |
| `README.md` | Note that description may include `<a href="...">` and links open in a new tab |
| Tests (OverlayRenderer / related) | Assert anchors get `target` / `rel`; label non-anchors stay non-interactive by CSS contract |

## Testing Plan

- Unit: description with an `<a href>` yields a label link with `target="_blank"` and `rel="noopener noreferrer"`.
- Unit: existing `target` / `rel` on the author HTML are overwritten.
- Regression: labels without links still have `pointer-events: none` on the label container; no new step fields required.
