import { Page, Locator, expect } from "@playwright/test";

export class endToendPayments {
  readonly page: Page;
  readonly transactionIdValue: Locator;

  constructor(page: Page) {
    this.page = page;

    this.transactionIdValue = page
      .locator("span.row-value span.cap-ellipsis")
      .first();
  }

  /**
   * Validate Event Details page loaded
   */
  async validatePageLoaded() {
    await expect(this.transactionIdValue).toBeVisible({ timeout: 15000 });
  }

  /**
   * Read Transaction ID from Event Details page
   */
  async getTransactionId(): Promise<string> {
    await this.validatePageLoaded();
    return (await this.transactionIdValue.innerText()).trim();
  }
}
