import { Page, Locator } from '@playwright/test';

export class CommonUtils {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  private async highlight(locator: Locator) {
    try {
      // Check locator is attached to an active page
      const attached = await locator.isVisible({ timeout: 3000 }).catch(() => false);
      if (!attached) return;

      const handle = await locator.elementHandle();
      if (!handle) return;

      await this.page.evaluate((el) => {
        const orig = el.getAttribute("style") || "";
        el.style.transition = "box-shadow 0.95s ease";
        el.style.boxShadow = "0 0 15px 5px rgba(231, 12, 23, 0.9)";

        setTimeout(() => {
          el.style.boxShadow = "none";
          el.setAttribute("style", orig);
        }, 1000);
      }, handle);

    } catch (err) {
      console.warn("⚠ highlight skipped: page/locator was not ready");
    }
  }

  async click(locator: Locator) {
    await locator.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
    await this.highlight(locator);
    // await locator.click({ timeout: 15000 });
    await locator.click();
    // avoid long sleeps unless needed
  }

  async fill(locator: Locator, text: string) {
    await locator.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
    await this.highlight(locator);
    await locator.fill(text);
  }

  async type(locator: Locator, text: string) {
    await locator.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
    await this.highlight(locator);
    await locator.type(text);
  }

  async waitForElementVisible(locator: Locator, timeout = 10000) {
    await locator.waitFor({ state: 'visible', timeout });
  }

  async waitForVisible(locator: Locator, timeout?: number) {
    await locator.waitFor({ state: 'visible', ...(timeout && { timeout }) });
  }

  async getText(locator: Locator): Promise<string> {
    const text = await locator.textContent().catch(() => "");
    return text ?? '';
  }
}
