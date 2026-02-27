import { test, expect } from "@playwright/test";
import assert from "assert";

import { PaymentsPage } from "../../pages/payments/paymentsPage";
import { WebhookEventPage } from "../../pages/webhook/webhookEventPage";
import { endToendPayments } from "../../pages/webhook/endToendPayments";
import { SideMenuPage } from "../../pages/SideMenuPage";
import { LoginPage } from "../../pages/login/loginPage";
import { CommonUtils } from "../../utils/commonUtils";
import { CURRENT_ENV } from "../../tests/config/env";

import {
  AdminPaymentPage,
  AdminHomePage,
  AdminLoginPage,
} from "@anddone/adminportaltestautomation";

test("End-to-end validation of payment processing through webhook and admin panel", async ({
  page,
}) => {
  test.setTimeout(120_000);

  // --------------------
  // ALLY PORTAL
  // --------------------
  const loginPage = new LoginPage(page);
  const sideMenuPage = new SideMenuPage(page);
  const paymentsPage = new PaymentsPage(page);
  const commonUtils = new CommonUtils(page);

  await loginPage.navigateTo(CURRENT_ENV);
  await loginPage.loginAsAlly();
  await sideMenuPage.openPayments();

  await paymentsPage.validatePaymentsPageLoaded();

  const paymentTxnId = await paymentsPage.saveFirstTransactionId();

  expect(paymentTxnId, "Payment Transaction ID was not captured").toBeTruthy();

  console.log(" Payment Transaction ID:", paymentTxnId);

  // --------------------
  // WEBHOOK VALIDATION
  // --------------------
  const webhooksEventPage = new WebhookEventPage(page);
  const endToendPaymentsPage = new endToendPayments(page);

  await sideMenuPage.openWebhookEventLogs();
  await webhooksEventPage.validateWebhookEventsPageLoaded();

  let matched = false;
  let startIndex = 0;

  while (true) {
    const clickedIndex =
      await webhooksEventPage.openNextTransactionSuccessWebhook(startIndex);

    if (clickedIndex === null) break;

    await page.waitForTimeout(2000);

    const webhookTxnId = await endToendPaymentsPage.getTransactionId();
    console.log(`Webhook Transaction ID (row ${clickedIndex}):`, webhookTxnId);

    if (webhookTxnId === paymentTxnId) {
      matched = true;
      console.log("Webhook match found:", webhookTxnId);
      break;
    }

    await page.goBack();
    await webhooksEventPage.waitForTableReload();
    startIndex = clickedIndex + 1;
  }

  expect(
    matched,
    `No matching webhook found for Transaction ID: ${paymentTxnId}`,
  ).toBeTruthy();

  // --------------------
  // ADMIN PORTAL
  // --------------------
  await page.goto("https://admin.qat.anddone.com/#/login");

  const adminLoginPage = new AdminLoginPage(page);
  await adminLoginPage.login("SiddheshwarQAT", "666#Qwertyuiop");
  await page.waitForTimeout(2000);
  const adminHomePage = new AdminHomePage(page);
  await adminHomePage.assertLogoIsVisible();
  await adminHomePage.clickPaymentsNav();

  const adminPaymentPage = new AdminPaymentPage(page);
  await adminPaymentPage.waitForPageLoad();

  await adminPaymentPage.searchAndSelectMerchantByReference(paymentTxnId);
  await page.waitForTimeout(2000);
  const transactionDetailsObject =
    await adminPaymentPage.getTransactionDetailsAsObject();

  console.log("Admin Transaction Details:", transactionDetailsObject);

  assert.strictEqual(
    transactionDetailsObject["Transaction ID"],
    paymentTxnId,
    "Transaction ID does not match expected value",
  );
});
