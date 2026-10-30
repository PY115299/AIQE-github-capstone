import { test, expect } from "@playwright/test";
import { environment } from "../../config/env";
import { GitHubApiService } from "../../src/services/GitHubApiService";

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

    const githubApi = new GitHubApiService(
      request,
      environment.githubApiBaseUrl,
    );

    const repositoryName = `aiqe-capstone-${Date.now()}`;

    let repositoryCreated = false;

    try {
      const createResponse = await githubApi.createRepository(
        repositoryName,
        "Temporary repository created by an AIQE Playwright test",
      );

      const createBody = await createResponse.json();

      expect(createResponse.status(), JSON.stringify(createBody)).toBe(201);

      repositoryCreated = true;

      expect(createBody.name).toBe(repositoryName);
      expect(createBody.full_name).toBe(
        `${environment.githubExpectedLogin}/${repositoryName}`,
      );
      expect(createBody.private).toBe(true);

      const getResponse = await githubApi.getRepository(
        environment.githubExpectedLogin!,
        repositoryName,
      );

      const getBody = await getResponse.json();

      expect(getResponse.status(), JSON.stringify(getBody)).toBe(200);

      expect(getBody.name).toBe(repositoryName);
      expect(getBody.owner.login).toBe(environment.githubExpectedLogin);
      expect(getBody.private).toBe(true);
    } finally {
      if (repositoryCreated) {
        const deleteResponse = await githubApi.deleteRepository(
          environment.githubExpectedLogin!,
          repositoryName,
        );

        expect(deleteResponse.status()).toBe(204);
      }
    }
  });
});
