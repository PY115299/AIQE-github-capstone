import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class SearchResultsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  repositoryLink(owner: string, repository: string): Locator {
    return this.page
      .locator(`a[href="/${owner}/${repository}"]`)
      .filter({
        hasText: `${owner}/${repository}`,
      })
      .first();
  }

  async openRepository(owner: string, repository: string): Promise<void> {
    const expectedUrl = new RegExp(`/${owner}/${repository}/?$`, "i");

    const link = this.repositoryLink(owner, repository);

    await link.scrollIntoViewIfNeeded();

    await Promise.all([
      this.page.waitForURL(expectedUrl, {
        timeout: 15_000,
        waitUntil: "domcontentloaded",
      }),
      link.click(),
    ]);
  }
}
