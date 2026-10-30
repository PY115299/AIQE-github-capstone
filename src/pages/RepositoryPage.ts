import { Locator, Page } from "@playwright/test";

import { BasePage } from "./BasePage";

export class RepositoryPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  ownerLink(owner: string): Locator {
    return this.page.locator(`a[href="/${owner}"]`).first();
  }

  repositoryLink(owner: string, repository: string): Locator {
    return this.page.locator(`a[href="/${owner}/${repository}"]`).first();
  }

  privateBadge(): Locator {
    return this.page
      .getByText("Private", {
        exact: true,
      })
      .first();
  }

  async navigateTo(owner: string, repository: string): Promise<void> {
    await this.open(`/${owner}/${repository}`);
  }
}
