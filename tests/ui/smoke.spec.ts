import { test, expect } from "@playwright/test";
import { GitHubHomePage } from "../../src/pages/GitHubHomePage";

test.describe("GitHub smoke tests", () => {
  test("should open the GitHub homepage", async ({ page }) => {
    const homePage = new GitHubHomePage(page);

    await homePage.navigate();

    await expect(page).toHaveTitle(/GitHub/i);
  });
});
