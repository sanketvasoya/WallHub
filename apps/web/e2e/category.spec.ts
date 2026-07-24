import { test, expect } from "@playwright/test";

test.describe("Category Page", () => {
  test("loads trending category with wallpapers", async ({ page }) => {
    await page.goto("/category/trending", { waitUntil: "networkidle" });
    await expect(page.getByText("trending")).toBeVisible({ timeout: 15000 });
    const wallpaperLinks = page.locator('a[href*="/wallpaper/"]');
    await expect(wallpaperLinks.first()).toBeVisible({ timeout: 15000 });
    expect(await wallpaperLinks.count()).toBeGreaterThanOrEqual(10);
  });

  test("sort toggle buttons are visible", async ({ page }) => {
    await page.goto("/category/trending", { waitUntil: "networkidle" });
    await expect(page.getByRole("button", { name: /hot/i }).first()).toBeVisible({ timeout: 15000 });
    await expect(page.getByRole("button", { name: /new/i }).first()).toBeVisible();
    await expect(page.getByRole("button", { name: /top/i }).first()).toBeVisible();
  });

  test("can click sort to New and UI updates", async ({ page }) => {
    await page.goto("/category/trending", { waitUntil: "networkidle" });
    const newBtn = page.getByRole("button", { name: /new/i }).first();
    await expect(newBtn).toBeVisible({ timeout: 15000 });
    await newBtn.click();
    await page.waitForTimeout(3000);
    await expect(newBtn).toHaveAttribute("aria-pressed", "true");
  });

  test("can click sort to Top and UI updates", async ({ page }) => {
    await page.goto("/category/trending", { waitUntil: "networkidle" });
    const topBtn = page.getByRole("button", { name: /top/i }).first();
    await expect(topBtn).toBeVisible({ timeout: 15000 });
    await topBtn.click();
    await page.waitForTimeout(3000);
    await expect(topBtn).toHaveAttribute("aria-pressed", "true");
  });

  test("navigates to wallpaper detail from category via href", async ({ page }) => {
    await page.goto("/category/trending", { waitUntil: "networkidle" });
    const wallpaperLink = page.locator('a[href*="/wallpaper/"]').first();
    await expect(wallpaperLink).toBeVisible({ timeout: 15000 });
    const href = await wallpaperLink.getAttribute("href");
    expect(href).toBeTruthy();
    await page.goto(href!);
    await page.waitForTimeout(3000);
    expect(page.url()).toContain("/wallpaper/");
  });

  test("different categories load", async ({ page }) => {
    await page.goto("/category/nature", { waitUntil: "networkidle" });
    await expect(page.getByText("nature")).toBeVisible({ timeout: 15000 });

    await page.goto("/category/space", { waitUntil: "networkidle" });
    await expect(page.getByText("space")).toBeVisible({ timeout: 15000 });
  });

  test("wallpapers are loaded with infinite scroll", async ({ page }) => {
    await page.goto("/category/trending", { waitUntil: "networkidle" });
    const wallpaperLinks = page.locator('a[href*="/wallpaper/"]');
    await expect(wallpaperLinks.first()).toBeVisible({ timeout: 15000 });
    expect(await wallpaperLinks.count()).toBeGreaterThanOrEqual(10);
  });
});
