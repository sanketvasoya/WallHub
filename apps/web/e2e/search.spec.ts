import { test, expect } from "@playwright/test";

test.describe("Search Page", () => {
  test("loads with search input and trending chips", async ({ page }) => {
    await page.goto("/search", { waitUntil: "networkidle" });
    const searchInput = page.getByPlaceholder("Search wallpapers...");
    await expect(searchInput).toBeVisible({ timeout: 15000 });
    await expect(page.getByText("Trending")).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole("button", { name: "mountains" })).toBeVisible();
  });

  test("search input accepts text", async ({ page }) => {
    await page.goto("/search", { waitUntil: "networkidle" });
    const searchInput = page.getByPlaceholder("Search wallpapers...");
    await searchInput.fill("nature");
    await expect(searchInput).toHaveValue("nature");
  });

  test("clicking trending chip executes search", async ({ page }) => {
    await page.goto("/search", { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "mountains" }).click();
    await page.waitForTimeout(5000);
    expect(page.url()).toContain("q=mountains");
    const wallpaperLinks = page.locator('a[href*="/wallpaper/"]');
    expect(await wallpaperLinks.count()).toBeGreaterThanOrEqual(1);
  });

  test("submitting search form shows results", async ({ page }) => {
    await page.goto("/search", { waitUntil: "networkidle" });
    const searchInput = page.getByPlaceholder("Search wallpapers...");
    await searchInput.fill("space");
    await searchInput.press("Enter");
    await page.waitForTimeout(5000);
    expect(page.url()).toContain("q=space");
    const wallpaperLinks = page.locator('a[href*="/wallpaper/"]');
    expect(await wallpaperLinks.count()).toBeGreaterThanOrEqual(1);
  });

  test("search results link to wallpaper detail", async ({ page }) => {
    await page.goto("/search?q=nature", { waitUntil: "networkidle" });
    await page.waitForTimeout(5000);
    const wallpaperLink = page.locator('a[href*="/wallpaper/"]').first();
    if (await wallpaperLink.isVisible()) {
      const href = await wallpaperLink.getAttribute("href");
      expect(href).toBeTruthy();
      await page.goto(href!);
      await page.waitForTimeout(3000);
      expect(page.url()).toContain("/wallpaper/");
    }
  });
});
