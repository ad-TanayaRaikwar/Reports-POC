import { test, expect, request } from "@playwright/test";
import paymentTestData from "../../testData/Payments/paymentTestdata.json";
import { PaymentWidgetPage } from "../../pages/payments/PaymentWidgetPage";
import { de } from "@faker-js/faker";

test.describe("Payment Widget Tests", () => {
  test.only("Verify Create Payment Token → Open Payment Widget for ACH", async ({
    page,
  }) => {
    const apiContext = await request.newContext({
      baseURL: paymentTestData.baseURL,
      extraHTTPHeaders: {
        ...paymentTestData.headers,
        "Content-Type": paymentTestData.contentType,
      },
    });

    const dynamicTitle = `PlaywrightTitle_${Date.now()}`;
    const randomAmount = Math.floor(Math.random() * (500 - 200 + 1)) + 200;

    const requestBody = {
      ...paymentTestData.requestBody,
      title: dynamicTitle,
      amount: randomAmount,
    };

    const response = await apiContext.post("", { data: requestBody });
    expect(response.status()).toBe(201);

    const data = await response.json();
    const paymentToken = data.paymentToken;

    const finalURL = `${paymentTestData.paymentWidgetURL}${paymentToken}`;
    await page.goto(finalURL);

    const paymentWidgetPage = new PaymentWidgetPage(page);
    await paymentWidgetPage.verifyPageLoaded();

    // 🔽🔽 UI FLOW STARTS HERE 🔽🔽

    await expect(page).toHaveTitle(/AndDone JS/);
    await paymentWidgetPage.fillBankDetails({
      accountHolder: process.env.ACH_ACCOUNT_HOLDER!,
      routingNumber: process.env.ACH_ROUTING_NUMBER!,
      accountNumber: process.env.ACH_ACCOUNT_NUMBER!,
    });

    await page.waitForTimeout(2000);
    await paymentWidgetPage.submitPayment();
    await page.waitForTimeout(5000);
    await expect(paymentWidgetPage.sueccessMessage).toHaveText(
      "Thank you for your payment!",
    );
    console.log("Payment Token:", paymentToken);
    console.log("Amount:", randomAmount);
    console.log("Widget URL:", finalURL);
  });

  test("Verify Create Payment Token → Open Payment Widget for CC", async ({
    page,
  }) => {
    // Test logic for CC
    const apiContext = await request.newContext({
      baseURL: paymentTestData.baseURL,
      extraHTTPHeaders: {
        ...paymentTestData.headers,
        "Content-Type": paymentTestData.contentType,
      },
    });

    const dynamicTitle = `PlaywrightTitle_${Date.now()}`;
    const randomAmount = Math.floor(Math.random() * (500 - 200 + 1)) + 200;

    const requestBody = {
      ...paymentTestData.requestBody,
      title: dynamicTitle,
      amount: randomAmount,
    };

    const response = await apiContext.post("", { data: requestBody });
    expect(response.status()).toBe(201);

    const data = await response.json();
    const paymentToken = data.paymentToken;

    const finalURL = `${paymentTestData.paymentWidgetURL}${paymentToken}`;
    await page.goto(finalURL);
    await page.waitForTimeout(3000);
    const paymentWidgetPage = new PaymentWidgetPage(page);
    await page.waitForTimeout(1000);
    await paymentWidgetPage.verifyPageLoaded();
    await page.waitForTimeout(3000);

    // 🔽🔽 UI FLOW STARTS HERE 🔽🔽

    await expect(page).toHaveTitle(/AndDone JS/);
    await paymentWidgetPage.selectCard();
    await page.waitForTimeout(3000);
    await paymentWidgetPage.fillCCardDetails({
      nameOnCard: process.env.CC_NAME!,
      cardNumber: process.env.CC_NUMBER!,
      expiry: process.env.CC_EXPIRY!,
      cvv: process.env.CC_CVV!,
    });
    await page.waitForTimeout(2000);
    await paymentWidgetPage.billingAddress({
      address: "123 Main St",
      suite: "Apt 1",
      city: "Anytown",
      postalCode: "12345",
    });

    await paymentWidgetPage.submitPayment();
    await page.waitForTimeout(5000);
    await expect(paymentWidgetPage.sueccessMessage).toHaveText(
      "Thank you for your payment!",
    );
    console.log("Payment Token:", paymentToken);
    console.log("Amount:", randomAmount);
    console.log("Widget URL:", finalURL);
  });

  test("Verify Create Payment Token → Open Payment Widget for debit card", async ({
    page,
  }) => {
    // Test logic for CC
    const apiContext = await request.newContext({
      baseURL: paymentTestData.baseURL,
      extraHTTPHeaders: {
        ...paymentTestData.headers,
        "Content-Type": paymentTestData.contentType,
      },
    });

    const dynamicTitle = `PlaywrightTitle_${Date.now()}`;
    const randomAmount = Math.floor(Math.random() * (500 - 200 + 1)) + 200;

    const requestBody = {
      ...paymentTestData.requestBody,
      title: dynamicTitle,
      amount: randomAmount,
    };

    const response = await apiContext.post("", { data: requestBody });
    expect(response.status()).toBe(201);

    const data = await response.json();
    const paymentToken = data.paymentToken;

    const finalURL = `${paymentTestData.paymentWidgetURL}${paymentToken}`;
    await page.goto(finalURL);
    await page.waitForTimeout(3000);
    const paymentWidgetPage = new PaymentWidgetPage(page);
    await page.waitForTimeout(1000);
    await paymentWidgetPage.verifyPageLoaded();
    await page.waitForTimeout(3000);

    // 🔽🔽 UI FLOW STARTS HERE 🔽🔽

    await expect(page).toHaveTitle(/AndDone JS/);
    await paymentWidgetPage.selectCard();
    await page.waitForTimeout(2000);
    await paymentWidgetPage.fillDCardDetails({
      nameOnCard: process.env.DC_NAME!,
      cardNumber: process.env.DC_NUMBER!,
      expiry: process.env.DC_EXPIRY!,
      cvv: process.env.DC_CVV!,
    });

    await page.waitForTimeout(1000);
    await paymentWidgetPage.billingAddress({
      address: "123 Main St",
      suite: "Apt 1",
      city: "Anytown",
      postalCode: "12345",
    });

    await paymentWidgetPage.submitPayment();
    await page.waitForTimeout(5000);
    await expect(paymentWidgetPage.sueccessMessage).toHaveText(
      "Thank you for your payment!",
    );
    console.log("Payment Token:", paymentToken);
    console.log("Amount:", randomAmount);
    console.log("Widget URL:", finalURL);
  });

  test("Verify the validation for alredy used payment token", async ({
    page,
  }) => {
    const paymentWidgetPage = new PaymentWidgetPage(page);
    await page.waitForTimeout(2000);
    await page.goto("https://paymentwidget.qat.anddone.com/?token=DxLkeK6v");

    await expect(page).toHaveTitle(/AndDone JS/);
    await expect(paymentWidgetPage.alreadyProcessedMessage).toBeVisible({
      timeout: 9000,
    });
    await page.waitForTimeout(5000);
    console.log(
      "Alert Message:",
      await paymentWidgetPage.alreadyProcessedMessage.textContent(),
    );
  });

  //test
});
