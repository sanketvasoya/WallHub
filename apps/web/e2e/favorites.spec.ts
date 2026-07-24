import { test, expect, removeNextjsPortal } from "./fixtures";

test.describe("Favorites Page", () => {
  test("loads favorites page", async ({ page }) => {
    await page.goto("/favorites", { waitUntil: "networkidle" });
    const bodyText = await page.locator("body").innerText();
    expect(bodyText.toLowerCase()).toContain("favorit");
  });

  test("shows empty state when no favorites", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await page.evaluate(() => localStorage.clear());
    await page.goto("/favorites", { waitUntil: "networkidle" });
    await page.waitForTimeout(2000);
    const exploreBtn = page.getByRole("button", { name: "Explore Wallpapers" });
    await expect(exploreBtn).toBeVisible({ timeout: 10000 });
  });

  test("explore button navigates to home", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await page.evaluate(() => localStorage.clear());
    await page.goto("/favorites", { waitUntil: "networkidle" });
    await page.waitForTimeout(2000);
    const exploreBtn = page.getByRole("button", { name: "Explore Wallpapers" });
    await exploreBtn.click();
    await page.waitForURL("**/", { timeout: 10000 });
  });

  test("favorites page accessible via bottom nav", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await removeNextjsPortal(page);
    await page.getByRole("button", { name: "Favorites" }).click({ force: true });
    await page.waitForURL("**/favorites", { timeout: 10000 });
    const bodyText = await page.locator("body").innerText();
    expect(bodyText.toLowerCase()).toContain("favorit");
  });
});
