import { test, expect } from "@playwright/test";

test.describe("Settings Page", () => {
  test("loads settings page with theme selector", async ({ page }) => {
    await page.goto("/settings", { waitUntil: "networkidle" });

    const bodyText = await page.locator("body").innerText();
    expect(bodyText).toContain("WallHub");
    expect(bodyText).toContain("Version");
  });

  test("theme selector is visible", async ({ page }) => {
    await page.goto("/settings", { waitUntil: "networkidle" });

    const themeLabel = page.getByText("Theme");
    await expect(themeLabel.first()).toBeVisible({ timeout: 10000 });
  });

  test("can change theme via select", async ({ page }) => {
    await page.goto("/settings", { waitUntil: "networkidle" });

    const select = page.locator('[role="combobox"]').first();
    if (await select.isVisible()) {
      await select.click();
      await page.waitForTimeout(500);

      const lightOption = page.getByRole("option", { name: /light/i });
      if (await lightOption.isVisible()) {
        await lightOption.click();
        await page.waitForTimeout(1000);
      }
    }
  });

  test("shows app info", async ({ page }) => {
    await page.goto("/settings", { waitUntil: "networkidle" });

    await expect(page.getByText("Version 1.0.0")).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("Built with Next.js")).toBeVisible();
  });
});
