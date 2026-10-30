import { test, expect } from "@playwright/test";
import { environment } from "../../config/env";
import { GitHubApiService } from "../../src/services/GitHubApiService";
import apiData from "../../testdata/apiData.json";

test.describe("GitHub repository API lifecycle", () => {
  test("should create, retrieve, and delete a temporary repository @mutation", async ({
    request,
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

    const lifecycleData = apiData.repositoryLifecycle;

    const githubApi = new GitHubApiService(
      request,
      environment.githubApiBaseUrl,
    );

    const repositoryName = `${lifecycleData.namePrefix}-${Date.now()}`;

    let repositoryCreated = false;

    try {
      const createResponse = await githubApi.createRepository(
        repositoryName,
        lifecycleData.description,
      );

      const createBody = await createResponse.json();

      expect(createResponse.status(), JSON.stringify(createBody)).toBe(
        lifecycleData.createStatus,
      );

      repositoryCreated = true;

      expect(createBody.name).toBe(repositoryName);

      expect(createBody.full_name).toBe(`${owner}/${repositoryName}`);

      expect(createBody.private).toBe(lifecycleData.isPrivate);

      const getResponse = await githubApi.getRepository(owner, repositoryName);

      const getBody = await getResponse.json();

      expect(getResponse.status(), JSON.stringify(getBody)).toBe(
        lifecycleData.retrieveStatus,
      );

      expect(getBody.name).toBe(repositoryName);

      expect(getBody.owner.login).toBe(owner);

      expect(getBody.private).toBe(lifecycleData.isPrivate);
    } finally {
      if (repositoryCreated) {
        const deleteResponse = await githubApi.deleteRepository(
          owner,
          repositoryName,
        );

        expect(deleteResponse.status()).toBe(lifecycleData.deleteStatus);
      }
    }
  });
});
