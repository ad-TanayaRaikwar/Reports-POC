import { expect, Locator, Page } from '@playwright/test';

export class SortUtils {
  constructor(private page: Page) {}

  async verifyTextSort(
    headerLocator: Locator,
    columnLocator: Locator
  ) {
    // Click for ascending
    await headerLocator.click();
    const asc = await columnLocator.allTextContents();
    const sortedAsc = [...asc].sort((a, b) => a.localeCompare(b));
    expect(asc).toEqual(sortedAsc);

    // Click for descending
    await headerLocator.click();
    const desc = await columnLocator.allTextContents();
    const sortedDesc = [...desc].sort((a, b) => b.localeCompare(a));
    expect(desc).toEqual(sortedDesc);
  }

  async verifyDateSort(headerLocator: Locator, columnLocator: Locator) {
    await headerLocator.click();
    const asc = (await columnLocator.allTextContents()).map(s => new Date(s).getTime());
    const sortedAsc = [...asc].sort((a, b) => a - b);
    expect(asc).toEqual(sortedAsc);

    await headerLocator.click();
    const desc = (await columnLocator.allTextContents()).map(s => new Date(s).getTime());
    const sortedDesc = [...desc].sort((a, b) => b - a);
    expect(desc).toEqual(sortedDesc);
  }
}
