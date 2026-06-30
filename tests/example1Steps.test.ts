import { describe, expect, it } from "vitest";
import { normalizeSteps } from "../src/StepNormalizer";

const example1ExtendedSteps = [
  { "next #type": "Previous button demo" },
  {
    "next #text_select2": "Custom buttons",
    nextButton: { text: "Continue", className: "custom-next-demo" },
    prevButton: { text: "Back", className: "custom-prev-demo" },
    skipButton: { text: "Exit tour", className: "custom-skip-demo" },
  },
  { "next #progress-basic": "Arrow color", arrowColor: "#e74c3c" },
  { "next #pr_btm": "Margin", margin: 30 },
  {
    selector: "#change_checkbox",
    event: "click",
    event_type: "auto",
    description: "Auto click",
    timeout: 400,
  },
  {
    selector: "#def_but",
    event: "proceed",
    event_type: "custom",
    description: "Custom trigger",
  },
  { "next #inputEmail": "Timeout", timeout: 500 },
  {
    "click #buttons_ex": "Event selector",
    event_selector: "#buttons_ex a.btn-success",
    showSkip: false,
  },
  {
    "click .alert-success strong": "Show next",
    showNext: true,
  },
];

describe("example1 extended steps", () => {
  it("normalizes the additional showcase step configs", () => {
    const steps = normalizeSteps(example1ExtendedSteps);

    expect(steps).toHaveLength(9);
    expect(steps[0]?.eventType).toBe("next");
    expect(steps[1]?.nextButton?.text).toBe("Continue");
    expect(steps[2]?.arrowColor).toBe("#e74c3c");
    expect(steps[3]?.margin).toBe(30);
    expect(steps[4]?.eventType).toBe("auto");
    expect(steps[4]?.event).toBe("click");
    expect(steps[4]?.selector).toBe("#change_checkbox");
    expect(steps[4]?.timeout).toBe(400);
    expect(steps[5]?.eventType).toBe("custom");
    expect(steps[5]?.event).toBe("proceed");
    expect(steps[5]?.selector).toBe("#def_but");
    expect(steps[6]?.timeout).toBe(500);
    expect(steps[7]?.eventSelector).toBe("#buttons_ex a.btn-success");
    expect(steps[7]?.showSkip).toBe(false);
    expect(steps[8]?.showNext).toBe(true);
  });
});
