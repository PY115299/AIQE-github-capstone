import { Locator, Page } from "@playwright/test";

import { BasePage } from "./BasePage";

export class GitHubHomePage extends BasePage {
  private readonly searchButton: Locator;
  private readonly searchInput: Locator;

  constructor(page: Page) {
    super(page);

    this.searchButton = page.getByRole("button", {
      name: /search or jump to/i,
    });

    this.searchInput = page.getByRole("combobox", {
      name: /search/i,
    });
  }

  async navigate(): Promise<void> {
    await this.open("/");
  }

  async searchFor(searchText: string): Promise<void> {
    await this.searchButton.click();
    await this.searchInput.fill(searchText);
    await this.searchInput.press("Enter");
  }
}
