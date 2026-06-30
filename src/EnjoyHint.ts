import { normalizeSteps } from "./StepNormalizer";
import { StepController } from "./StepController";
import type { EnjoyHintOptions, NormalizedStep } from "./types";

type RawStep = Record<string, unknown>;

type RequiredCallbacks = Required<
  Pick<EnjoyHintOptions, "onStart" | "onEnd" | "onSkip" | "onNext">
>;

export class EnjoyHint {
  private steps: NormalizedStep[] = [];
  private options: RequiredCallbacks & EnjoyHintOptions;
  private controller: StepController;

  constructor(configs: EnjoyHintOptions = {}) {
    this.options = {
      onStart: configs.onStart ?? (() => {}),
      onEnd: configs.onEnd ?? (() => {}),
      onSkip: configs.onSkip ?? (() => {}),
      onNext: configs.onNext ?? (() => {}),
      ...configs,
    };
    this.controller = new StepController(this.steps, this.options);
  }

  setScript(data: RawStep[]): void {
    if (!Array.isArray(data) || data.length < 1) {
      throw new Error("Configurations list isn't correct.");
    }

    this.steps = normalizeSteps(data);
    this.controller.setSteps(this.steps);
  }

  set = (data: RawStep[]): void => this.setScript(data);

  setSteps = (data: RawStep[]): void => this.setScript(data);

  getCurrentStep(): number {
    return this.controller.getCurrentStep();
  }

  setCurrentStep(cs: number): void {
    this.controller.setCurrentStep(cs);
  }

  runScript(): void {
    this.controller.run();
  }

  run = (): void => this.runScript();

  resumeScript(): void {
    this.controller.resume();
  }

  resume = (): void => this.resumeScript();

  reRunScript(cs: number): void {
    this.controller.reRunScript(cs);
  }

  trigger(eventName: string): void {
    this.controller.trigger(eventName);
  }

  stop(): void {
    this.controller.stop();
  }

  clear(): void {
    this.controller.clear();
  }

  destroy(): void {
    this.controller.destroy();
  }
}
