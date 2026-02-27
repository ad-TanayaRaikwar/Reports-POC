import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "../basePage";
export class WebhookEventPage extends BasePage {
  readonly webhookEventsHeader: Locator;
  readonly uRLSortIcon: Locator;
  readonly webhooksHeader: Locator;
  readonly ellipsisButton: Locator;
  readonly actionsMenu: Locator;
  readonly retriggerOption: Locator;
  readonly retriggerMessage: Locator;
  readonly viewOption: Locator;
  // Headers
  readonly headerURL: Locator;
  // Row columns
  readonly colURL: Locator;
  readonly URLText: Locator;

  constructor(page: Page) {
    super(page);

    this.webhookEventsHeader = page.locator(
      `//h3[normalize-space()='Webhook Event Logs']`,
    );
    this.uRLSortIcon = page.locator(
      `//span[normalize-space()='URL']/following-sibling::div/img`,
    );
    this.webhooksHeader = page.locator(`//h3[normalize-space()='Webhooks']`);
    this.ellipsisButton = page.locator(`span:has-text("")`).first();
    this.actionsMenu = page.locator(
      `//ul[contains(@class,'dropdown-menu') and contains(@class,'show')]`,
    );
    this.retriggerOption = page
      .locator(`//li[contains(normalize-space(), 'Retrigger')]`)
      .first();
    this.retriggerMessage = page
      .locator(".ngx-toastr.toast-success")
      .or(page.locator(".ngx-toastr.toast-error"));
    this.viewOption = page
      .locator(`//li[contains(normalize-space(), 'View')]`)
      .first();

    // Headers
    this.headerURL = page.locator("div.table-container table thead tr th", {
      hasText: "URL",
    });
    this.colURL = page.locator("div.table-container table thead tr th", {
      hasText: "URL",
    });
    this.URLText = page.locator(`//tr//td[2]//span`).first();
  }

  async validateWebhookEventsPageLoaded() {
    // Wait for visibility
    await this.utils.waitForVisible(this.webhookEventsHeader, 15000);
    await expect(this.webhookEventsHeader).toBeVisible();
  }

  /**
   * Validate Webhook Events Table Header Names
   * Validates that the table headers on the Webhook Events page match the expected header names
   * @returns {Promise<void>}
   */
  async validateWebhookEventsTableHeaderName() {
    const expectedHeaderNames = [
      "Log Id",
      "URL",
      "Module",
      "Event",
      "Transaction ID",
      "Date Time",
      "Status",
    ];

    for (const headerName of expectedHeaderNames) {
      const headerLocator = this.page.locator(
        "div.table-container table thead tr th",
        { hasText: headerName },
      );
      await this.utils.waitForVisible(headerLocator, 10000);
      await expect(headerLocator).toBeVisible();
    }
  }

  /**
   * Validates that sorting works correctly for a given table header and column.
   * This function first sorts the column in ascending order and then sorts it in descending order.
   * It checks that the sorted values match the expected sorted order.
   * @param {Locator} header - The Locator for the table header
   * @param {Locator} column - The Locator for the table column
   */
  async validateSorting(header: Locator, column: Locator) {
    // Click to sort Asc
    await header.click();

    const ascValues = await column.allInnerTexts();
    const sortedAsc = [...ascValues].sort((a, b) => a.localeCompare(b));

    expect(ascValues).toEqual(sortedAsc);

    // Click again to sort Desc
    await header.click();

    const descValues = await column.allInnerTexts();
    const sortedDesc = [...descValues].sort((a, b) => b.localeCompare(a));

    expect(descValues).toEqual(sortedDesc);
  }

  /**
   * Wait for the loading spinner to disappear from the page
   * @remarks
   * Useful when waiting for a page to finish loading data
   * before performing any other actions
   */
  async waitForLoaderToDisappear() {
    const loader = this.page.locator(".loading-spinner");
    await loader.waitFor({ state: "detached", timeout: 20000 });
  }

  /**17*01
   * Find and open webhook rows with Module=Transaction and Event=OnSuccess
   * Returns true if any matching row was clicked, false otherwise
   */
  async openNextTransactionSuccessWebhook(
    startIndex = 0,
  ): Promise<number | null> {
    await this.utils.waitForVisible(this.tableRows.first(), 30000);

    const rowCount = await this.tableRows.count();

    for (let i = startIndex; i < rowCount; i++) {
      const row = this.tableRows.nth(i);

      const module = (await row.locator("td").nth(2).innerText()).trim();
      const event = (await row.locator("td").nth(3).innerText()).trim();

      if (module === "Transaction" && event === "OnAuthorized") {
        await row.click();
        return i; // return index of clicked row
      }
    }

    return null; // no matching rows
  }

  /**
   * Wait for the table to reload.
   * This function waits for the table to reload by waiting for the first row to become visible.
   * The timeout is set to 15000 milliseconds.
   */
  async waitForTableReload() {
    await this.tableRows.first().waitFor({ state: "visible", timeout: 15000 });
  }
}
