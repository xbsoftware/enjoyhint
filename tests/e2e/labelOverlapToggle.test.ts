import { expect, test } from "@playwright/test";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "../..");

test.describe("label overlap toggle e2e", () => {
  test("shows the toggle button, hides the label, and keeps the target clickable", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 480 });
    const url = pathToFileURL(
      join(rootDir, "tests/e2e/fixtures/label-overlap-toggle.html"),
    ).href;
    await page.goto(url);
    await page.evaluate(() => window.__fixtureTest.run());

    const label = page.locator(".enjoy_hint_label");
    await expect(label).toBeVisible({ timeout: 5000 });

    const toggleButton = page.locator(".enjoyhint_label_toggle_btn");
    await expect(toggleButton).toBeVisible();
    await expect(toggleButton).not.toHaveClass(/enjoyhint_hide/);

    // Toggle must clear the black-background label itself, not sit on top of it.
    const boxes = await page.evaluate(() => {
      const labelEl = document.querySelector(".enjoy_hint_label")!;
      const toggleEl = document.querySelector(".enjoyhint_label_toggle_btn")!;
      const l = labelEl.getBoundingClientRect();
      const t = toggleEl.getBoundingClientRect();
      return {
        overlapsLabel:
          t.left < l.right && t.right > l.left && t.top < l.bottom && t.bottom > l.top,
      };
    });
    expect(boxes.overlapsLabel).toBe(false);

    await toggleButton.click();
    // Mid-animation the label should be sliding left (not already snapped off-screen
    // with no motion). Sample shortly after click while the 400ms transition runs.
    const mid = await page.evaluate(() => {
      const label = document.querySelector<HTMLElement>(".enjoy_hint_label")!;
      const matrix = getComputedStyle(label).transform;
      // matrix(1, 0, 0, 1, tx, ty) — tx should be negative while sliding.
      const match = /matrix\([^,]+,[^,]+,[^,]+,[^,]+,\s*([^,]+)/.exec(matrix);
      const tx = match ? Number.parseFloat(match[1]!) : 0;
      return { matrix, tx, opacity: Number.parseFloat(getComputedStyle(label).opacity) };
    });
    expect(mid.tx).toBeLessThan(0);

    await expect(label).toHaveCSS("opacity", "0");

    await page.locator("#target").click({ force: true });
    const currentStep = await page.evaluate(() =>
      window.__fixtureHint.getCurrentStep(),
    );
    expect(currentStep).toBe(1);
  });

  test("does not paint the eye button on arrow / transparent-background labels", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    const url = pathToFileURL(join(rootDir, "examples/example1.html")).href;
    await page.goto(url);
    await page.waitForSelector(".enjoy_hint_label", { timeout: 10000 });
    await page.waitForTimeout(600);

    const info = await page.evaluate(() => {
      const label = document.querySelector<HTMLElement>(".enjoy_hint_label")!;
      const toggle = document.querySelector<HTMLElement>(".enjoyhint_label_toggle_btn")!;
      return {
        labelBg: getComputedStyle(label).backgroundColor,
        hasArrow: !!document.querySelector("#enjoyhint_arrpw_line"),
        toggleDisplay: getComputedStyle(toggle).display,
        toggleHideClass: toggle.classList.contains("enjoyhint_hide"),
      };
    });

    expect(info.hasArrow).toBe(true);
    expect(info.labelBg).toBe("rgba(0, 0, 0, 0)");
    expect(info.toggleHideClass).toBe(true);
    // Root cause of the regression: `.enjoyhint_label_toggle_btn { display: flex }`
    // was overriding `.enjoyhint_hide { display: none }`, leaving the eye painted.
    expect(info.toggleDisplay).toBe("none");
  });
});

declare global {
  interface Window {
    __fixtureTest: { run: () => void };
    __fixtureHint: { getCurrentStep: () => number };
  }
}
