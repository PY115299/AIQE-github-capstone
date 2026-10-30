import { test, expect } from "@playwright/test";
import { RepositoryPage } from "../../src/pages/RepositoryPage";

test.describe("GitHub repository details", () => {
  test("should display details of a public repository", async ({ page }) => {
    const owner = "microsoft";
    const repository = "playwright";

    const repositoryPage = new RepositoryPage(page);

    await repositoryPage.navigateTo(owner, repository);

    await expect(repositoryPage.ownerLink(owner)).toBeVisible();

    await expect(
      repositoryPage.repositoryLink(owner, repository),
    ).toBeVisible();

    await expect(page).toHaveTitle(new RegExp(`${owner}\\/${repository}`, "i"));

    await expect(page).toHaveURL(new RegExp(`/${owner}/${repository}/?$`, "i"));
  });
});
