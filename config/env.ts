import dotenv from "dotenv";

dotenv.config();

function getRequiredVariable(name: string): string {
  const value = process.env[name];

  if (!value?.trim()) {
    throw new Error(
      `Required environment variable "${name}" is missing or empty.`,
    );
  }

  return value;
}

export const environment = {
  githubUiBaseUrl: getRequiredVariable("GITHUB_UI_BASE_URL"),
  githubApiBaseUrl: getRequiredVariable("GITHUB_API_BASE_URL"),
  githubExpectedLogin: process.env.GITHUB_EXPECTED_LOGIN,
  githubToken: process.env.GITHUB_TOKEN,
};
