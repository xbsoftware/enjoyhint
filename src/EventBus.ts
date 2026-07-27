export class EventBus {
  private target = new EventTarget();
  private listeners = new Map<string, Set<() => void>>();

  on(eventName: string, callback: () => void): void {
    const key = this.eventName(eventName);

    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }

    this.listeners.get(key)?.add(callback);
    this.target.addEventListener(key, callback);
  }

  off(eventName: string): void {
    const key = this.eventName(eventName);
    const callbacks = this.listeners.get(key);

    if (!callbacks) {
      return;
    }

    for (const callback of callbacks) {
      this.target.removeEventListener(key, callback);
    }

    this.listeners.delete(key);
  }

  trigger(eventName: string): void {
    this.target.dispatchEvent(new Event(this.eventName(eventName)));
  }

  private eventName(name: string): string {
    return `${name}custom.enjoy_hint`;
  }
}
