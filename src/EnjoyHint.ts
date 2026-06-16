import { normalizeSteps } from "./StepNormalizer";
import type { EnjoyHintOptions, NormalizedStep } from "./types";

type RawStep = Record<string, unknown>;

type RequiredCallbacks = Required<
  Pick<EnjoyHintOptions, "onStart" | "onEnd" | "onSkip" | "onNext">
>;

export class EnjoyHint {
  private steps: NormalizedStep[] = [];
  private currentStep = 0;
  private options: RequiredCallbacks & EnjoyHintOptions;

  constructor(configs: EnjoyHintOptions = {}) {
    this.options = {
      onStart: configs.onStart ?? (() => {}),
      onEnd: configs.onEnd ?? (() => {}),
      onSkip: configs.onSkip ?? (() => {}),
      onNext: configs.onNext ?? (() => {}),
      ...configs,
    };
  }

  setScript(data: RawStep[]): void {
    if (!Array.isArray(data) || data.length < 1) {
      throw new Error("Configurations list isn't correct.");
    }

    this.steps = normalizeSteps(data);
  }

  set = (data: RawStep[]): void => this.setScript(data);

  setSteps = (data: RawStep[]): void => this.setScript(data);

  getCurrentStep(): number {
    return this.currentStep;
  }

  setCurrentStep(cs: number): void {
    this.currentStep = cs;
  }

  runScript(): void {
    this.currentStep = 0;
    this.options.onStart();
    // StepController is wired in Milestone 5.
  }

  run = (): void => this.runScript();

  resumeScript(): void {
    // StepController is wired in Milestone 5.
  }

  resume = (): void => this.resumeScript();

  trigger(eventName: string): void {
    if (eventName === "next") {
      if (this.currentStep < this.steps.length) {
        this.currentStep += 1;
      }
      return;
    }

    if (eventName === "skip") {
      this.stop();
      return;
    }

    // Custom EventBus dispatch is wired in Milestone 5.
  }

  stop(): void {
    this.destroy();
  }

  clear(): void {
    // Button reset is wired in Milestone 5.
  }

  destroy(): void {
    // Renderer cleanup is wired in Milestone 5.
  }
}
