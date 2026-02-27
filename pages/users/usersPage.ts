import { Page, Locator, expect } from '@playwright/test';
import { CommonUtils } from '../../utils/commonUtils';
import { BasePage } from '../basePage';

export class UsersPage extends BasePage {
  readonly page: Page;
  readonly utils: CommonUtils;

  // Page UI
  readonly usersHeader: Locator;
  readonly userFilterContainer: Locator;
  readonly usersTableContainer: Locator;

  // Search
  readonly searchBox: Locator;
  readonly searchButton: Locator;
  readonly clearButton: Locator;
  readonly noResultsFound: Locator;

  // Table
  readonly userRows: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.utils = new CommonUtils(page);

    this.usersHeader = page.locator("//h3[normalize-space()='Users']");
    this.userFilterContainer = page.locator('div.filter-container');
    this.usersTableContainer = page.locator('div.table-container');

    this.searchBox = page.locator('#searchInput');
    this.searchButton = page.locator('#searchBtn');
    this.clearButton = page.locator('.button.button-clear');

    this.noResultsFound = page.locator('h3', { hasText: 'No Results Found' }).first();
    this.userRows = page.locator('div.table-container table tbody tr');
  }

  
    /////
// -------------------------
  // Table Helpers
  // -------------------------
  getStatusCell(row: Locator): Locator {
    return row.locator('td').nth(3); // status column
  }

  async getStatus(row: Locator): Promise<string> {
    return (await this.getStatusCell(row).innerText()).trim();
  }

  getThreeDotMenu(row: Locator): Locator {
    return row.locator("span").filter({ hasText: "" }).first();
  }

  async openActionMenu(row: Locator): Promise<Locator> {
    // Close any open menu first
    const openMenu = this.page.locator("ul.dropdown-menu.show");
    if (await openMenu.isVisible()) {
      await this.page.click("body");
      await expect(openMenu).toBeHidden();
    }

    // Click 3-dot menu
    const menuTrigger = this.getThreeDotMenu(row);
    await menuTrigger.click();

    // Wait for this row's menu
    const menu = row.locator("ul.dropdown-menu.show");
    await expect(menu).toBeVisible({ timeout: 5000 });
    return menu;
  }

  async clickAction(row: Locator, action: "Activate" | "Deactivate") {
  const menu = await this.openActionMenu(row);

  const actionButton = menu.getByRole("listitem", { name: action });
  await expect(actionButton).toBeVisible({ timeout: 5000 });
  await actionButton.click();

  // Validate toast using getByRole
  const expectedToast =
    action === "Activate" ? "User activated successfully." : "User deactivated successfully.";

  const toastLocator = this.page.getByRole('alert', { name: expectedToast });

  // Wait for it to appear
  await toastLocator.waitFor({ state: 'visible', timeout: 10000 });
  await expect(toastLocator).toBeVisible();
}
//******************end activate flow *********** */
   
 /// ********** Start Deactivate*******************************
  async deactivateFirstActiveUser() {
  const firstRow = this.userRows.first();
  const status = await this.getStatus(firstRow);

  if (status === "Active") {
    const menu = await this.openActionMenu(firstRow);
    const deactivateButton = menu.getByRole("listitem", { name: "Deactivate" });
    await expect(deactivateButton).toBeVisible({ timeout: 5000 });
    await deactivateButton.click();

    // Validate toast
    const toastLocator = this.page.getByRole('alert', { name: 'User deactivated successfully.' });
    await expect(toastLocator).toBeVisible({ timeout: 5000 });
  } else {
    console.log("✔ First row is not active, skipping deactivate action");
  }
}
//******************End Deactivate flow ***********//

  
  //************** */ Start Users Page Validation************************//
 
  async validateUsersPageLoaded() {
    await this.utils.waitForVisible(this.usersHeader);
    await this.utils.waitForVisible(this.userFilterContainer);
    await this.utils.waitForVisible(this.usersTableContainer);
  }

  // -------------------------
  // Search
  // -------------------------
  async searchUser(username: string) {
    await this.searchBox.fill(username);
    await this.searchButton.click();

    await Promise.race([
      this.userRows.first().waitFor({ state: 'visible' }).catch(() => {}),
      this.noResultsFound.waitFor({ state: 'visible' }).catch(() => {})
    ]);
  }

  async validateSearchResults(username: string) {
    if (await this.noResultsFound.isVisible()) {
      console.log(`✔ No results found for "${username}"`);
      return;
    }

    const rowCount = await this.userRows.count();
    if (rowCount === 0) throw new Error("❌ No rows found in results");

    for (let i = 0; i < rowCount; i++) {
      const cellText = (await this.userRows.nth(i).locator("td").nth(0).innerText()).trim();
      if (!cellText.toLowerCase().includes(username.toLowerCase())) {
        throw new Error(`❌ Row ${i + 1} mismatch: expected ${username}, found ${cellText}`);
      }
    }

    console.log(`✔ All ${rowCount} rows matched "${username}"`);
  }

  // -------------------------
  // Clear Search
  // -------------------------
  async clearSearch() {
    await this.utils.click(this.clearButton);
    
    await this.userRows.first().waitFor({ state: 'visible' });
  }

  async validateAllRecordsLoaded() {
    const count = await this.userRows.count();
    if (count < 2) throw new Error(`❌ Expected more rows, got ${count}`);
    console.log(`✔ Table loaded with ${count} records`);
  }

  // -------------------------
  // Utility: Get First Row
  // -------------------------
  firstRow(): Locator {
    return this.userRows.first();
  }
}
