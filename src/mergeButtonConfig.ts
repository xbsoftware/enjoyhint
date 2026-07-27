import type { ButtonConfig } from "./types";

export function mergeButtonConfig(
  step?: ButtonConfig,
  init?: ButtonConfig,
  legacyText?: string,
): ButtonConfig | undefined {
  const text = step?.text ?? init?.text ?? legacyText;
  const className = step?.className ?? init?.className;
  if (text === undefined && className === undefined) {
    return undefined;
  }
  return {
    ...(text !== undefined ? { text } : {}),
    ...(className !== undefined ? { className } : {}),
  };
}
