import { test, expect } from "@playwright/test";
import { environment } from "../../config/env";
import { RepositoryPage } from "../../src/pages/RepositoryPage";
import { GitHubApiService } from "../../src/services/GitHubApiService";

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
    const repositoryName = `aiqe-integrated-${Date.now()}`;

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
        "Temporary repository created by an integrated test",
      );

      const createBody = await createResponse.json();

      expect(createResponse.status(), JSON.stringify(createBody)).toBe(201);

      repositoryCreated = true;

      expect(createBody.name).toBe(repositoryName);
      expect(createBody.owner.login).toBe(owner);
      expect(createBody.private).toBe(true);

      await repositoryPage.navigateTo(owner, repositoryName);

      await expect(page).toHaveURL(
        new RegExp(`/${owner}/${repositoryName}/?$`, "i"),
      );

      await expect(repositoryPage.ownerLink(owner)).toBeVisible();

      await expect(
        repositoryPage.repositoryLink(owner, repositoryName),
      ).toBeVisible();

      await expect(repositoryPage.privateBadge()).toBeVisible();
    } finally {
      if (repositoryCreated) {
        const deleteResponse = await githubApi.deleteRepository(
          owner,
          repositoryName,
        );

        expect(deleteResponse.status()).toBe(204);
      }

      await apiRequest.dispose();
    }
  });
});
