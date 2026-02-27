import { test, expect } from "@playwright/test";
import { CURRENT_ENV } from "../../tests/config/env";
import { CommonUtils } from "../../utils/commonUtils";
import { SideMenuPage } from "../../pages/SideMenuPage";
import { LoginPage } from "../../pages/login/loginPage";
import { WebhookEventPage } from "../../pages/webhook/webhookEventPage";
import { WebhookEventDetailsPage } from "../../pages/webhook/webhookEventDetailsPage";

test.describe("Webhook events logs page", () => {
  let sideMenuPage: SideMenuPage;
  let loginPage: LoginPage;
  let commonUtils: CommonUtils;
  let webhookEventPage: WebhookEventPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    sideMenuPage = new SideMenuPage(page);
    commonUtils = new CommonUtils(page);
    webhookEventPage = new WebhookEventPage(page);

    // Login and open "Webhooks Events Logs" page
    await loginPage.navigateTo(CURRENT_ENV);
    await loginPage.loginAsAlly();
    await sideMenuPage.openWebhookEventLogs();
  });

  test("Validate Webhook events logs page loads correctly @smoke @regression", async ({
    page,
  }) => {
    await webhookEventPage.validateWebhookEventsPageLoaded();
  });

  test(" Validate Webhook Events Table Header Names @regression", async ({
    page,
  }) => {
    await webhookEventPage.validateWebhookEventsPageLoaded();
    await webhookEventPage.validateWebhookEventsTableHeaderName();
  });

  // Sorting

  test("Validate sorting for Webhook Events Table columns @regression", async ({
    page,
  }) => {
    await webhookEventPage.validateWebhookEventsPageLoaded();
    await page.setDefaultTimeout(30000);

    // Wait for header and first column cells to be visible instead of blind sleep
    await webhookEventPage.utils.waitForVisible(
      webhookEventPage.headerURL,
      80000
    );
    await webhookEventPage.utils.waitForVisible(
      webhookEventPage.colURL.first(),
      80000
    );
    await webhookEventPage.validateSorting(
      webhookEventPage.headerURL,
      webhookEventPage.colURL
    );

    // Ensure table settled before re-sorting

    await page.setDefaultTimeout(30000);
    await webhookEventPage.utils.waitForVisible(
      webhookEventPage.colURL.first(),
      10000
    );
    await webhookEventPage.validateSorting(
      webhookEventPage.headerURL,
      webhookEventPage.colURL
    );
  });

  //Items per page

  test(" Validate Items Per Page Options @regression", async ({ page }) => {
    await webhookEventPage.validateWebhookEventsPageLoaded();
    await webhookEventPage.validateItemsPerPageOptions();
  });

  //Actions

  test("Verify that clicking on retrigger action on Webhook Events page @smoke", async ({
    page,
  }) => {
    const webhookEventPage = new WebhookEventPage(page);
    await webhookEventPage.validateWebhookEventsPageLoaded();
    await page.waitForTimeout(5000);
    await webhookEventPage.ellipsisButton.click();
    await page.waitForTimeout(5000);
    await expect(webhookEventPage.actionsMenu).toBeVisible({ timeout: 15000 });
    await webhookEventPage.retriggerOption.click();
    await page.waitForTimeout(2000);
    await expect(webhookEventPage.retriggerMessage).toBeVisible({
      timeout: 15000,
    });
  });

  test("Verify that clicking on view action on Webhook Events page @smoke", async ({
    page,
  }) => {
    const webhookEventPage = new WebhookEventPage(page);
    const webhookEventDetailsPage = new WebhookEventDetailsPage(page);
    await webhookEventPage.validateWebhookEventsPageLoaded();
    await page.waitForTimeout(5000);

    const urlBefore = (await webhookEventPage.URLText.innerText()).trim();
    console.log("URL before clicking view:", urlBefore);

    await webhookEventPage.ellipsisButton.click();
    await expect(webhookEventPage.actionsMenu).toBeVisible({ timeout: 15000 });
    await page.waitForTimeout(2000);
    await webhookEventPage.viewOption.click();
    await webhookEventPage.waitForLoaderToDisappear();
    await page.waitForTimeout(2000);
    await expect(webhookEventDetailsPage.webhookEventDetailsHeader).toBeVisible(
      { timeout: 15000 }
    );

    const urlOnDetailsPage = (
      await webhookEventDetailsPage.URLText.innerText()
    ).trim();
    console.log("URL after clicking view:", urlOnDetailsPage);
    expect(urlOnDetailsPage).toBe(urlBefore);
  });
});
