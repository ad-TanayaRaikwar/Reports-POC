import { Page, Locator, expect } from "@playwright/test";
import { CommonUtils } from "../../utils/commonUtils";

import { BasePage } from "../basePage";

export class PaymentsPage extends BasePage {
  readonly page: Page;
  readonly utils: CommonUtils;
  //payemnt table
  readonly headerTxt: Locator;
  readonly filterTable: Locator;
  readonly transactionsTable: Locator;
  // Search
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly resultsRows: Locator;

  //fiters
  readonly filter: Locator;
  readonly filterOptions: Locator;
  readonly statusFilterOption: Locator;
  readonly settledOption: Locator;
  readonly date: Locator;
  readonly dateFilterOption: Locator;
  readonly dateSelectDropdown: Locator;
  readonly clearButton: Locator;
  readonly setfilterOption: Locator;
  readonly settledCheckboxLabel: Locator;
  readonly dateFilterPanel: Locator;

  //count
  readonly transactionCount: Locator;

  //header name
  readonly headerName: Locator;
  //No Results Found
  readonly noResultsFound: Locator;

  // Sorting validation to be added later
  // Headers
  readonly headerDBAName: Locator;
  readonly headerShopperName: Locator;
  // Row columns
  readonly colDBAName: Locator;
  readonly colShopperName: Locator;
  //sub record row for refund search validation
  readonly subRecordRow: Locator;

  // Table rows locator
  readonly tableRows: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.utils = new CommonUtils(page);

    this.headerTxt = page.getByRole("heading", {
      name: /Welcome,/,
      exact: false,
    });
    this.filterTable = page.locator("div.filter-container");
    this.transactionsTable = page.locator("div.table-container");

    this.searchInput = page.locator("#searchInput");
    this.searchButton = page.locator("#searchBtn");
    this.resultsRows = page.locator("div.table-container table tbody tr");

    this.headerName = page.locator("div.table-container table thead tr th");

    this.transactionCount = page.getByText("Transactions:");
    // No Results Found locator
    this.noResultsFound = page.getByRole("heading", {
      name: "No Results Found",
    });

    /// Sorting validation to be added later
    // Headers
    this.headerDBAName = page.locator("div.table-container table thead tr th", {
      hasText: "DBA Name",
    });
    this.headerShopperName = page.locator(
      "div.table-container table thead tr th",
      { hasText: "Shopper Name" },
    );
    // Row columns
    this.colDBAName = page.locator(
      "div.table-container table tbody tr td:nth-child(1)",
    );
    this.colShopperName = page.locator(
      "div.table-container table tbody tr td:nth-child(2)",
    );
    this.subRecordRow = page
      .locator(".table-container")
      .nth(1)
      .locator("tbody tr")
      .nth(1);

    // Table rows locator
    this.tableRows = page.locator("div.table-container table tbody tr");

    // Filters
    this.filter = page.locator("#filter");
    this.filterOptions = page.locator("#filtersDropdown");
    this.clearButton = page.locator("#clearFiltersBtn");
    this.date = page.locator("li.dropdown-item", { hasText: "Date" });
    this.statusFilterOption = page.locator("li.dropdown-item", {
      hasText: "Status",
    });
    this.setfilterOption = page.getByText("Set Filter", { exact: true });
    this.settledOption = page.locator("li.dropdown-item", {
      hasText: "Settled",
    });
    this.dateFilterOption = page.locator("li.dropdown-item", {
      hasText: "Date",
    });
    this.dateSelectDropdown = page.locator("#filtersDropdown select");
    this.dateFilterPanel = page
      .locator("#filtersDropdown")
      .locator("text=Date:")
      .locator("..");

    // Date select inside Date panel ONLY
    this.dateSelectDropdown = this.dateFilterPanel.locator("select");

    // Locator for the checkbox label
    this.settledCheckboxLabel = page.locator("label.custom-check-container", {
      hasText: "Settled",
    });

