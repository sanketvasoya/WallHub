import { test as base, expect } from "@playwright/test";

export const test = base.extend<{}>({
  page: async ({ page }, use) => {
    const removePortal = async () => {
      await page.evaluate(() => {
        document.querySelectorAll("nextjs-portal").forEach(el => el.remove());
      });
    };

    (page as any).__removePortal = removePortal;
    await use(page);
  },
});

export { expect };

export async function removeNextjsPortal(page: import("@playwright/test").Page) {
  await page.evaluate(() => {
    document.querySelectorAll("nextjs-portal").forEach(el => el.remove());
  });
}
