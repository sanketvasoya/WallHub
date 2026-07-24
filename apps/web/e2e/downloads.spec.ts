import { test, expect } from "@playwright/test";

const WORKING_ID = "8g9vjk";

test.describe("Downloads", () => {
  test("wallpaper cards have action buttons", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await page.waitForTimeout(3000);
    const firstCard = page.locator('a[href*="/wallpaper/"]').first();
    await expect(firstCard).toBeVisible({ timeout: 15000 });
    const favBtn = firstCard.locator('button:has(svg[data-testid="FavoriteBorderIcon"]), button:has(svg[data-testid="FavoriteIcon"])').first();
    await expect(favBtn).toBeVisible();
  });

  test("wallpaper detail page has download button", async ({ page }) => {
    await page.goto(`/wallpaper/${WORKING_ID}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(2000);
    const downloadBtn = page.locator('button:has(svg[data-testid="DownloadIcon"])').first();
    await expect(downloadBtn).toBeVisible({ timeout: 5000 });
  });

  test("info panel has download chip", async ({ page }) => {
    await page.goto(`/wallpaper/${WORKING_ID}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(2000);
    const infoBtn = page.locator('button:has(svg[data-testid="InfoIcon"])').first();
    await infoBtn.click();
    await page.waitForTimeout(500);
    const downloadChip = page.getByText("Download");
    await expect(downloadChip.first()).toBeVisible({ timeout: 5000 });
  });

  test("info panel has open original chip", async ({ page }) => {
    await page.goto(`/wallpaper/${WORKING_ID}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(2000);
    const infoBtn = page.locator('button:has(svg[data-testid="InfoIcon"])').first();
    await infoBtn.click();
    await page.waitForTimeout(500);
    const openOriginalChip = page.getByText("Open Original");
    await expect(openOriginalChip.first()).toBeVisible({ timeout: 5000 });
  });
});
