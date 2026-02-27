import { test, expect } from '@playwright/test';
import { WebhookPage } from '../../pages/webhook/webhookPage';
import { CURRENT_ENV } from '../../tests/config/env';
import { CommonUtils } from '../../utils/commonUtils';
import { SideMenuPage } from '../../pages/SideMenuPage';
import { LoginPage } from '../../pages/login/loginPage';
import { WebhookEventPage } from '../../pages/webhook/webhookEventPage';

test.describe("Add ally webhook tests", () => {
  let sideMenuPage: SideMenuPage;
  let loginPage: LoginPage;
  let commonUtils: CommonUtils;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    sideMenuPage = new SideMenuPage(page);
    commonUtils = new CommonUtils(page);

    // Login and open "Webhooks" page
    await loginPage.navigateTo(CURRENT_ENV);
    await loginPage.loginAsAlly();
    await sideMenuPage.openWebhooks();
  });

  test.only('Add new webhook with dynamic URL and select modules', async ({ page }) => {

    
    const webhookPage = new WebhookPage(page);
    await webhookPage.addWebhookBtn.waitFor({ state: 'visible', timeout: 90000 });
    await webhookPage.addWebhookBtn.click();
    // Already on Webhooks page — no navigate()
    await webhookPage.setWebhookUrl();                 // Auto-generated URL
    await webhookPage.selectModules('Transaction');    // Select module(s)

    // Select version
    // await webhookPage.versionDropdown.click();
    // await webhookPage.selectVersion("1");

    // // await webhookPage.versionDropdown.waitFor({ state: 'visible', timeout: 10000 });
    await expect(webhookPage.versionDropdown).toBeVisible();
    // await page.getByLabel('Version').selectOption('1');
    await webhookPage.versionDropdown.selectOption('1');
    // Select by value
//   await page.waitForSelector('select[formcontrolname="Version"] option[value="1"]', { timeout: 10000 });
//   // await expect(webhookPage.versionDropdown).toBeVisible();
// await page.selectOption('select[formcontrolname="Version"]', '1');
    

    // Save
    await webhookPage.saveButton.click();

    // Verify success message
    await webhookPage.successMessage.waitFor({ state: 'visible', timeout: 15000 });

    const successText = await webhookPage.successMessage.textContent();
    console.log('Webhook added:', successText);
  });

 test('Validate duplicate module + URL error', async ({ page }) => {
  const webhookPage = new WebhookPage(page);

  const duplicateUrl = "https://eop9lz8v5k7u4lo.m.pipedream.net";
  await webhookPage.addWebhookBtn.waitFor({ state: 'visible', timeout: 90000 });
  await webhookPage.addWebhookBtn.click();
  await webhookPage.setWebhookUrl(duplicateUrl);
  await webhookPage.selectModules('Transaction');


   // Select version
  await webhookPage.versionDropdown.click();
  // await page.waitForTimeout(1000); // Wait for options to load
  await expect(webhookPage.versionDropdown).toBeVisible({ timeout: 10000 });
  await webhookPage.versionDropdown.selectOption("1");
  // await webhookPage.selectVersion("1");
  await webhookPage.saveButton.click();
  const errorMessage = webhookPage.duplicateErrorMessage;
  await errorMessage.waitFor({ state: 'visible', timeout: 15000 });

  const errorText = await errorMessage.textContent();
  console.log('Duplicate error message:', errorText);
}  )

  test("Add webhook with multiple modules selected", async ({ page }) => {
    const webhookPage = new WebhookPage(page);

    await webhookPage.addWebhookBtn.waitFor({
      state: "visible",
      timeout: 90000,
    });
    await webhookPage.addWebhookBtn.click();

    // Auto-generate URL
    await webhookPage.setWebhookUrl();

    // Select multiple modules
    await webhookPage.selectModules("Report", "Transaction");

    // Select version 1
    await webhookPage.versionDropdown.click();
    await expect(webhookPage.versionDropdown).toBeVisible({ timeout: 10000 });
    await webhookPage.versionDropdown.selectOption("1");
    // await webhookPage.selectVersion("1");

    // Save webhook
    await webhookPage.saveButton.click();

    // Validate success message
    await webhookPage.successMessage.waitFor({
      state: "visible",
      timeout: 15000,
    });

    const successText = await webhookPage.successMessage.textContent();
    console.log("Webhook added:", successText);
  });

  test("Verify that webhook is deleted on Webhooks page", async ({
    page,
  }) => {
    const webhookPage = new WebhookPage(page);

    await webhookPage.webhooksHeader.waitFor({
      state: "visible",
      timeout: 15000,
    });
    await expect(webhookPage.webhooksHeader).toBeVisible({
      timeout: 15000,
    });
    await page.waitForTimeout(5000);
    await webhookPage.ellipsisButton.click();
    await page.waitForTimeout(3000);
    await expect(webhookPage.deleteOption).toBeVisible({ timeout: 15000 });
    await webhookPage.deleteOption.click();
    await page.waitForTimeout(2000);
    await expect(webhookPage.deleteMessage).toBeVisible({ timeout: 15000 });
  });

  test("Verify that clicking on view logs option on Webhooks page", async ({
    page,
  }) => {
    const webhookPage = new WebhookPage(page);
    const webhookEventPage = new WebhookEventPage(page);
    await webhookPage.webhooksHeader.waitFor({
      state: "visible",
      timeout: 15000,
    });
    await expect(webhookPage.webhooksHeader).toBeVisible({
      timeout: 15000,
    });
    await page.waitForTimeout(5000);
    await webhookPage.ellipsisButton.click();
    await page.waitForTimeout(2000);
    await expect(webhookPage.viewLogsOption).toBeVisible({ timeout: 15000 });
    await webhookPage.viewLogsOption.click();
    await page.waitForTimeout(1000);
    await webhookEventPage.validateWebhookEventsPageLoaded();
  });
});


// import { test, expect } from '@playwright/test';

// test('test', async ({ page }) => {
//   await page.goto('https://ally.qat.anddone.com/#/login');
//   await page.getByRole('textbox', { name: '* Username' }).click();
//   await page.getByRole('textbox', { name: '* Username' }).fill('AlexSmith');
//   await page.getByRole('textbox', { name: '* Username' }).click();
//   await page.getByRole('textbox', { name: '* Username' }).fill('AlexSmith4889');
//   await page.getByRole('textbox', { name: '* Password' }).click();
//   await page.getByRole('textbox', { name: '* Password' }).fill('123#Qwertyuiop');
//   await page.locator('#login-button').click();
//   await page.getByRole('link', { name: 'Webhooks Webhooks' }).click();
//   await page.getByText(' Add Webhook').click();
//   await page.getByRole('textbox', { name: '* URL' }).click();
//   await page.getByRole('textbox', { name: '* URL' }).click();
//   await page.getByRole('textbox', { name: '* URL' }).click();
//   await page.getByRole('textbox', { name: '* URL' }).click();
//   await page.getByRole('textbox', { name: '* URL' }).fill('https://webhook-test.com/123');
//   await page.getByRole('button', { name: '* Select Modules ' }).click();
//   await page.getByRole('listitem').filter({ hasText: 'Transaction' }).click();
//   await page.getByLabel('Version').selectOption('1');
//   await page.getByRole('button', { name: 'Save' }).click();
// });