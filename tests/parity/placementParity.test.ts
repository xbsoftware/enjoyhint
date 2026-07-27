import { test } from "@playwright/test";
import {
  PLACEMENT_SCENARIOS,
  PLACEMENT_VIEWPORTS,
  collectPlacementSnapshot,
  expectPlacementParity,
  openPlacementFixture,
  startPlacementTour,
} from "./parity.helpers";

test.describe("legacy/new placement parity", () => {
  for (const viewport of PLACEMENT_VIEWPORTS) {
    for (const scenario of PLACEMENT_SCENARIOS) {
      test(`${scenario} at ${viewport.name} (${viewport.width}x${viewport.height})`, async ({
        browser,
      }) => {
        const legacyPage = await browser.newPage({
          viewport: { width: viewport.width, height: viewport.height },
        });
        const newPage = await browser.newPage({
          viewport: { width: viewport.width, height: viewport.height },
        });

        try {
          await openPlacementFixture(legacyPage, "legacy", scenario);
          await openPlacementFixture(newPage, "new", scenario);

          const startStep = scenario === "with-prev" ? 1 : 0;
          await startPlacementTour(legacyPage, startStep);
          await startPlacementTour(newPage, startStep);

          const legacySnapshot = await collectPlacementSnapshot(legacyPage);
          const newSnapshot = await collectPlacementSnapshot(newPage);
          expectPlacementParity(legacySnapshot, newSnapshot, viewport);
        } finally {
          await legacyPage.close();
          await newPage.close();
        }
      });
    }
  }
});
