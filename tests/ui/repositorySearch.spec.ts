import { test, expect } from "@playwright/test";
import { GitHubHomePage } from "../../src/pages/GitHubHomePage";
import { SearchResultsPage } from "../../src/pages/SearchResultsPage";

test.describe("GitHub repository search", () => {
  test("should find and open a public repository", async ({ page }) => {
    const owner = "microsoft";
    const repository = "playwright";
    const searchText = `${owner}/${repository}`;

    const homePage = new GitHubHomePage(page);
    const searchResultsPage = new SearchResultsPage(page);

    await homePage.navigate();
    await homePage.searchFor(searchText);

    const result = searchResultsPage.repositoryLink(owner, repository);

    await expect(result).toBeVisible();

    await searchResultsPage.openRepository(owner, repository);

    await expect(page).toHaveURL(new RegExp(`/${owner}/${repository}/?$`, "i"));
  });
});

test("should not display a nonexistent repository", async ({ page }) => {
  const owner = "nonexistent-aiqe-owner";
  const repository = `missing-repository-${Date.now()}`;
  const searchText = `${owner}/${repository}`;

  const homePage = new GitHubHomePage(page);
  const searchResultsPage = new SearchResultsPage(page);

  await homePage.navigate();
  await homePage.searchFor(searchText);

  await expect(searchResultsPage.repositoryLink(owner, repository)).toHaveCount(
    0,
  );
});
