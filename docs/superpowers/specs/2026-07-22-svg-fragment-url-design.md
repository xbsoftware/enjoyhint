# SVG Fragment URL Fix for SPA Routing — Design Spec

**Date:** 2026-07-22  
**Status:** Approved  
**Issue:** [#28](https://github.com/xbsoftware/enjoyhint/issues/28)

## Summary

Build absolute `url("…#id")` references for SVG `marker-end` and `mask` so arrow heads and spotlight masks resolve correctly under SPA path and hash routing (e.g. Ember).

## Problem

EnjoyHint attaches arrow heads with `marker-end="url(#arrowMarker)"` and the spotlight overlay with `mask="url(#…)"`. Browsers resolve those fragment URLs against the document URL. In Ember and similar SPAs, the address bar often includes a path or hash route, so the bare `#id` reference fails to find the marker/mask. The path/arc still draws; the arrow head (and potentially the mask) does not.

The issue reporter fixed it by prefixing `window.location.href`. That works for many cases but can produce a broken double-hash on hash routers (`…#/route#arrowMarker`).

## Goals

- Resolve SVG fragment refs with an absolute URL that **replaces** any existing hash.
- Fix both arrow `marker-end` (`SvgArrow`) and spotlight `mask` (`SvgMaskSpotlight`).
- Keep current arrow/marker geometry, mask drawing, IDs, colors, and public API unchanged.
- Cover with unit tests for the helper and updated call-site assertions.

## Non-Goals

- Changing arrow/marker geometry or mask drawing behavior.
- Fixing legacy `src/legacy/jquery.enjoyhint.js` or bundled `enjoyhint.js` in this change.
- Ember/browser e2e tests.
- Public API or init-option changes.
- Documentation beyond what implementation planning may add (e.g. changelog).

## Decisions

| Decision | Choice |
| --- | --- |
| Approach | Shared absolute fragment URL helper |
| Hash handling | Replace existing hash via `URL.hash` (not append to `location.href`) |
| Call sites | `SvgArrow` + `SvgMaskSpotlight` |
| Helper location | `src/overlay/svgFragmentUrl.ts` |
| Legacy jQuery bundle | Out of scope |
| Quoting | Always wrap href in double quotes inside `url("…")`; escape `"` in href |

## Architecture

### Helper

```ts
// src/overlay/svgFragmentUrl.ts
export function svgFragmentUrl(elementId: string): string
```

Behavior:

1. Caller passes the DOM `id` **without** a leading `#` (e.g. `"arrowMarker"`).
2. `const url = new URL(window.location.href)`
3. `url.hash = elementId` (URL API sets `#elementId`, replacing SPA hashes such as `#/dashboard`)
4. Return `url("${href}")` where `href` is `url.href` with `"` escaped as `\"`

### Call sites

| File | Attribute | Usage |
| --- | --- | --- |
| `src/overlay/SvgArrow.ts` | `marker-end` | `svgFragmentUrl("arrowMarker")` |
| `src/overlay/SvgMaskSpotlight.ts` | `mask` | `svgFragmentUrl(this.maskId)` |

Marker/mask DOM creation in `OverlayRenderer` / `SvgMaskSpotlight` stays as-is (same element IDs).

### Data flow

```
window.location.href
        │
        ▼
 svgFragmentUrl(id) ──► url("https://host/path?q#id")
        │
        ├── SvgArrow.render → path marker-end
        └── SvgMaskSpotlight.ensureOverlay → rect mask
```

## Testing

### `svgFragmentUrl` unit tests

- Path routing (`/users/1`) → `url("http://…/users/1#id")`
- Hash routing (`#/dashboard`) → existing hash replaced (`…#id`, not `…#/dashboard#id`)
- Query string preserved on the absolute URL
- `"` characters in the document URL are percent-encoded by the URL API (`%22`); the helper also escapes any residual `"` inside `url("…")` as defense in depth


### Existing test updates

- `tests/SvgArrow.test.ts` — `marker-end` matches helper output (not bare `url(#arrowMarker)`)
- `tests/SvgMaskSpotlight.test.ts` — `mask` matches helper output where the attribute is asserted
- `tests/OverlayRenderer.test.ts` — update any `mask` / `url(#…)` assertions the same way

jsdom tests can set `window.location` (or equivalent test harness URL) as needed for path/hash/query cases.

## Error handling

No new failure modes: `URL` and hash assignment are standard; invalid `elementId` would already fail marker/mask lookup today. The helper does not validate that the element exists.

## Implementation notes

- Prefer asserting against `svgFragmentUrl(...)` (or a stable regex/prefix + `#id` suffix) rather than hard-coding a full absolute URL that couples tests to the jsdom default origin.
- Do not change public exports unless the package already re-exports overlay internals (keep the helper internal to overlay).
