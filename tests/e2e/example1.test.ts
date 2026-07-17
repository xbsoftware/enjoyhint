import { expect, test } from "@playwright/test";
import {
  EXAMPLE1_ARROW_COLOR_STEP,
  EXAMPLE1_AUTO_STEP,
  EXAMPLE1_CUSTOM_BUTTONS_STEP,
  EXAMPLE1_CUSTOM_EVENT_STEP,
  EXAMPLE1_EVENT_SELECTOR_STEP,
  EXAMPLE1_IFRAME_STEP,
  EXAMPLE1_LARGE_CIRCLE_STEP,
  EXAMPLE1_MARGIN_STEP,
  EXAMPLE1_PREV_STEP,
  EXAMPLE1_SCROLL_STEP,
  EXAMPLE1_SCROLL_STEP_SPEED_MS,
  EXAMPLE1_SHOW_NEXT_STEP,
  EXAMPLE1_TIMEOUT_STEP,
  EXAMPLE1_TOTAL_STEPS,
  clickEnjoyHintNext,
  findNeighborClickPointInHole,
  getExample1Step,
  getLegacyScrollStepLabelDelay,
  getLegacyScrollStepRenderDelay,
  goToExample1Step,
  openExample1,
  readBlockerHole,
  readSpotlightHoleWidth,
  startExample1Tour,
  waitForStepPresentation,
} from "./example1.helpers";

