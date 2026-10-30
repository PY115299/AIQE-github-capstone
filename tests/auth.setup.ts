import { test as setup, expect } from "@playwright/test";
import path from "path";

const authFile = path.join(process.cwd(), "playwright/.auth/github-user.json");

setup("authenticate with GitHub", async ({ page }) => {
  setup.setTimeout(150_000);

  await page.goto("/login", {
    waitUntil: "domcontentloaded",
  });

  console.log("Complete GitHub login manually in the opened browser.");

  await page.waitForURL((url) => !url.pathname.startsWith("/login"), {
    timeout: 120_000,
    waitUntil: "domcontentloaded",
  });

  await expect(page).not.toHaveURL(/\/login/);

  await page.context().storageState({
    path: authFile,
  });
});
