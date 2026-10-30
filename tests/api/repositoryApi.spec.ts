import { test, expect } from "@playwright/test";
import { environment } from "../../config/env";
import { GitHubApiService } from "../../src/services/GitHubApiService";
import apiData from "../../testdata/apiData.json";

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

      const repositoryData = apiData.publicRepository;

      const response = await githubApi.getRepository(
        repositoryData.owner,
        repositoryData.name,
      );

      const body = await response.json();

      expect(response.status(), JSON.stringify(body)).toBe(
        repositoryData.expectedStatus,
      );

      expect(body.name).toBe(repositoryData.name);

      expect(body.owner.login).toBe(repositoryData.owner);

      expect(body.full_name).toBe(repositoryData.fullName);

      expect(body.private).toBe(repositoryData.isPrivate);
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

      const negativeData = apiData.nonexistentRepository;

      const owner = negativeData.ownerPrefix;

      const repository = `${negativeData.repositoryPrefix}-${Date.now()}`;

      const response = await githubApi.getRepository(owner, repository);

      const body = await response.json();

      expect(response.status(), JSON.stringify(body)).toBe(
        negativeData.expectedStatus,
      );

      expect(body.message).toBe(negativeData.expectedMessage);
    } finally {
      await publicRequest.dispose();
    }
  });
});
