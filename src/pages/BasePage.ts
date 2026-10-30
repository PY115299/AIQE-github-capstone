import { Page } from '@playwright/test';

export abstract class BasePage {
  protected readonly page: Page;

  protected constructor(page: Page) {
    this.page = page;
  }

  async open(path = '/'): Promise<void> {
    await this.page.goto(path, {
      waitUntil: 'domcontentloaded'
    });
  }
}