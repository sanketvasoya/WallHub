import { test, expect, removeNextjsPortal } from "./fixtures";

test.describe("Navigation - Bottom Nav", () => {
  test("bottom nav has all 5 tabs", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await expect(page.getByRole("button", { name: "Home" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Explore" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Search" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Favorites" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Settings" })).toBeVisible();
  });

  test("Explore tab navigates to category", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await removeNextjsPortal(page);
    await page.getByRole("button", { name: "Explore" }).click({ force: true });
    await page.waitForURL("**/category/**", { timeout: 10000 });
    expect(page.url()).toContain("/category/");
  });

  test("Search tab navigates to search", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await removeNextjsPortal(page);
    await page.getByRole("button", { name: "Search" }).click({ force: true });
    await page.waitForURL("**/search", { timeout: 10000 });
    expect(page.url()).toContain("/search");
  });

  test("Favorites tab navigates to favorites", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await removeNextjsPortal(page);
    await page.getByRole("button", { name: "Favorites" }).click({ force: true });
    await page.waitForURL("**/favorites", { timeout: 10000 });
    expect(page.url()).toContain("/favorites");
  });

  test("Settings tab navigates to settings", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await removeNextjsPortal(page);
    await page.getByRole("button", { name: "Settings" }).click({ force: true });
    await page.waitForURL("**/settings", { timeout: 10000 });
    expect(page.url()).toContain("/settings");
  });

  test("Home tab navigates back to home", async ({ page }) => {
    await page.goto("/settings", { waitUntil: "networkidle" });
    await removeNextjsPortal(page);
    await page.getByRole("button", { name: "Home" }).click({ force: true });
    await page.waitForTimeout(2000);
    await expect(page.getByText("Discover Wallpapers")).toBeVisible({ timeout: 10000 });
    expect(page.url()).toMatch(/localhost:\d+\/?$/);
  });
});

test.describe("Navigation - Header Drawer", () => {
  test("hamburger button opens drawer with nav items", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    const menuButton = page.locator("header button").first();
    await menuButton.click();
    await page.waitForTimeout(500);

    const drawer = page.locator(".MuiDrawer-paper");
    await expect(drawer).toBeVisible();

    await expect(drawer.getByText("Home")).toBeVisible();
    await expect(drawer.getByText("Categories")).toBeVisible();
    await expect(drawer.getByText("Search")).toBeVisible();
    await expect(drawer.getByText("Favorites")).toBeVisible();
    await expect(drawer.getByText("Settings")).toBeVisible();
  });

  test("drawer Categories item navigates to category", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await page.locator("header button").first().click();
    await page.waitForTimeout(500);
    await page.locator(".MuiDrawer-paper").getByText("Categories").click();
    await page.waitForURL("**/category/**", { timeout: 10000 });
    expect(page.url()).toContain("/category/");
  });

  test("drawer Search item navigates to search", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await page.locator("header button").first().click();
    await page.waitForTimeout(500);
    await page.locator(".MuiDrawer-paper").getByText("Search").click();
    await page.waitForURL("**/search", { timeout: 10000 });
    expect(page.url()).toContain("/search");
  });

  test("drawer Favorites item navigates to favorites", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await page.locator("header button").first().click();
    await page.waitForTimeout(500);
    await page.locator(".MuiDrawer-paper").getByText("Favorites").click();
    await page.waitForURL("**/favorites", { timeout: 10000 });
    expect(page.url()).toContain("/favorites");
  });

  test("drawer Settings item navigates to settings", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await page.locator("header button").first().click();
    await page.waitForTimeout(500);
    await page.locator(".MuiDrawer-paper").getByText("Settings").click();
    await page.waitForURL("**/settings", { timeout: 10000 });
    expect(page.url()).toContain("/settings");
  });

  test("drawer theme options are visible", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await page.locator("header button").first().click();
    await page.waitForTimeout(500);
    const drawer = page.locator(".MuiDrawer-paper");
    await expect(drawer.getByText("Dark")).toBeVisible();
    await expect(drawer.getByText("Light")).toBeVisible();
    await expect(drawer.getByText("System")).toBeVisible();
  });
});
