import { test, expect } from "@playwright/test";
import { RepositoryPage } from "../../src/pages/RepositoryPage";
import uiData from "../../testdata/uiData.json";

test.describe("GitHub repository details", () => {
  test("should display details of a public repository", async ({ page }) => {
    const {
      owner,
      name: repository,
      expectedTitlePattern,
    } = uiData.publicRepository;

    const repositoryPage = new RepositoryPage(page);

    await repositoryPage.navigateTo(owner, repository);

    await expect(repositoryPage.ownerLink(owner)).toBeVisible();

    await expect(
      repositoryPage.repositoryLink(owner, repository),
    ).toBeVisible();

    await expect(page).toHaveTitle(new RegExp(expectedTitlePattern, "i"));

    await expect(page).toHaveURL(new RegExp(`/${owner}/${repository}/?$`, "i"));
  });
});
