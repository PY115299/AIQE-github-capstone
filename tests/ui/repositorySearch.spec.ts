import { test, expect } from "@playwright/test";
import { GitHubHomePage } from "../../src/pages/GitHubHomePage";
import { SearchResultsPage } from "../../src/pages/SearchResultsPage";
import { TestDataUtil } from "../../src/utils/TestDataUtil";
import uiData from "../../testdata/uiData.json";

test.describe("GitHub repository search", () => {
  test("should find and open a public repository", async ({ page }) => {
    const {
      owner,
      name: repository,
      fullName: searchText,
    } = uiData.publicRepository;

    const homePage = new GitHubHomePage(page);
    const searchResultsPage = new SearchResultsPage(page);

    await homePage.navigate();
    await homePage.searchFor(searchText);

    const result = searchResultsPage.repositoryLink(owner, repository);

    await expect(result).toBeVisible();

    await searchResultsPage.openRepository(owner, repository);

    await expect(page).toHaveURL(new RegExp(`/${owner}/${repository}/?$`, "i"));
  });

  test("should not display a nonexistent repository", async ({ page }) => {
    const owner = TestDataUtil.generateNonexistentOwner(
      uiData.negativeRepositorySearch.ownerPrefix,
    );

    const repository = TestDataUtil.generateRepositoryName(
      uiData.negativeRepositorySearch.repositoryPrefix,
    );

    const searchText = `${owner}/${repository}`;

    const homePage = new GitHubHomePage(page);
    const searchResultsPage = new SearchResultsPage(page);

    await homePage.navigate();
    await homePage.searchFor(searchText);

    await expect(
      searchResultsPage.repositoryLink(owner, repository),
    ).toHaveCount(0);
  });
});
