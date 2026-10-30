import { test, expect } from "@playwright/test";
import { environment } from "../../config/env";
import { GitHubApiService } from "../../src/services/GitHubApiService";
import apiData from "../../testdata/apiData.json";

test.describe("GitHub authenticated-user API", () => {
  test("should retrieve the authenticated user", async ({ request }) => {
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

    const response = await githubApi.getAuthenticatedUser();

    const body = await response.json();

    expect(response.status(), JSON.stringify(body)).toBe(
      apiData.authenticatedUser.expectedStatus,
    );

    expect(body.login).toBe(environment.githubExpectedLogin);

    expect(body.id).toEqual(expect.any(Number));

    expect(body.node_id).toEqual(expect.any(String));

    expect(body.type).toBe(apiData.authenticatedUser.expectedType);
  });
});
