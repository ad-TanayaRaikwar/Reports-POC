// pages/basePage.ts
import { Page, Locator, expect} from '@playwright/test';
import { CommonUtils } from '../utils/commonUtils';


export class BasePage {
  readonly page: Page;
  readonly utils: CommonUtils;

readonly  itemsPerPageDropdown: Locator;
readonly itemsPerPageOptions: Locator;
readonly tableRows: Locator;


  constructor(page: Page) {
    this.page = page;
    this.utils = new CommonUtils(page);
    this.itemsPerPageDropdown = page.locator('#maxPerPage');
this.itemsPerPageOptions = page.locator('#maxPerPage option');

    this.tableRows = page.locator('div.table-container table tbody tr');  



  }

  // ⭐ Updated click with auto-highlight
  async click(locator: Locator) {
    await this.utils.click(locator);
  }

  // ⭐ Updated fill with auto-highlight
  async fill(locator: Locator, text: string) {
    await this.utils.fill(locator, text);
  }

  // ⭐ Optional: type() with auto-highlight
  async type(locator: Locator, text: string) {
    await this.utils.type(locator, text);
  }

  // Wait until element is visible
  async waitForVisible(locator: Locator, timeout?: number) {
    await this.utils.waitForVisible(locator, timeout);
  }

  // Get text
  async getText(locator: Locator): Promise<string> {
    return this.utils.getText(locator);
  }

  // Navigate to a URL
  async navigateTo(url: string) {
    console.log('Navigating to:', url);
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
  }


//Items per page selection
  async selectItemsPerPage(count: number) {
    await this.itemsPerPageDropdown.selectOption(count.toString());
    await this.utils.waitForVisible(this.tableRows.first(), 90000);
  }
 async validateItemsPerPageOptions() {
  await this.itemsPerPageDropdown.click();
    const expected = ['10', '25', '50'];
    const actual = (await this.itemsPerPageOptions.allTextContents()).map(t => t.trim());
    expect(actual).toEqual(expected);
     await this.itemsPerPageDropdown.selectOption({ label: '50' });
  }




}
