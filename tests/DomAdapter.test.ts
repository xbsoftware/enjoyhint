import { afterEach, describe, expect, it } from "vitest";
import { DomAdapter } from "../src/DomAdapter";

function mountIframe(html: string): HTMLIFrameElement {
  const iframe = document.createElement("iframe");
  document.body.append(iframe);

  const doc = iframe.contentDocument!;
  doc.open();
  doc.write(html);
  doc.close();

  return iframe;
}

describe("DomAdapter", () => {
  const dom = new DomAdapter();

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("queries elements in the main document", () => {
    const button = document.createElement("button");
    button.id = "main-target";
    document.body.append(button);

    expect(dom.query("#main-target")).toBe(button);
  });

  it("queries elements inside same-origin iframes", () => {
    const iframe = mountIframe("<html><body><button id='iframe-target'>Inside</button></body></html>");
    const target = iframe.contentDocument!.querySelector("#iframe-target");

    expect(dom.query("#iframe-target")).toBe(target);
  });

  it("prefers main-document matches over iframe matches", () => {
    const mainTarget = document.createElement("button");
    mainTarget.id = "shared-target";
    document.body.append(mainTarget);

    mountIframe("<html><body><button id='shared-target'>Inside</button></body></html>");

    expect(dom.query("#shared-target")).toBe(mainTarget);
  });

  it("returns viewport coordinates for iframe elements", () => {
    const iframe = mountIframe(
      "<html><body style='margin:0'><button id='iframe-target' style='margin:16px;width:70px;height:36px'></button></body></html>",
    );
    iframe.style.position = "absolute";
    iframe.style.left = "25px";
    iframe.style.top = "90px";
    iframe.style.width = "300px";
    iframe.style.height = "180px";

    const target = iframe.contentDocument!.querySelector<HTMLButtonElement>("#iframe-target")!;
    const viewportRect = dom.getBoundingClientRect(target);
    const iframeRect = iframe.getBoundingClientRect();
    const localRect = target.getBoundingClientRect();

    expect(viewportRect.left).toBeCloseTo(iframeRect.left + localRect.left, 0);
    expect(viewportRect.top).toBeCloseTo(iframeRect.top + localRect.top, 0);
    expect(viewportRect.width).toBe(localRect.width);
    expect(viewportRect.height).toBe(localRect.height);
  });
});
