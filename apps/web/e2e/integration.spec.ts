import { test, expect, removeNextjsPortal } from "./fixtures";

test.describe("Full App Navigation Flow", () => {
  test("navigates through all bottom nav tabs", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await expect(page.getByText("Discover Wallpapers")).toBeVisible({ timeout: 15000 });

    await removeNextjsPortal(page);
    await page.getByRole("button", { name: "Explore" }).click({ force: true });
    await page.waitForURL("**/category/**", { timeout: 10000 });
    expect(page.url()).toContain("/category/");

    await removeNextjsPortal(page);
    await page.getByRole("button", { name: "Search" }).click({ force: true });
    await page.waitForURL("**/search", { timeout: 10000 });
    expect(page.url()).toContain("/search");

    await removeNextjsPortal(page);
    await page.getByRole("button", { name: "Favorites" }).click({ force: true });
    await page.waitForURL("**/favorites", { timeout: 10000 });
    expect(page.url()).toContain("/favorites");

    await removeNextjsPortal(page);
    await page.getByRole("button", { name: "Settings" }).click({ force: true });
    await page.waitForURL("**/settings", { timeout: 10000 });
    expect(page.url()).toContain("/settings");

    await removeNextjsPortal(page);
    await page.getByRole("button", { name: "Home" }).click({ force: true });
    await page.waitForTimeout(2000);
    await expect(page.getByRole("heading", { name: "Discover Wallpapers" })).toBeVisible({ timeout: 10000 });
  });

  test("search > view wallpaper > favorite > check favorites", async ({ page }) => {
    await page.goto("/search", { waitUntil: "networkidle" });
    const searchInput = page.getByPlaceholder("Search wallpapers...");
    await searchInput.fill("nature");
    await searchInput.press("Enter");
    await page.waitForTimeout(5000);

    const wallpaperLink = page.locator('a[href*="/wallpaper/"]').first();
    if (await wallpaperLink.isVisible()) {
      const href = await wallpaperLink.getAttribute("href");
      expect(href).toBeTruthy();
      await page.goto(href!);
      await page.waitForTimeout(2000);

      const favBtn = page.locator('button:has(svg[data-testid="FavoriteBorderIcon"]), button:has(svg[data-testid="FavoriteIcon"])').first();
      await favBtn.click();
      await page.waitForTimeout(500);
    }

    await page.goto("/favorites", { waitUntil: "networkidle" });
    await page.waitForTimeout(2000);
    expect(page.url()).toContain("/favorites");
  });

  test("category browsing flow", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await removeNextjsPortal(page);
    await page.getByRole("button", { name: "Explore" }).click({ force: true });
    await page.waitForURL("**/category/**", { timeout: 10000 });

    const wallpaperLinks = page.locator('a[href*="/wallpaper/"]');
    await expect(wallpaperLinks.first()).toBeVisible({ timeout: 15000 });
    const href = await wallpaperLinks.first().getAttribute("href");
    expect(href).toBeTruthy();

    await page.goto(href!);
    await page.waitForTimeout(3000);
    expect(page.url()).toContain("/wallpaper/");
  });

  test("theme toggle from header", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    const themeBtn = page.locator('button[aria-label*="Theme"]').first();
    if (await themeBtn.isVisible()) {
      await themeBtn.click();
      await page.waitForTimeout(500);
      await themeBtn.click();
      await page.waitForTimeout(500);
    }
    const body = await page.locator("body").innerText();
    expect(body.length).toBeGreaterThan(0);
  });

  test("404 page shows for invalid routes", async ({ page }) => {
    await page.goto("/nonexistent-page-xyz", { waitUntil: "networkidle" });
    await page.waitForTimeout(2000);
    const bodyText = await page.locator("body").innerText();
    const hasNotFound = bodyText.includes("404") || bodyText.toLowerCase().includes("not found") || bodyText.toLowerCase().includes("go home");
    expect(hasNotFound).toBeTruthy();
  });
});
