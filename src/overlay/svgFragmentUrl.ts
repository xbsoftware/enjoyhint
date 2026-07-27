export function svgFragmentUrl(elementId: string): string {
  const url = new URL(window.location.href);
  url.hash = elementId;
  // url.href percent-encodes special characters; still escape any residual " for url("...").
  const href = url.href.replace(/"/g, '\\"');
  return `url("${href}")`;
}
