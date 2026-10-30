import { test, expect } from "@playwright/test";
import { environment } from "../../config/env";
import { GitHubApiService } from "../../src/services/GitHubApiService";

test.describe("GitHub public repository API", () => {
  test("should retrieve a public repository", async ({ playwright }) => {
    const publicRequest = await playwright.request.newContext({
      baseURL: environment.githubApiBaseUrl,
      extraHTTPHeaders: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    try {
      const githubApi = new GitHubApiService(
        publicRequest,
        environment.githubApiBaseUrl,
      );

      const owner = "microsoft";
      const repository = "playwright";

      const response = await githubApi.getRepository(owner, repository);

      const body = await response.json();

      expect(response.status(), JSON.stringify(body)).toBe(200);

      expect(body.name).toBe(repository);
      expect(body.owner.login).toBe(owner);
      expect(body.full_name).toBe(`${owner}/${repository}`);
      expect(body.private).toBe(false);
    } finally {
      await publicRequest.dispose();
    }
  });

  test("should return 404 for a nonexistent repository", async ({
    playwright,
  }) => {
    const publicRequest = await playwright.request.newContext({
      baseURL: environment.githubApiBaseUrl,
      extraHTTPHeaders: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    try {
      const githubApi = new GitHubApiService(
        publicRequest,
        environment.githubApiBaseUrl,
      );

      const owner = "nonexistent-aiqe-owner";
      const repository = `missing-repository-${Date.now()}`;

      const response = await githubApi.getRepository(owner, repository);

      const body = await response.json();

      expect(response.status(), JSON.stringify(body)).toBe(404);

      expect(body.message).toBe("Not Found");
    } finally {
      await publicRequest.dispose();
    }
  });
});
