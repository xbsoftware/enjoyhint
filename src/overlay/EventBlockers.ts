import { positionBlockers, type BlockerRect, type BlockerStyles } from "./geometry";

type BlockerName = keyof BlockerStyles;

const BLOCKER_ORDER: BlockerName[] = ["top", "bottom", "left", "right"];

export class EventBlockers {
  private readonly blockers: HTMLElement[];

  constructor(blockers: Iterable<HTMLElement>) {
    this.blockers = Array.from(blockers);
  }

  apply(rect: BlockerRect): void {
    const styles = positionBlockers(rect);

    BLOCKER_ORDER.forEach((name, index) => {
      const blocker = this.blockers[index];
      if (blocker) {
        Object.assign(blocker.style, styles[name]);
      }
    });
  }
}