test.describe("example1 browser e2e", () => {
  test("runs the example1 tour through all configured steps", async ({
    page,
  }) => {
    await openExample1(page);
    await startExample1Tour(page);

    await waitForStepPresentation(page, "omit");
    expect(await getExample1Step(page)).toBe(0);
    expect(await readSpotlightHoleWidth(page)).toBe(0);
    await clickEnjoyHintNext(page);

    await waitForStepPresentation(page, "EnjoyHint");
    expect(await getExample1Step(page)).toBe(1);
    await clickEnjoyHintNext(page);

    await waitForStepPresentation(page, "select different blocks");
    expect(await getExample1Step(page)).toBe(2);
    await clickEnjoyHintNext(page);

    await waitForStepPresentation(page, "handler for a button click");
    expect(await getExample1Step(page)).toBe(3);
    await page.locator("#buttons_ex a.btn-success").first().click();

    await waitForStepPresentation(page, "highlight blocks");
    expect(await getExample1Step(page)).toBe(4);
    await clickEnjoyHintNext(page);

    await waitForStepPresentation(page, "fix radius");
    expect(await getExample1Step(page)).toBe(5);
    await clickEnjoyHintNext(page);

    await waitForStepPresentation(
      page,
      "scroll the page",
      getLegacyScrollStepLabelDelay() + 2000,
    );
    expect(await getExample1Step(page)).toBe(6);
    await clickEnjoyHintNext(page);

    await waitForStepPresentation(page, "keyboard events");
    expect(await getExample1Step(page)).toBe(7);
    await page.locator("#inputSuccess").press("Enter");

    await waitForStepPresentation(page, "Previous");
    expect(await getExample1Step(page)).toBe(8);
    await clickEnjoyHintNext(page);

    await waitForStepPresentation(page, "customized per step");
    expect(await getExample1Step(page)).toBe(9);
    await clickEnjoyHintNext(page);

    await waitForStepPresentation(page, "arrow color");
    expect(await getExample1Step(page)).toBe(10);
    await clickEnjoyHintNext(page);

    await waitForStepPresentation(page, "clickable HTML links");
    expect(await getExample1Step(page)).toBe(11);
    await clickEnjoyHintNext(page);

    await waitForStepPresentation(page, "margin");
    expect(await getExample1Step(page)).toBe(12);
    await clickEnjoyHintNext(page);

    await expect(page.locator("#change_checkbox")).toBeChecked({ timeout: 3000 });
    await waitForStepPresentation(page, "custom", 2000);
    expect(await getExample1Step(page)).toBe(14);
    await page.locator("#def_but").click();

    await waitForStepPresentation(page, "wait before rendering", 2000);
    expect(await getExample1Step(page)).toBe(15);
    await clickEnjoyHintNext(page);

    await waitForStepPresentation(page, "event_selector");
    expect(await getExample1Step(page)).toBe(16);
    await page.locator("#buttons_ex a.btn-success").first().click();

    await waitForStepPresentation(page, "iframes");
    expect(await getExample1Step(page)).toBe(17);
    await clickEnjoyHintNext(page);

    await waitForStepPresentation(page, "onBeforeStart");
    expect(await getExample1Step(page)).toBe(18);
    await clickEnjoyHintNext(page);

    await waitForStepPresentation(page, "showNext");
    expect(await getExample1Step(page)).toBe(20);
    await clickEnjoyHintNext(page);

    await expect(page.locator(".enjoyhint")).toHaveCount(0, { timeout: 5000 });
    expect(await getExample1Step(page)).toBe(EXAMPLE1_TOTAL_STEPS);
  });

  test("allows clicking neighboring buttons inside the large circle spotlight", async ({
    page,
  }) => {
    await openExample1(page);
    await goToExample1Step(page, EXAMPLE1_LARGE_CIRCLE_STEP);
    await waitForStepPresentation(page, "fix radius");

    const hole = await readBlockerHole(page);
    const clickTarget = await findNeighborClickPointInHole(page);

    expect(hole.width).toBeGreaterThanOrEqual(160);
    expect(hole.height).toBeGreaterThanOrEqual(160);
    expect(
      clickTarget,
      "expected a neighboring button to overlap the spotlight hole",
    ).not.toBeNull();

    await page.evaluate((buttonText) => {
      window.__clickedNeighbor = false;
      const row = document
        .querySelector("#mini_button")
        ?.closest("p.bs-component");
      const button = Array.from(
        row?.querySelectorAll("a.btn-primary") ?? [],
      ).find((element) => element.textContent?.trim() === buttonText);
      button?.addEventListener(
        "click",
        () => {
          window.__clickedNeighbor = true;
        },
        { once: true },
      );
    }, clickTarget!.text);

    await page.mouse.click(clickTarget!.x, clickTarget!.y);

    expect(await page.evaluate(() => window.__clickedNeighbor)).toBe(true);
    expect(await getExample1Step(page)).toBe(EXAMPLE1_LARGE_CIRCLE_STEP);
  });

  test("delays step presentation until slow scroll completes", async ({
    page,
  }) => {
    await openExample1(page);
    await page.evaluate(() => window.scrollTo(0, 0));

    await page.evaluate((step) => {
      window.__stepStartedAt = performance.now();
      window.__example1Test.goToStep(step);
    }, EXAMPLE1_SCROLL_STEP);

    const renderDelay = getLegacyScrollStepRenderDelay(
      EXAMPLE1_SCROLL_STEP_SPEED_MS,
    );
    const labelDelay = getLegacyScrollStepLabelDelay(
      EXAMPLE1_SCROLL_STEP_SPEED_MS,
    );

    const pollTimeout = Math.max(500, renderDelay - 400);

    await expect
      .poll(
        async () =>
          page
            .locator(".enjoy_hint_label")
            .isVisible()
            .catch(() => false),
        { timeout: pollTimeout },
      )
      .toBe(false);

    await expect
      .poll(async () => readSpotlightHoleWidth(page), { timeout: pollTimeout })
      .toBe(0);

    const earlyScrollY = await page.evaluate(() => window.scrollY);
    expect(earlyScrollY).toBeGreaterThan(0);

    await page.waitForTimeout(700);
    const laterScrollY = await page.evaluate(() => window.scrollY);
    expect(laterScrollY).toBeGreaterThanOrEqual(earlyScrollY);

    await expect(page.locator(".enjoy_hint_label")).toBeVisible({
      timeout: labelDelay + 1000,
    });
    await expect(page.locator(".enjoy_hint_label")).toContainText(
      "scroll the page",
    );

    const elapsed = await page.evaluate(
      () => performance.now() - (window.__stepStartedAt ?? performance.now()),
    );
    expect(elapsed).toBeGreaterThanOrEqual(renderDelay - 150);
    expect(elapsed).toBeLessThan(labelDelay + 1500);
  });

  test("goes back to the previous step when Previous is clicked", async ({ page }) => {
    await openExample1(page);
    await goToExample1Step(page, EXAMPLE1_PREV_STEP);
    await waitForStepPresentation(page, "Previous");

    await page.locator(".enjoyhint_prev_btn").click();
    await waitForStepPresentation(page, "keyboard events");

    expect(await getExample1Step(page)).toBe(EXAMPLE1_PREV_STEP - 1);
  });

  test("renders custom next, previous, and skip button labels", async ({ page }) => {
    await openExample1(page);
    await goToExample1Step(page, EXAMPLE1_CUSTOM_BUTTONS_STEP);
    await waitForStepPresentation(page, "customized per step");

    await expect(page.locator(".enjoyhint_next_btn")).toHaveText("Continue");
    await expect(page.locator(".enjoyhint_prev_btn")).toHaveText("Back");
    await expect(page.locator(".enjoyhint_skip_btn")).toHaveText("Exit tour");
    await expect(page.locator(".enjoyhint_next_btn")).toHaveClass(/custom-next-demo/);
    await expect(page.locator(".enjoyhint_prev_btn")).toHaveClass(/custom-prev-demo/);
    await expect(page.locator(".enjoyhint_skip_btn")).toHaveClass(/custom-skip-demo/);
  });

  test("applies arrowColor to the spotlight arrow", async ({ page }) => {
    await openExample1(page);
    await goToExample1Step(page, EXAMPLE1_ARROW_COLOR_STEP);
    await waitForStepPresentation(page, "arrow color");

    const arrowStyle = await page
      .locator("#enjoyhint_arrpw_line")
      .getAttribute("style");
    expect(arrowStyle).toContain("#e74c3c");
  });

  test("enlarges rectangular spotlights with margin", async ({ page }) => {
    await openExample1(page);
    await goToExample1Step(page, EXAMPLE1_MARGIN_STEP);
    await waitForStepPresentation(page, "margin");

    const targetBox = await page.locator("#pr_btm").boundingBox();
    const hole = await readBlockerHole(page);

    expect(targetBox).not.toBeNull();
    expect(hole.width).toBeGreaterThan((targetBox?.width ?? 0) + 20);
    expect(hole.height).toBeGreaterThan((targetBox?.height ?? 0) + 20);
  });

  test("auto-advances after timeout and dispatches the configured event", async ({
    page,
  }) => {
    await openExample1(page);
    await goToExample1Step(page, EXAMPLE1_AUTO_STEP);

    await expect(page.locator("#change_checkbox")).not.toBeChecked();
    await expect(page.locator(".enjoy_hint_label")).toHaveCount(0, {
      timeout: 300,
    });

    await expect
      .poll(async () => getExample1Step(page), { timeout: 3000 })
      .toBe(EXAMPLE1_AUTO_STEP + 1);
    await expect(page.locator("#change_checkbox")).toBeChecked();
  });

  test("waits for a custom trigger before advancing", async ({ page }) => {
    await openExample1(page);
    await goToExample1Step(page, EXAMPLE1_CUSTOM_EVENT_STEP);
    await waitForStepPresentation(page, "custom");

    await page.evaluate(() => window.__example1Test.trigger("noop"));
    expect(await getExample1Step(page)).toBe(EXAMPLE1_CUSTOM_EVENT_STEP);

    await page.locator("#def_but").click();
    await waitForStepPresentation(page, "wait before rendering", 2000);
    expect(await getExample1Step(page)).toBe(EXAMPLE1_CUSTOM_EVENT_STEP + 1);
  });

  test("delays step presentation until timeout elapses", async ({ page }) => {
    await openExample1(page);
    await goToExample1Step(page, EXAMPLE1_TIMEOUT_STEP);

    await expect(page.locator(".enjoy_hint_label")).toHaveCount(0, {
      timeout: 350,
    });

    await waitForStepPresentation(page, "wait before rendering", 2000);
    expect(await getExample1Step(page)).toBe(EXAMPLE1_TIMEOUT_STEP);
  });

  test("listens on event_selector instead of the highlighted element", async ({
    page,
  }) => {
    await openExample1(page);
    await goToExample1Step(page, EXAMPLE1_EVENT_SELECTOR_STEP);
    await waitForStepPresentation(page, "event_selector");

    await page.locator("#buttons_ex").click({ force: true });
    expect(await getExample1Step(page)).toBe(EXAMPLE1_EVENT_SELECTOR_STEP);

    await page.locator("#buttons_ex a.btn-success").first().click();
    await waitForStepPresentation(page, "iframes");
    expect(await getExample1Step(page)).toBe(EXAMPLE1_EVENT_SELECTOR_STEP + 1);
  });

  test("aligns iframe spotlight with the embedded target", async ({ page }) => {
    await openExample1(page);
    await page.evaluate(() => window.scrollTo(0, 0));
    await goToExample1Step(page, EXAMPLE1_IFRAME_STEP);
    await waitForStepPresentation(page, "iframes");

    const alignment = await page.evaluate(async () => {
      const iframe = document.querySelector<HTMLIFrameElement>("#iframe-demo");
      const button = iframe?.contentDocument?.querySelector<HTMLElement>("#iframe-demo-button");
      const blockers = Array.from(
        document.querySelectorAll<HTMLElement>(".enjoyhint_disable_events"),
      );
      if (!iframe || !button || blockers.length < 4) {
        return null;
      }

      const buttonRect = button.getBoundingClientRect();
      const iframeRect = iframe.getBoundingClientRect();
      const expectedCenterX = iframeRect.left + buttonRect.left + buttonRect.width / 2;
      const expectedCenterY = iframeRect.top + buttonRect.top + buttonRect.height / 2;
      const hole = {
        top: Number.parseInt(blockers[0]?.style.height ?? "0", 10),
        bottom: Number.parseInt(blockers[1]?.style.top ?? "0", 10),
        left: Number.parseInt(blockers[2]?.style.width ?? "0", 10),
        right: Number.parseInt(blockers[3]?.style.left ?? "0", 10),
      };
      const label = document.querySelector<HTMLElement>(".enjoy_hint_label");

      return {
        deltaX: Math.abs((hole.left + hole.right) / 2 - expectedCenterX),
        deltaY: Math.abs((hole.top + hole.bottom) / 2 - expectedCenterY),
        labelTop: label?.offsetTop ?? -1,
        labelBottom: (label?.offsetTop ?? 0) + (label?.offsetHeight ?? 0),
        viewportHeight: window.innerHeight,
      };
    });

    expect(alignment).not.toBeNull();
    expect(alignment!.deltaX).toBeLessThan(20);
    expect(alignment!.deltaY).toBeLessThan(20);
    expect(alignment!.labelTop).toBeGreaterThanOrEqual(0);
    expect(alignment!.labelBottom).toBeLessThanOrEqual(alignment!.viewportHeight + 1);
  });

  test("allows advancing a click step through Next when showNext is true", async ({
    page,
  }) => {
    await openExample1(page);
    await goToExample1Step(page, EXAMPLE1_SHOW_NEXT_STEP);
    await waitForStepPresentation(page, "showNext");

    await expect(page.locator(".enjoyhint_next_btn")).toBeVisible();
    await clickEnjoyHintNext(page);

    await expect(page.locator(".enjoyhint")).toHaveCount(0, { timeout: 5000 });
    expect(await getExample1Step(page)).toBe(EXAMPLE1_TOTAL_STEPS);
  });
});
