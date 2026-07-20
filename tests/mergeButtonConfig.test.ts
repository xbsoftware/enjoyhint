import { describe, expect, it } from "vitest";
import { mergeButtonConfig } from "../src/mergeButtonConfig";

describe("mergeButtonConfig", () => {
  it("returns undefined when nothing is set", () => {
    expect(mergeButtonConfig(undefined, undefined, undefined)).toBeUndefined();
  });

  it("uses step fields over init fields", () => {
    expect(
      mergeButtonConfig(
        { text: "Step", className: "step" },
        { text: "Init", className: "init" },
        "Legacy",
      ),
    ).toEqual({ text: "Step", className: "step" });
  });

  it("fills missing step fields from init (field merge)", () => {
    expect(
      mergeButtonConfig({ text: "OK" }, { className: "g" }, undefined),
    ).toEqual({ text: "OK", className: "g" });
  });

  it("uses legacy text when step and init text are absent", () => {
    expect(mergeButtonConfig(undefined, { className: "x" }, "A")).toEqual({
      text: "A",
      className: "x",
    });
  });

  it("prefers init text over legacy text", () => {
    expect(mergeButtonConfig(undefined, { text: "B" }, "A")).toEqual({ text: "B" });
  });

  it("returns className-only config when no text sources exist", () => {
    expect(mergeButtonConfig(undefined, { className: "x" }, undefined)).toEqual({
      className: "x",
    });
  });

  it("returns text-only config from legacy helper", () => {
    expect(mergeButtonConfig(undefined, undefined, "Continue")).toEqual({
      text: "Continue",
    });
  });
});
