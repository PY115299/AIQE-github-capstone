import { test, expect } from "@playwright/test";
import { environment } from "../../config/env";
import { RepositoryPage } from "../../src/pages/RepositoryPage";
import { GitHubApiService } from "../../src/services/GitHubApiService";
import { TestDataUtil } from "../../src/utils/TestDataUtil";
import apiData from "../../testdata/apiData.json";
import uiData from "../../testdata/uiData.json";

test.describe("GitHub integrated repository flow", () => {
  test("should create by API, validate in UI, and delete by API", async ({
    page,
    playwright,
  }) => {
    test.skip(
      !environment.githubToken,
      "GITHUB_TOKEN is required for this test.",
    );

    test.skip(
      !environment.githubExpectedLogin,
      "GITHUB_EXPECTED_LOGIN is required for this test.",
    );

    const owner = environment.githubExpectedLogin!;

    const integratedData = apiData.integratedRepository;

    const repositoryName = TestDataUtil.generateRepositoryName(
      integratedData.namePrefix,
    );

    const apiRequest = await playwright.request.newContext({
      baseURL: environment.githubApiBaseUrl,

      extraHTTPHeaders: {
        Accept: "application/vnd.github+json",

        "X-GitHub-Api-Version": "2022-11-28",

        Authorization: `Bearer ${environment.githubToken}`,
      },
    });

    const githubApi = new GitHubApiService(
      apiRequest,
      environment.githubApiBaseUrl,
    );

    const repositoryPage = new RepositoryPage(page);

    let repositoryCreated = false;

    try {
      const createResponse = await githubApi.createRepository(
        repositoryName,
        integratedData.description,
      );

      const createBody = await createResponse.json();

      expect(createResponse.status(), JSON.stringify(createBody)).toBe(
        integratedData.createStatus,
      );

      repositoryCreated = true;

      expect(createBody.name).toBe(repositoryName);

      expect(createBody.owner.login).toBe(owner);

      expect(createBody.private).toBe(integratedData.isPrivate);

      await repositoryPage.navigateTo(owner, repositoryName);

      await expect(page).toHaveURL(
        new RegExp(`/${owner}/${repositoryName}/?$`, "i"),
      );

      await expect(repositoryPage.ownerLink(owner)).toBeVisible({
        timeout: uiData.timeouts.newRepositoryVisibilityMs,
      });

      await expect(
        repositoryPage.repositoryLink(owner, repositoryName),
      ).toBeVisible({
        timeout: uiData.timeouts.newRepositoryVisibilityMs,
      });

      await expect(repositoryPage.privateBadge()).toBeVisible({
        timeout: uiData.timeouts.newRepositoryVisibilityMs,
      });
    } finally {
      if (repositoryCreated) {
        const deleteResponse = await githubApi.deleteRepository(
          owner,
          repositoryName,
        );

        expect(deleteResponse.status()).toBe(integratedData.deleteStatus);
      }

      await apiRequest.dispose();
    }
  });
});
