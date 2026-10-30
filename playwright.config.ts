import { defineConfig } from "@playwright/test";
import { environment } from "./config/env";
const apiHeaders = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",

  ...(environment.githubToken
    ? {
        Authorization: `Bearer ${environment.githubToken}`,
      }
    : {}),
};
export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,

  expect: {
    timeout: 5_000,
  },

  reporter: [["list"], ["html", { open: "never" }]],

  projects: [
    {
      name: "auth-setup",
      testMatch: /auth\.setup\.ts/,
      use: {
        baseURL: environment.githubUiBaseUrl,
        headless: false,
      },
    },

    {
      name: "ui",
      testDir: "./tests/ui",
      use: {
        baseURL: environment.githubUiBaseUrl,
        headless: true,
        screenshot: "only-on-failure",
        trace: "on-first-retry",
      },
    },

    {
      name: "authenticated-ui",
      testDir: "./tests/integrated",
      dependencies: ["auth-setup"],

      use: {
        baseURL: environment.githubUiBaseUrl,
        storageState: "playwright/.auth/github-user.json",
        headless: true,
        screenshot: "only-on-failure",
        trace: "on-first-retry",
      },
    },

    {
      name: "api",
      testDir: "./tests/api",
      grepInvert: /@mutation/,

      use: {
        baseURL: environment.githubApiBaseUrl,
        extraHTTPHeaders: apiHeaders,
      },
    },

    {
      name: "api-mutation",
      testDir: "./tests/api",
      grep: /@mutation/,
      workers: 1,

      use: {
        baseURL: environment.githubApiBaseUrl,
        extraHTTPHeaders: apiHeaders,
      },
    },
  ],
});
