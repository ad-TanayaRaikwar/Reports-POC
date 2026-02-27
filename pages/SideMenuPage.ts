import { Page, Locator } from "@playwright/test";
import { CommonUtils } from "../utils/commonUtils";
import { th } from "@faker-js/faker";

export class SideMenuPage {
  readonly page: Page;
  readonly utils: CommonUtils;

  readonly usersMenu: Locator;
  readonly paymentsMenu: Locator;
  readonly reportsMenu: Locator;
  readonly webhooksMenu: Locator;
  readonly webhookEventLogsMenu: Locator;
  readonly profileMenu: Locator;

  constructor(page: Page) {
    this.page = page;
    this.utils = new CommonUtils(page); //

    this.usersMenu = page.getByRole("link", { name: "Users" });
    this.paymentsMenu = page.getByRole("link", { name: "Payments" });
    this.reportsMenu = page.getByRole("link", { name: "Reporting" });
    this.webhooksMenu = page.getByText("Webhooks", { exact: true }).first();
    this.webhookEventLogsMenu = page.getByRole("link", {
      name: "Webhook Events",
    });
    this.profileMenu = page.locator("p.profile-name");
  }

  private async delay() {
    await this.page.waitForTimeout(1000); // 3 sec
  }
  async openUsers() {
    await this.utils.click(this.usersMenu);
    await this.delay(); // now works
  }

  async openPayments() {
    await this.utils.click(this.paymentsMenu);
    await this.page.waitForTimeout(1000);
    //await this.delay();
  }
  async openReports() {
    await this.utils.click(this.reportsMenu);
    await this.page.waitForTimeout(1000);
  }

  async openWebhooks() {
    await this.utils.click(this.webhooksMenu);
    await this.page.waitForTimeout(1000);
  }
  async openWebhookEventLogs() {
    await this.utils.click(this.webhookEventLogsMenu);
    await this.page.waitForTimeout(3000);
  }
  async openProfile() {
    await this.utils.click(this.profileMenu);
  }
}
