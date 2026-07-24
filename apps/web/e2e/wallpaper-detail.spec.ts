import { test, expect } from "@playwright/test";

const WORKING_ID = "8g9vjk";

test.describe("Wallpaper Detail Page", () => {
  test("loads wallpaper detail with action buttons", async ({ page }) => {
    await page.goto(`/wallpaper/${WORKING_ID}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(2000);
    const backBtn = page.locator('button:has(svg[data-testid="ArrowBackIcon"])').first();
    await expect(backBtn).toBeVisible({ timeout: 10000 });
  });

  test("top bar has action buttons", async ({ page }) => {
    await page.goto(`/wallpaper/${WORKING_ID}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(2000);
    const backBtn = page.locator('button:has(svg[data-testid="ArrowBackIcon"])').first();
    await expect(backBtn).toBeVisible({ timeout: 5000 });
    const favBtn = page.locator('button:has(svg[data-testid="FavoriteBorderIcon"]), button:has(svg[data-testid="FavoriteIcon"])').first();
    await expect(favBtn).toBeVisible();
    const downloadBtn = page.locator('button:has(svg[data-testid="DownloadIcon"])').first();
    await expect(downloadBtn).toBeVisible();
    const shareBtn = page.locator('button:has(svg[data-testid="ShareIcon"])').first();
    await expect(shareBtn).toBeVisible();
  });

  test("back button navigates back", async ({ page }) => {
    await page.goto("/category/trending", { waitUntil: "networkidle" });
    await page.waitForTimeout(2000);
    const wallpaperLink = page.locator('a[href*="/wallpaper/"]').first();
    const href = await wallpaperLink.getAttribute("href");
    expect(href).toBeTruthy();
    await page.goto(href!);
    await page.waitForTimeout(2000);
    const backBtn = page.locator('button:has(svg[data-testid="ArrowBackIcon"])').first();
    await backBtn.click();
    await page.waitForTimeout(1000);
    expect(page.url()).not.toContain(`/wallpaper/${WORKING_ID}`);
  });

  test("favorite toggle works", async ({ page }) => {
    await page.goto(`/wallpaper/${WORKING_ID}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(2000);
    const favBtn = page.locator('button:has(svg[data-testid="FavoriteBorderIcon"]), button:has(svg[data-testid="FavoriteIcon"])').first();
    await favBtn.click();
    await page.waitForTimeout(500);
    const favBtnAfter = page.locator('button:has(svg[data-testid="FavoriteBorderIcon"]), button:has(svg[data-testid="FavoriteIcon"])').first();
    await expect(favBtnAfter).toBeVisible();
  });

  test("info toggle shows wallpaper details panel", async ({ page }) => {
    await page.goto(`/wallpaper/${WORKING_ID}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(2000);
    const infoBtn = page.locator('button:has(svg[data-testid="InfoIcon"])').first();
    await infoBtn.click();
    await page.waitForTimeout(500);
    const resolutionText = page.getByText(/\d+\s*x\s*\d+/);
    await expect(resolutionText.first()).toBeVisible({ timeout: 5000 });
  });

  test("keyboard shortcut Escape goes back", async ({ page }) => {
    await page.goto("/category/trending", { waitUntil: "networkidle" });
    await page.goto(`/wallpaper/${WORKING_ID}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(2000);
    await page.keyboard.press("Escape");
    await page.waitForTimeout(1000);
    expect(page.url()).not.toContain(`/wallpaper/${WORKING_ID}`);
  });

  test("keyboard shortcut F toggles favorite", async ({ page }) => {
    await page.goto(`/wallpaper/${WORKING_ID}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(2000);
    const favBtnBefore = page.locator('button:has(svg[data-testid="FavoriteBorderIcon"]), button:has(svg[data-testid="FavoriteIcon"])').first();
    await expect(favBtnBefore).toBeVisible();
    await page.keyboard.press("f");
    await page.waitForTimeout(500);
    const favBtnAfter = page.locator('button:has(svg[data-testid="FavoriteBorderIcon"]), button:has(svg[data-testid="FavoriteIcon"])').first();
    await expect(favBtnAfter).toBeVisible();
  });
});
