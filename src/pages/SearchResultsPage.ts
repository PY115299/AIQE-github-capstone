import { Locator, Page } from "@playwright/test";

import { BasePage } from "./BasePage";
import uiData from "../../testdata/uiData.json";

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
        timeout: uiData.timeouts.repositoryNavigationMs,

        waitUntil: "domcontentloaded",
      }),

      link.click(),
    ]);
  }
}
