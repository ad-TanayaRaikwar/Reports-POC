import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "../basePage";
export class WebhookEventDetailsPage extends BasePage {
  readonly webhookEventDetailsHeader: Locator;
  readonly URLText: Locator;

  constructor(page: Page) {
    super(page);

    this.webhookEventDetailsHeader = page.getByRole("heading", {
      name: "Webhook Event Details",
      level: 3,
    });
    this.URLText = page.locator(
      "//span[text()='URL']/following-sibling::span//span[@class='cap-ellipsis']"
    );
  }
}
