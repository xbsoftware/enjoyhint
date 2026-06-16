import type { NormalizedStep } from "./types";

type RawStep = Record<string, unknown>;

const EVENT_TYPES = new Set(["next", "auto", "custom"]);

function normalizeEventType(eventName: string): NormalizedStep["eventType"] | undefined {
  if (EVENT_TYPES.has(eventName)) {
    return eventName as NormalizedStep["eventType"];
  }

  if (eventName.startsWith("custom")) {
    return "custom";
  }

  return undefined;
}

export function normalizeStep(raw: RawStep): NormalizedStep {
  const step: NormalizedStep = { selector: "", event: "", description: "" };

  if (typeof raw.selector === "string") step.selector = raw.selector;
  if (typeof raw.event === "string") step.event = raw.event;
  if (typeof raw.description === "string") step.description = raw.description;
  if (typeof raw.event_selector === "string") step.eventSelector = raw.event_selector;
  if (typeof raw.event_type === "string") {
    step.eventType = raw.event_type as NormalizedStep["eventType"];
  }
  if (typeof raw.keyCode === "number") step.keyCode = raw.keyCode;
  if (raw.shape === "rect" || raw.shape === "circle") step.shape = raw.shape;
  if (typeof raw.radius === "number") step.radius = raw.radius;
  if (typeof raw.margin === "number") step.margin = raw.margin;
  if (typeof raw.top === "number") step.top = raw.top;
  if (typeof raw.right === "number") step.right = raw.right;
  if (typeof raw.bottom === "number") step.bottom = raw.bottom;
  if (typeof raw.left === "number") step.left = raw.left;
  if (typeof raw.scrollAnimationSpeed === "number") {
    step.scrollAnimationSpeed = raw.scrollAnimationSpeed;
  }
  if (typeof raw.timeout === "number") step.timeout = raw.timeout;
  if (typeof raw.arrowColor === "string") step.arrowColor = raw.arrowColor;
  if (typeof raw.showNext === "boolean") step.showNext = raw.showNext;
  if (typeof raw.showPrev === "boolean") step.showPrev = raw.showPrev;
  if (typeof raw.showSkip === "boolean") step.showSkip = raw.showSkip;
  if (raw.nextButton && typeof raw.nextButton === "object") {
    step.nextButton = raw.nextButton as NormalizedStep["nextButton"];
  }
  if (raw.prevButton && typeof raw.prevButton === "object") {
    step.prevButton = raw.prevButton as NormalizedStep["prevButton"];
  }
  if (raw.skipButton && typeof raw.skipButton === "object") {
    step.skipButton = raw.skipButton as NormalizedStep["skipButton"];
  }
  if (typeof raw.onBeforeStart === "function") {
    step.onBeforeStart = raw.onBeforeStart as () => void;
  }

  if (!step.selector) {
    for (const prop of Object.keys(raw)) {
      const parts = prop.split(" ");

      if (parts.length >= 2 && parts[1]) {
        step.selector = parts.slice(1).join(" ");
        step.event = parts[0] ?? "";
        step.eventType = normalizeEventType(step.event);
        step.description = String(raw[prop]);
        break;
      }
    }
  }

  return step;
}

export function normalizeSteps(rawSteps: RawStep[]): NormalizedStep[] {
  return rawSteps.map(normalizeStep);
}
