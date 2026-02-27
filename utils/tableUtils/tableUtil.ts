import { Page, Locator, expect } from "@playwright/test";

export class TableUtil {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /** ------------------ Basic Locators ------------------ */

  // Get all <tr> rows of a table
  getRows(tableLocator: Locator): Locator {
    return tableLocator.locator('tr');
  }

  // Get a row containing specific cell text
  getRowByText(tableLocator: Locator, text: string): Locator {
    return tableLocator.locator(`tr:has(td:text("${text}"))`);
  }

  // Get text from a specific cell (1-based indexing)
  async getCellText(tableLocator: Locator, row: number, col: number): Promise<string> {
    const cell = tableLocator.locator(`tr:nth-child(${row}) td:nth-child(${col})`);
    return (await cell.textContent())?.trim() || '';
  }

  // Count number of rows
  async getRowCount(tableLocator: Locator): Promise<number> {
    const rows = this.getRows(tableLocator);
    return await rows.count();
  }

  /** ------------------ Actions ------------------ */

  // Click a button/link inside a row containing specific text
  async clickButtonInRow(tableLocator: Locator, rowText: string, buttonSelector: string) {
    const row = this.getRowByText(tableLocator, rowText);
    await row.locator(buttonSelector).click();
  }

  // Sort table by column header text
  async sortByColumn(tableLocator: Locator, columnHeaderText: string) {
    const header = tableLocator.locator(`th:has-text("${columnHeaderText}")`);
    await header.click();
    await this.page.waitForLoadState('networkidle');
  }

  // Get all values from a column (1-based index)
  async getColumnValues(tableLocator: Locator, colIndex: number): Promise<string[]> {
    const rows = this.getRows(tableLocator);
    const count = await rows.count();
    const values: string[] = [];

    for (let i = 0; i < count; i++) {
      const cell = rows.nth(i).locator(`td:nth-child(${colIndex})`);
      values.push((await cell.textContent())?.trim() || '');
    }

    return values;
  }

  /** ------------------ Validation ------------------ */

  // Validate column is sorted (ascending/descending)
  async expectColumnSorted(tableLocator: Locator, colIndex: number, ascending = true) {
    const values = await this.getColumnValues(tableLocator, colIndex);
    const sorted = [...values].sort((a, b) => ascending ? a.localeCompare(b) : b.localeCompare(a));
    expect(values).toEqual(sorted);
  }

  // Validate a specific row exists
  async expectRowExists(tableLocator: Locator, text: string) {
    const row = this.getRowByText(tableLocator, text);
    await expect(row).toBeVisible({ timeout: 10000 });
  }

  /** ------------------ Pagination ------------------ */

  // Go to next page
  async goToNextPage(nextButtonLocator: Locator) {
    const isDisabled = await nextButtonLocator.getAttribute('disabled');
    if (!isDisabled) {
      await nextButtonLocator.click();
      await this.page.waitForLoadState('networkidle');
    }
  }

  // Go to a specific page number
  async goToPage(pageButtonLocator: Locator, pageNumber: number) {
    const btn = pageButtonLocator.locator(`button:has-text("${pageNumber}")`);
    await btn.click();
    await this.page.waitForLoadState('networkidle');
  }

  // Find a row across all pages by cell text
  async findRowAcrossPages(tableLocator: Locator, rowText: string, nextButtonLocator: Locator): Promise<Locator> {
    let row = this.getRowByText(tableLocator, rowText);

    while ((await row.count()) === 0) {
      const isNextDisabled = await nextButtonLocator.getAttribute('disabled');
      if (isNextDisabled) break;
      await nextButtonLocator.click();
      await this.page.waitForLoadState('networkidle');
      row = this.getRowByText(tableLocator, rowText);
    }

    return row;
  }

  /** ------------------ Search / Filter ------------------ */

  // Filter table by search input
  async searchTable(searchInputLocator: Locator, searchText: string) {
    await searchInputLocator.fill(searchText);
    await this.page.waitForLoadState('networkidle'); // optional, wait for filter results
  }



  /**
   * Wait for a toast message to appear and validate its text.
   * @param toastLocator Locator for the toast container (e.g., '.toast-message')
   * @param expectedText Text expected in the toast
   * @param timeout Maximum wait time in ms
   */
  async expectToast(toastLocator: Locator, expectedText: string, timeout = 15000) {
    await toastLocator.waitFor({ state: 'visible', timeout });
    await expect(toastLocator).toHaveText(expectedText, { timeout });
  }

  /**
   * Wait for any toast message (success/error) to appear and get its text.
   * @param toastLocator Locator for the toast container
   * @param timeout Maximum wait time in ms
   */
  async getToastText(toastLocator: Locator, timeout = 15000) {
    await toastLocator.waitFor({ state: 'visible', timeout });
    return (await toastLocator.textContent())?.trim() || '';
  }
}
