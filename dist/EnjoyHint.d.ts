import { EnjoyHintOptions } from './types';
type RawStep = Record<string, unknown>;
export declare class EnjoyHint {
    private steps;
    private options;
    private controller;
    constructor(configs?: EnjoyHintOptions);
    setScript(data: RawStep[]): void;
    set: (data: RawStep[]) => void;
    setSteps: (data: RawStep[]) => void;
    getCurrentStep(): number;
    setCurrentStep(cs: number): void;
    runScript(): void;
    run: () => void;
    resumeScript(): void;
    resume: () => void;
    reRunScript(cs: number): void;
    trigger(eventName: string): void;
    stop(): void;
    clear(): void;
    destroy(): void;
}
export {};
//# sourceMappingURL=EnjoyHint.d.ts.map