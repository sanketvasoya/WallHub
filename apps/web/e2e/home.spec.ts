import { test, expect } from "@playwright/test";

test.describe("Home Page", () => {
  test("loads and displays hero section", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await expect(page).toHaveTitle(/WallHub/);
    await expect(page.getByText("Discover Wallpapers")).toBeVisible({ timeout: 15000 });
  });

  test("displays quick category cards", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    const categoryLinks = page.locator('a[href*="/category/"]');
    await expect(categoryLinks.first()).toBeVisible({ timeout: 15000 });
    expect(await categoryLinks.count()).toBeGreaterThanOrEqual(6);
  });

  test("displays trending wallpaper grid", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    const wallpaperLinks = page.locator('a[href*="/wallpaper/"]');
    await expect(wallpaperLinks.first()).toBeVisible({ timeout: 15000 });
    expect(await wallpaperLinks.count()).toBeGreaterThanOrEqual(10);
  });

  test("navigates to category via link href", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    const link = page.locator('a[href*="/category/"]').first();
    await expect(link).toBeVisible({ timeout: 15000 });
    const href = await link.getAttribute("href");
    expect(href).toBeTruthy();
    await page.goto(href!);
    await expect(page.getByText(/trending|nature|space|amoled|anime|minimal|cyberpunk/i)).toBeVisible({ timeout: 15000 });
    expect(page.url()).toContain("/category/");
  });

  test("navigates to wallpaper detail via link href", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    const link = page.locator('a[href*="/wallpaper/"]').first();
    await expect(link).toBeVisible({ timeout: 15000 });
    const href = await link.getAttribute("href");
    expect(href).toBeTruthy();
    await page.goto(href!);
    await page.waitForTimeout(3000);
    expect(page.url()).toContain("/wallpaper/");
  });

  test("See All button navigates to trending", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    const seeAll = page.getByRole("button", { name: /see all/i });
    await expect(seeAll).toBeVisible({ timeout: 15000 });
    await seeAll.click();
    await page.waitForURL("**/category/trending**", { timeout: 10000 });
    expect(page.url()).toContain("/category/trending");
  });
});
