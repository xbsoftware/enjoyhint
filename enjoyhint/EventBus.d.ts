export declare class EventBus {
    private target;
    private listeners;
    on(eventName: string, callback: () => void): void;
    off(eventName: string): void;
    trigger(eventName: string): void;
    private eventName;
}
//# sourceMappingURL=EventBus.d.ts.map