    // Click the checkbox via label
  }
  async searchTransaction(text: string) {
    await this.utils.waitForVisible(this.searchInput, 10000);
    await this.utils.fill(this.searchInput, text); // highlight + fill
    // Trigger search by pressing Enter first, then fallback to clicking the button
    await this.searchInput.press("Enter");
    try {
      // Wait for either results OR the "No Results Found" heading
      await Promise.race([
        this.utils.waitForVisible(this.resultsRows.first(), 30000),
        this.utils.waitForVisible(this.noResultsFound, 30000),
      ]);
    } catch (e) {
      // if neither appeared after Enter, try clicking the search button
      await this.utils.click(this.searchButton);
      await Promise.race([
        this.utils.waitForVisible(this.resultsRows.first(), 30000),
        this.utils.waitForVisible(this.noResultsFound, 30000),
      ]);
    }
  }

  async validateSearchResultsContain(text: string) {
    await this.utils.waitForVisible(this.resultsRows.first(), 90000);

    const rowCount = await this.resultsRows.count();
    expect(rowCount).toBeGreaterThan(0);

    let found = false;

    for (let i = 0; i < rowCount; i++) {
      const rowText = await this.resultsRows.nth(i).innerText();
      if (rowText.toLowerCase().includes(text.toLowerCase())) {
        found = true;
        break;
      }
    }

    if (!found) {
      // Collect sample rows for diagnostic purposes
      const sampleRows = await this.resultsRows.allInnerTexts();
      const sample = sampleRows.slice(0, Math.min(5, sampleRows.length));
      throw new Error(
        `No search results contained "${text}". rowCount=${rowCount} sampleRows=${JSON.stringify(sample)}`,
      );
    }
  }

  //  async validateSearchResultsContain(text: string) {

  //   await this.utils.waitForVisible(this.resultsRows.first(), 90000);
  //   const rowCount = await this.resultsRows.count();
  //   expect(rowCount).toBeGreaterThan(0);

  //   for (let i = 0; i < rowCount; i++) {
  //     const rowText = await this.resultsRows.nth(i).innerText();
  //     expect(rowText.toLowerCase()).toContain(text.toLowerCase());
  //   }
  // }

  // Validate that Payments Page loads correctly

  async validatePaymentsPageLoaded() {
    // Wait for visibility
    await this.utils.waitForVisible(this.headerTxt, 15000);
    await this.utils.waitForVisible(this.filterTable, 15000);
    await this.utils.waitForVisible(this.transactionsTable, 15000);

    await expect(this.headerTxt).toBeVisible();
    await expect(this.filterTable).toBeVisible();
    await expect(this.transactionsTable).toBeVisible();
  }

  // Validate that transaction count is visible
  async validateTransactionCountVisible() {
    await this.utils.waitForVisible(this.transactionCount, 15000);
    await expect(this.transactionCount).toBeVisible();
  }

  //header name validation
  async validatePaymentSTableHeaderName() {
    const expectedHeaderNames = [
      "DBA Name",
      "Shopper Name",
      "Method",
      "ACH/Card #",
      "Merchant Ref",
      "Ref ID",
      "Ref Value",
      "Transaction Id",
      "Date",
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
  async validateNoSearchResults() {
    // searchTransaction already waits for "No Results Found" to appear
    // Just verify it's visible now
    await expect(this.noResultsFound).toBeVisible();
  }

  //sorting validation to be added later
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

  //  NOTE >> DO NOT Update under this Refund search validation
  // Validate Refund Transaction and Nested Refund Settlement Row
  async validateRefundFlow(
    searchText: string,
    expectedMainStatus: string,
    expectedNestedStatus: string,
  ) {
    // 1️⃣ Wait for table to load
    await this.page.waitForSelector("div.table-container table tbody tr");

    // 2️⃣ Try matching full ID first
    let mainRow = this.page
      .locator("tbody tr", { hasText: searchText })
      .first();

    if (!(await mainRow.count())) {
      // 3️⃣ If full ID not found, match first 8–12 characters
      const partialId = searchText.substring(0, 10); // UI probably displays a short version
      mainRow = this.page.locator("tbody tr", { hasText: partialId }).first();
    }

    // 4️⃣ If still no match → FAIL EARLY with meaningful message
    await expect(
      mainRow,
      `No matching main row found for ID: ${searchText}`,
    ).toHaveCount(1);

    // 5️⃣ Wait for the row to become visible
    await mainRow.waitFor({ state: "visible", timeout: 30000 });

    // 6️⃣ Validate main status (column #9)
    const mainStatusText = (
      await mainRow.locator("td").nth(9).innerText()
    ).trim();
    expect(mainStatusText).toBe(expectedMainStatus);

    // 7️⃣ Expand main row
    await mainRow.click();

    // 8️⃣ Wait for nested refund row
    const nestedRow = mainRow
      .locator('xpath=following-sibling::tr[contains(@class,"nested-row")]')
      .first();
    await nestedRow.waitFor({ state: "visible", timeout: 30000 });

    // 9️⃣ Validate nested status
    await expect(nestedRow).toContainText(expectedNestedStatus);
  }
  // //*********************************************************************************************** */

  //AN-38254-Ally Portal Payments | Payment Details Page - Get Row Data and Click Row

  async getRowDataByIndex(index = 0) {
    const row = this.tableRows.nth(index);
    return {
      dbaName: await row.locator("td").nth(0).innerText(),
      shopperName: await row.locator("td").nth(1).innerText(),
      method: await row.locator("td").nth(2).innerText(),
      merchantRef: await row.locator("td").nth(4).innerText(),
      refId: await row.locator("td").nth(5).innerText(),
      refValue: await row.locator("td").nth(6).innerText(),
      transactionId: (await row.locator("td").nth(7).innerText())
        .replace("", "")
        .trim(),

      date: await row.locator("td").nth(8).innerText(),
      status: await row.locator("td").nth(9).innerText(),
      amount: await row.locator("td").nth(10).innerText(),
    };
  }

  async clickRowByIndex(index = 0) {
    await this.tableRows.nth(index).click();
  }

  async applySettledStatusFilter() {
    await this.utils.click(this.filter);
    await expect(this.filterOptions).toBeVisible({ timeout: 10000 });

    // Open filter options
    await this.utils.click(this.filterOptions);
    await expect(this.statusFilterOption).toBeVisible({ timeout: 10000 });
    await this.utils.click(this.statusFilterOption);
    await this.utils.click(this.settledCheckboxLabel);
    const statusFilterContainer = this.page.locator(
      "div.filter-selection-container",
      { hasText: "Status:" },
    );
    const setFilterBtn = statusFilterContainer.getByText("Set Filter", {
      exact: true,
    });
    await this.utils.click(setFilterBtn);
  }
  async clickLastFourRows() {
    // Wait for table rows to appear
    const rows = this.page.locator("div.table-container table tbody tr");
    await rows.first().waitFor({ state: "visible", timeout: 10000 });

    const rowCount = await rows.count();
    if (rowCount === 0) return;

    // Number of rows from the bottom to consider
    const lastN = 4;

    // Calculate start index safely
    const startIndex = Math.max(0, rowCount - lastN);

    // Build selectable indexes dynamically
    const selectableIndexes = Array.from(
      { length: rowCount - startIndex },
      (_, i) => startIndex + i,
    );

    // Pick a random index from the last N rows
    const randomIndex =
      selectableIndexes[Math.floor(Math.random() * selectableIndexes.length)];

    await this.utils.click(rows.nth(randomIndex));
  }

  async applyLast14DaysDateFilter() {
    // Open filters
    await this.filter.click();
    await this.filterOptions.click();

    // Activate Date filter
    await this.dateFilterOption.click();

    // Locate container holding both Date <select> and "Set Filter" button
    const dateContainer = this.page.locator("text=Date:").locator("..");

    // Select last 14 days
    const dateSelect = dateContainer.locator("select");
    await dateSelect.selectOption("30");

    // Click Set Filter button in the same container
    const setFilterBtn = dateContainer.getByText("Set Filter", { exact: true });
    await this.utils.click(setFilterBtn);

    // Wait for table refresh
    await this.page.waitForSelector("div.table-container table tbody tr");
  }

  /**
   * This TypeScript code snippet defines an asynchronous function named `saveFirstTransactionId` that returns a Promise of a string. 

The function does the following:

1. Waits until the first row in the `tableRows` is visible. The wait time is set to 30 seconds.
2. Calls the `getRowDataByIndex` function with an index of 0 to retrieve the data of the first row.
3. Uses the Jest testing library's `expect` function to assert that the `transactionId` property of `firstRowData` is not an empty string. If it is empty, an error message is thrown.
4. Returns the `transactionId` from `firstRowData`.
   * 
   */
  async saveFirstTransactionId(): Promise<string> {
    // Wait until table has at least one row
    await this.utils.waitForVisible(this.tableRows.first(), 30000);

    // Reuse existing row reader
    const firstRowData = await this.getRowDataByIndex(0);

    expect(
      firstRowData.transactionId,
      "Transaction ID should not be empty",
    ).not.toBe("");

    return firstRowData.transactionId;
  }
}
