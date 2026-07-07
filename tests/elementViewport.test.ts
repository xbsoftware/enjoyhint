import { afterEach, describe, expect, it } from "vitest";
import {
  getElementViewportRect,
  getElementWindow,
  translateRectToViewport,
} from "../src/elementViewport";

function mountIframe(html: string): HTMLIFrameElement {
  const iframe = document.createElement("iframe");
  iframe.style.position = "absolute";
  iframe.style.width = "320px";
  iframe.style.height = "200px";
  document.body.append(iframe);

  const doc = iframe.contentDocument!;
  doc.open();
  doc.write(html);
  doc.close();

  return iframe;
}

describe("elementViewport", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("returns the parent window for elements in the main document", () => {
    const element = document.createElement("button");
    document.body.append(element);

    expect(getElementWindow(element)).toBe(window);
  });

  it("translates iframe element coordinates into the parent viewport", () => {
    const iframe = mountIframe(
      "<html><body style='margin:0'><button id='target' style='position:absolute;left:30px;top:50px;width:80px;height:40px'></button></body></html>",
    );
    iframe.style.left = "40px";
    iframe.style.top = "120px";

    const button = iframe.contentDocument!.querySelector<HTMLButtonElement>("#target")!;
    const localRect = button.getBoundingClientRect();
    const translated = translateRectToViewport(localRect, button);

    const iframeRect = iframe.getBoundingClientRect();
    expect(translated.left).toBeCloseTo(iframeRect.left + localRect.left, 0);
    expect(translated.top).toBeCloseTo(iframeRect.top + localRect.top, 0);
    expect(translated.width).toBe(localRect.width);
    expect(translated.height).toBe(localRect.height);
  });

  it("returns translated viewport rect via getElementViewportRect", () => {
    const iframe = mountIframe(
      "<html><body style='margin:0'><div id='target' style='width:100px;height:50px;margin:20px'></div></body></html>",
    );
    iframe.style.left = "10px";
    iframe.style.top = "60px";

    const target = iframe.contentDocument!.querySelector<HTMLDivElement>("#target")!;
    const viewportRect = getElementViewportRect(target);
    const iframeRect = iframe.getBoundingClientRect();
    const localRect = target.getBoundingClientRect();

    expect(viewportRect.left).toBeCloseTo(iframeRect.left + localRect.left, 0);
    expect(viewportRect.top).toBeCloseTo(iframeRect.top + localRect.top, 0);
  });
});
