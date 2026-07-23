import { svgFragmentUrl } from "./svgFragmentUrl";

const SVG_NS = "http://www.w3.org/2000/svg";
const MASK_ID_PREFIX = "enjoyhint-spotlight-mask";
const SPOTLIGHT_HOLE_ATTR = "data-enjoyhint-spotlight-hole";
export const LEGACY_INITIAL_SPOTLIGHT_STATE: SpotlightGeometryState = {
  centerX: -130,
  centerY: -130,
  width: 0,
  height: 0,
  radius: 0,
};

export const LEGACY_COLLAPSED_SPOTLIGHT_STATE: SpotlightGeometryState = {
  centerX: 0,
  centerY: 0,
  width: 0,
  height: 0,
  radius: 0,
};

export const LEGACY_SPOTLIGHT_ANIMATION_DURATION_MS = 200;

let nextMaskId = 0;

export interface SpotlightGeometryState {
  centerX: number;
  centerY: number;
  width: number;
  height: number;
  radius: number;
}

export interface SvgMaskSpotlightUpdate {
  shape: "rect" | "circle";
  x: number;
  y: number;
  width: number;
  height: number;
  radius?: number;
  animationFrom?: SpotlightGeometryState;
  animationProgress?: number;
}

export function computeTargetSpotlightState(update: SvgMaskSpotlightUpdate): SpotlightGeometryState {
  const targetRadius =
    update.shape === "circle" ? (update.radius ?? Math.min(update.width, update.height) / 2) : (update.radius ?? 0);
  const targetWidth = update.shape === "circle" ? targetRadius * 2 : update.width;
  const targetHeight = update.shape === "circle" ? targetRadius * 2 : update.height;

  return {
    centerX: update.x + update.width / 2,
    centerY: update.y + update.height / 2,
    width: targetWidth,
    height: targetHeight,
    radius: targetRadius,
  };
}

export function sampleSpotlightGeometry(
  from: SpotlightGeometryState,
  to: SpotlightGeometryState,
  progress: number,
): SpotlightGeometryState {
  const clamped = applyLegacyKineticEaseInOut(clampProgress(progress));

  return {
    centerX: interpolate(from.centerX, to.centerX, clamped),
    centerY: interpolate(from.centerY, to.centerY, clamped),
    width: interpolate(from.width, to.width, clamped),
    height: interpolate(from.height, to.height, clamped),
    radius: interpolate(from.radius, to.radius, clamped),
  };
}

export function applyLegacyKineticEaseInOut(progress: number): number {
  const clamped = clampProgress(progress);

  if (clamped < 0.5) {
    return 2 * clamped * clamped;
  }

  return -1 + (4 - 2 * clamped) * clamped;
}

export function toSpotlightHoleRect(state: SpotlightGeometryState): {
  x: number;
  y: number;
  width: number;
  height: number;
  radius: number;
} {
  const width = state.width;
  const height = state.height;

  return {
    x: state.centerX - Math.round(width / 2),
    y: state.centerY - Math.round(height / 2),
    width,
    height,
    radius: state.radius,
  };
}

export class SvgMaskSpotlight {
  private readonly svg: SVGSVGElement;
  private readonly fill: string;
  private readonly maskId: string;
  private mask?: SVGMaskElement;
  private overlay?: SVGRectElement;
  private hole?: SVGRectElement;

  constructor(svg: SVGSVGElement, fill: string, maskId = createMaskId()) {
    this.svg = svg;
    this.fill = fill;
    this.maskId = maskId;
  }

  update(update: SvgMaskSpotlightUpdate): SpotlightGeometryState {
    this.ensureMask();
    this.ensureOverlay();
    const target = computeTargetSpotlightState(update);
    const from = update.animationFrom ?? LEGACY_INITIAL_SPOTLIGHT_STATE;
    const sampled = sampleSpotlightGeometry(from, target, update.animationProgress ?? 1);
    this.updateHole(toSpotlightHoleRect(sampled));
    return sampled;
  }

  private ensureMask(): void {
    if (this.mask) {
      return;
    }

    const defs = this.getOrCreateDefs();
    const mask = document.createElementNS(SVG_NS, "mask");
    mask.setAttribute("id", this.maskId);
    mask.setAttribute("maskUnits", "userSpaceOnUse");
    mask.setAttribute("x", "0");
    mask.setAttribute("y", "0");
    mask.setAttribute("width", "100%");
    mask.setAttribute("height", "100%");

    const visibleArea = document.createElementNS(SVG_NS, "rect");
    visibleArea.setAttribute("x", "0");
    visibleArea.setAttribute("y", "0");
    visibleArea.setAttribute("width", "100%");
    visibleArea.setAttribute("height", "100%");
    visibleArea.setAttribute("fill", "white");
    visibleArea.setAttribute("pointer-events", "none");

    mask.append(visibleArea);
    defs.append(mask);
    this.mask = mask;
  }

  private ensureOverlay(): void {
    if (this.overlay) {
      return;
    }

    const overlay = document.createElementNS(SVG_NS, "rect");
    overlay.setAttribute("x", "0");
    overlay.setAttribute("y", "0");
    overlay.setAttribute("width", "100%");
    overlay.setAttribute("height", "100%");
    overlay.setAttribute("fill", this.fill);
    overlay.setAttribute("mask", svgFragmentUrl(this.maskId));
    overlay.setAttribute("pointer-events", "none");

    this.svg.append(overlay);
    this.overlay = overlay;
  }

  private updateHole(geometry: { x: number; y: number; width: number; height: number; radius: number }): void {
    if (!this.mask) {
      throw new Error("SvgMaskSpotlight mask was not initialized");
    }

    if (!this.hole) {
      this.hole = document.createElementNS(SVG_NS, "rect");
      this.hole.setAttribute(SPOTLIGHT_HOLE_ATTR, "");
      this.hole.setAttribute("fill", "black");
      this.hole.setAttribute("pointer-events", "none");
      this.mask.append(this.hole);
    }

    this.hole.setAttribute("x", String(geometry.x));
    this.hole.setAttribute("y", String(geometry.y));
    this.hole.setAttribute("width", String(geometry.width));
    this.hole.setAttribute("height", String(geometry.height));
    this.hole.setAttribute("rx", String(geometry.radius));
    this.hole.setAttribute("ry", String(geometry.radius));
  }

  private getOrCreateDefs(): SVGDefsElement {
    const defs = this.svg.querySelector<SVGDefsElement>("defs");
    if (defs) {
      return defs;
    }

    const nextDefs = document.createElementNS(SVG_NS, "defs");
    this.svg.prepend(nextDefs);
    return nextDefs;
  }
}

function interpolate(from: number, to: number, progress: number): number {
  return from + (to - from) * progress;
}

function clampProgress(progress: number): number {
  return Math.min(1, Math.max(0, progress));
}

function createMaskId(): string {
  nextMaskId += 1;
  return `${MASK_ID_PREFIX}-${nextMaskId}`;
}
