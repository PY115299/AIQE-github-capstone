# AIQE GitHub UI and API Automation

A Playwright and TypeScript automation framework for validating GitHub through its public UI, REST API, authenticated API operations, and an integrated API-to-UI workflow.

## Table of Contents

- [AIQE GitHub UI and API Automation](#aiqe-github-ui-and-api-automation)
  - [Table of Contents](#table-of-contents)
  - [Project Overview](#project-overview)
  - [Technology Stack](#technology-stack)
  - [Automated Coverage](#automated-coverage)
    - [UI tests](#ui-tests)
    - [API tests](#api-tests)
    - [Integrated test](#integrated-test)
  - [Framework Architecture](#framework-architecture)
    - [Design principles](#design-principles)
  - [Project Structure](#project-structure)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Configuration](#environment-configuration)
    - [Variable purpose](#variable-purpose)
  - [Browser Authentication State](#browser-authentication-state)
  - [Running Tests](#running-tests)
    - [Normal regression](#normal-regression)
    - [UI tests](#ui-tests-1)
    - [Safe API tests](#safe-api-tests)
    - [Integrated API/UI test](#integrated-apiui-test)
    - [Standalone mutation test](#standalone-mutation-test)
    - [Deliberate all-project execution](#deliberate-all-project-execution)
    - [Open the HTML report](#open-the-html-report)
  - [Reports and Evidence](#reports-and-evidence)
  - [Continuous Integration](#continuous-integration)
    - [GitHub Actions configuration](#github-actions-configuration)
  - [Security Practices](#security-practices)
  - [Synchronization and Reliability](#synchronization-and-reliability)
  - [Responsible AI Usage](#responsible-ai-usage)
  - [Known Limitations](#known-limitations)
  - [Troubleshooting](#troubleshooting)
    - [Environment variable is missing](#environment-variable-is-missing)
    - [`401 Unauthorized`](#401-unauthorized)
    - [`403` during repository creation](#403-during-repository-creation)
    - [External public repository returns `404`](#external-public-repository-returns-404)
    - [UI navigation timeout](#ui-navigation-timeout)
    - [Repository click does not navigate](#repository-click-does-not-navigate)
    - [Private repository owner or name is not found](#private-repository-owner-or-name-is-not-found)
    - [Authentication setup reaches GitHub but times out](#authentication-setup-reaches-github-but-times-out)
    - [SSH uses the wrong GitHub account](#ssh-uses-the-wrong-github-account)
  - [Completion Status](#completion-status)
  - [Final Validation Checklist](#final-validation-checklist)

## Project Overview

This project demonstrates a maintainable quality-engineering framework using Playwright and TypeScript. It separates UI interaction, API communication, configuration, assertions, test data, authentication state, reporting, and CI execution.

The framework covers:

- Public GitHub UI validation
- Positive and negative repository search
- Public and authenticated GitHub REST API validation
- Temporary repository lifecycle testing
- Integrated API setup, authenticated UI validation, and API cleanup
- Safe GitHub Actions execution for non-destructive regression tests

## Technology Stack

- Node.js 20
- TypeScript
- Playwright Test
- dotenv
- GitHub REST API
- Git and GitHub
- GitHub Actions

## Automated Coverage

### UI tests

| Scenario | Expected result |
|---|---|
| GitHub homepage smoke test | Homepage opens and the title contains `GitHub` |
| Public repository search | `microsoft/playwright` appears and opens successfully |
| Negative repository search | A dynamically generated nonexistent repository is absent |
| Public repository details | Owner, repository name, title, and URL are validated |

### API tests

| Scenario | Expected result |
|---|---|
| Retrieve public repository | Returns `200` and the expected repository fields |
| Retrieve nonexistent repository | Returns `404` with `Not Found` |
| Retrieve authenticated user | Returns `200` and the expected GitHub login |
| Temporary repository lifecycle | Creates with `201`, retrieves with `200`, and deletes with `204` |

### Integrated test

The integrated scenario performs this flow:

1. Creates a uniquely named private repository through the GitHub REST API.
2. Opens the repository through an authenticated browser session.
3. Validates the URL, owner, repository name, and private indicator.
4. Deletes the repository through the API in a `finally` block.
5. Disposes the dedicated API request context.

## Framework Architecture

The project applies clear responsibility boundaries:

- **Tests** contain scenario flow and assertions.
- **Page Objects** contain reusable UI locators and page actions.
- **BasePage** contains shared browser navigation behavior.
- **API Service** contains reusable GitHub REST communication.
- **Configuration** loads and validates environment variables.
- **Playwright projects** separate UI, safe API, authenticated UI, authentication setup, and mutation execution.
- **GitHub Actions** runs only safe, non-destructive projects.

### Design principles

- Prefer resilient user-facing locators and stable destination paths.
- Keep assertions in tests rather than hiding them in page objects.
- Use web-first assertions instead of fixed delays.
- Use `domcontentloaded` for GitHub navigation when waiting for the full `load` event is unnecessary.
- Generate unique repository names with timestamps.
- Delete created resources in `finally` blocks.
- Keep public API traffic separate from fine-grained-token traffic.
- Never run multiple repository-creation tests concurrently.

## Project Structure

```text
AIQE-github-capstone/
├── .github/
│   └── workflows/
│       └── playwright.yml
├── config/
│   └── env.ts
├── playwright/
│   └── .auth/                 # Generated locally and ignored by Git
├── src/
│   ├── pages/
│   │   ├── BasePage.ts
│   │   ├── GitHubHomePage.ts
│   │   ├── RepositoryPage.ts
│   │   └── SearchResultsPage.ts
│   ├── services/
│   │   └── GitHubApiService.ts
│   └── utils/
├── testdata/
├── tests/
│   ├── api/
│   │   ├── authenticatedUserApi.spec.ts
│   │   ├── repositoryApi.spec.ts
│   │   └── repositoryLifecycleApi.spec.ts
│   ├── integrated/
│   │   └── repositoryIntegrated.spec.ts
│   ├── ui/
│   │   ├── repositoryDetails.spec.ts
│   │   ├── repositorySearch.spec.ts
│   │   └── smoke.spec.ts
│   └── auth.setup.ts
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── playwright.config.ts
└── README.md
```

Generated folders such as `node_modules/`, `playwright-report/`, `test-results/`, and `playwright/.auth/` are not committed.

## Prerequisites

Install or prepare:

- Node.js 20 or another project-approved compatible version
- npm
- Git
- A GitHub account
- Chromium installed through Playwright
- A fine-grained GitHub Personal Access Token for authenticated API scenarios
- An authenticated browser storage-state file for the integrated UI scenario

## Installation

Clone the repository and install deterministic dependencies:

```bash
git clone git@github-aiqe:PY115299/AIQE-github-capstone.git
cd AIQE-github-capstone
npm ci
npx playwright install
```

For CI-compatible Chromium installation on Linux:

```bash
npx playwright install --with-deps chromium
```

## Environment Configuration

Copy `.env.example` to `.env`.

PowerShell:

```powershell
Copy-Item .env.example .env
```

Bash:

```bash
cp .env.example .env
```

Configure the following values:

```env
GITHUB_UI_BASE_URL=https://github.com
GITHUB_API_BASE_URL=https://api.github.com
GITHUB_EXPECTED_LOGIN=
GITHUB_TOKEN=
```

### Variable purpose

| Variable | Purpose | Required for |
|---|---|---|
| `GITHUB_UI_BASE_URL` | GitHub web base URL | UI tests |
| `GITHUB_API_BASE_URL` | GitHub REST API base URL | API and integrated tests |
| `GITHUB_EXPECTED_LOGIN` | Exact GitHub account login | Authenticated assertions |
| `GITHUB_TOKEN` | Fine-grained Personal Access Token | Authenticated API operations |

Do not add quotes around the token unless your environment requires them. Never print the environment object or authorization headers.

## Browser Authentication State

The integrated private-repository scenario uses a locally generated Playwright storage-state file.

Generate or refresh it with:

```bash
npx playwright test --project=auth-setup
```

Complete GitHub login manually in the browser window. This supports normal account protections such as two-factor authentication without placing a password or one-time code in source files.

The generated file is stored under:

```text
playwright/.auth/github-user.json
```

Treat this file as a secret. Never commit, upload, print, inspect unnecessarily, or share it.

Confirm Git ignores it:

```bash
git check-ignore -v playwright/.auth/github-user.json
```

## Running Tests

The exact scripts are defined in `package.json`.

### Normal regression

Runs the standard UI project, safe API project, and controlled integrated project as configured by the repository:

```bash
npm test
```

### UI tests

```bash
npm run test:ui
```

### Safe API tests

```bash
npm run test:api
```

The standard API project excludes tests tagged `@mutation`.

### Integrated API/UI test

```bash
npm run test:integrated
```

This requires:

- A valid `GITHUB_TOKEN`
- A matching `GITHUB_EXPECTED_LOGIN`
- A valid browser storage-state file

### Standalone mutation test

```bash
npm run test:mutation
```

The mutation project uses one worker and runs repository lifecycle coverage separately.

> Do not run the mutation project and integrated repository-creation scenario concurrently. GitHub may apply a secondary content-creation rate limit.

### Deliberate all-project execution

If the repository defines `test:all`, use it only intentionally:

```bash
npm run test:all
```

Avoid routine all-project execution because it can include multiple content-creation flows.

### Open the HTML report

```bash
npm run report
```

## Reports and Evidence

Playwright produces:

- HTML reports under `playwright-report/`
- Failure screenshots and attachments under `test-results/`
- Traces according to the Playwright project configuration

These generated artifacts are ignored by Git. CI uploads the HTML report and failure evidence as workflow artifacts with limited retention.

When reviewing results, verify:

- Test name and project
- Expected versus actual behavior
- Screenshot and trace evidence
- Absence of tokens, cookies, authorization headers, and storage-state data
- Cleanup of every temporary repository

## Continuous Integration

GitHub Actions runs safe regression coverage on the configured branches and manual workflow dispatch.

The workflow:

1. Checks out the repository.
2. Configures Node.js 20.
3. Runs `npm ci`.
4. Installs Playwright Chromium and Linux dependencies.
5. Runs only the approved safe UI and API projects.
6. Uploads the Playwright HTML report.
7. Uploads failure evidence when needed.

### GitHub Actions configuration

Repository secret:

```text
AIQE_GITHUB_PAT
```

Repository variable:

```text
AIQE_GITHUB_EXPECTED_LOGIN
```

The workflow maps them to runtime environment variables without committing their values.

Routine CI excludes:

- `api-mutation`
- `authenticated-ui`
- Manual authentication setup
- Repository creation and deletion

This prevents manual-login failures and reduces the risk of secondary content-creation limits.

## Security Practices

- `.env` is ignored by Git.
- `.env.example` contains placeholders only.
- `playwright/.auth/` is ignored by Git.
- Personal Access Tokens are stored only in local environment variables or GitHub Actions secrets.
- Browser storage state is treated as a reusable credential.
- Public API tests create an unauthenticated request context.
- Authenticated API calls use a dedicated API context targeting `https://api.github.com`.
- API bearer tokens are not attached to browser requests to `https://github.com`.
- Temporary repositories have unique names and controlled cleanup.
- Tests never delete an arbitrary or pre-existing repository.
- Logs must not print request headers, tokens, passwords, cookies, or storage-state contents.
- Fine-grained tokens should use the shortest practical expiration and minimum required permissions.

## Synchronization and Reliability

The framework avoids arbitrary `waitForTimeout()` calls.

Reliability techniques include:

- Playwright web-first assertions such as `toBeVisible()` and `toHaveURL()`
- `waitUntil: 'domcontentloaded'` for GitHub navigation
- `Promise.all()` to start URL waiting before a navigation-triggering click
- Targeted assertion timeouts for newly created repository UI elements
- Stable `href` locators for repository owner and repository links
- Separate Playwright projects for public, authenticated, integrated, and mutation coverage
- One worker for mutation tests
- `try/finally` cleanup for created resources and request contexts

## Responsible AI Usage

AI was used intentionally in the following roles:

- Requirement Analyst
- Test Designer
- Framework Architect
- Pair Programmer
- Code Reviewer
- API Reviewer
- Debugging Assistant
- Security Reviewer
- Documentation Coach
- CI/CD Coach

All significant AI-assisted outputs followed:

**Generate → Review → Validate → Use**

Generated suggestions were reviewed for requirement fit, security, architecture, maintainability, synchronization, and test quality. Code was executed and corrected using actual Playwright evidence before being accepted.

Examples of reviewed corrections include:

- Replacing full-page `load` waits with `domcontentloaded`
- Synchronizing repository-result navigation with `Promise.all()`
- Separating public API requests from fine-grained-token requests
- Isolating API authorization from browser traffic
- Preventing concurrent repository-creation tests
- Replacing fragile accessible-name assumptions with stable destination paths
- Ensuring cleanup occurs after assertion failures

AI assistance does not replace engineer ownership. The participant remains responsible for understanding, validating, maintaining, and explaining the final implementation.

## Known Limitations

- GitHub UI changes may require locator maintenance.
- Browser authentication state expires and must be regenerated.
- Authenticated UI setup requires manual login.
- Repository-creation operations can trigger GitHub secondary rate limits when run repeatedly or concurrently.
- GitHub API behavior depends on token permissions, token expiration, account policy, and organization policy.
- Public API requests are subject to unauthenticated rate limits.
- Integrated and mutation tests modify the authenticated account temporarily and therefore require controlled execution.
- The first CI workflow intentionally excludes destructive and manual-authentication scenarios.

## Troubleshooting

### Environment variable is missing

Typical error:

```text
Required environment variable "GITHUB_UI_BASE_URL" is missing or empty.
```

Check that `.env` exists, variable names match `.env.example`, and the command is run from the project root.

### `401 Unauthorized`

Check:

- The token is valid and not expired or revoked.
- `GITHUB_TOKEN` contains no accidental spaces.
- The authorization header is added only to the API request context.
- The token was created for the intended GitHub account.

Do not print the token while diagnosing.

### `403` during repository creation

A `403` can indicate either insufficient permission or a secondary content-creation rate limit.

If the response mentions a secondary rate limit:

- Stop creation attempts.
- Honor `Retry-After` when present.
- Otherwise wait before one controlled retry.
- Do not run mutation and integrated creation tests concurrently.
- Do not add tight automatic retry loops.

If the response indicates permission failure, review only the required fine-grained token permissions rather than broadening unrelated access.

### External public repository returns `404`

A fine-grained token scoped to a different resource owner can cause an external repository request to return `404`. Run public repository tests through the unauthenticated request context.

### UI navigation timeout

Use condition-based synchronization:

```ts
await page.goto(path, { waitUntil: 'domcontentloaded' });
```

Do not add fixed sleeps as the primary solution.

### Repository click does not navigate

Start the navigation wait before the click:

```ts
await Promise.all([
  page.waitForURL(expectedUrl, {
    waitUntil: 'domcontentloaded'
  }),
  repositoryLink.click()
]);
```

### Private repository owner or name is not found

Prefer stable destination paths:

```ts
page.locator(`a[href="/${owner}"]`).first();
page.locator(`a[href="/${owner}/${repository}"]`).first();
```

### Authentication setup reaches GitHub but times out

Increase the setup test timeout independently and wait for `domcontentloaded` rather than the full `load` event. Manual login may require additional time for two-factor authentication.

### SSH uses the wrong GitHub account

Use the repository-specific SSH host alias, for example:

```text
git@github-aiqe:YOUR_LOGIN/AIQE-github-capstone.git
```

Verify it with:

```bash
ssh -T git@github-aiqe
```

Do not remove or replace credentials used by unrelated repositories.

## Completion Status

The project currently includes:

- Completed UI framework and scenarios
- Completed public and authenticated API tests
- Completed repository lifecycle coverage
- Completed integrated API/UI flow with cleanup
- Completed safe execution separation
- Completed Git hygiene and separate SSH-account setup
- Completed GitHub Actions safe regression workflow
- Completed reporting and documentation guidance

Before final submission, verify the requirement traceability, run the approved final command set, inspect reports, confirm account cleanup, and review the repository for secrets.

## Final Validation Checklist

- [ ] `npm run test:ui` passes
- [ ] `npm run test:api` passes
- [ ] `npm run test:integrated` passes in controlled execution
- [ ] `npm run test:mutation` passes when run separately
- [ ] No temporary `aiqe-capstone-*` repository remains
- [ ] No temporary `aiqe-integrated-*` repository remains
- [ ] GitHub Actions safe workflow is green
- [ ] Playwright report artifact is available
- [ ] `.env` is not tracked
- [ ] `playwright/.auth/github-user.json` is not tracked
- [ ] No token, password, cookie, or authorization header appears in the repository or logs
- [ ] README commands match `package.json`
- [ ] Playwright project names match `playwright.config.ts`
- [ ] Known limitations are documented honestly

---

**Responsible AI checkpoint:** Generate → Review → Validate → Use.
