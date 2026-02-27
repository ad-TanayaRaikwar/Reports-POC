import { test, expect } from "@playwright/test";
import { PaymentsPage } from "../../pages/payments/paymentsPage";
import { CURRENT_ENV } from "../../tests/config/env";
import { SideMenuPage } from "../../pages/SideMenuPage";
import { LoginPage } from "../../pages/login/loginPage";
import { CommonUtils } from "../../utils/commonUtils";
import { log } from "console";
import loginData from "../../testData/loginData.json";
import { RefundTestData } from "../../testData/testDataTypes";
import refundData from "../../testData/refundData.json";

test.describe("Payments Module", () => {
  let loginPage: LoginPage;
  let sideMenuPage: SideMenuPage;
  let paymentsPage: PaymentsPage;
  let commonUtils: CommonUtils;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    sideMenuPage = new SideMenuPage(page);
    paymentsPage = new PaymentsPage(page);
    commonUtils = new CommonUtils(page);

    // Login and navigate to Payments page
    await loginPage.navigateTo(CURRENT_ENV);
    await loginPage.loginAsAlly();
    await sideMenuPage.openPayments();
  });

  // tests cases start here//

  test("Validate Payments Page Loads Correctly @smoke @regression", async ({
    page,
  }) => {
    await paymentsPage.validatePaymentsPageLoaded();
  });

  test("Verify Search Functionality @smoke @regression", async ({ page }) => {
    await paymentsPage.validatePaymentsPageLoaded();

    const text = "reference"; // Example transaction

    // Perform search
    await paymentsPage.searchTransaction(text);

    // Wait for at least one row that matches the search text to appear
    const filteredRow = paymentsPage.resultsRows
      .filter({ hasText: text })
      .first();
    await filteredRow.waitFor({ state: "visible", timeout: 30000 });

    // Validate that search results contain the text
    await paymentsPage.validateSearchResultsContain(text);
  });

  test(" Validate Transaction Count is Visible @regression", async ({
    page,
  }) => {
    await paymentsPage.validatePaymentsPageLoaded();
    await page.waitForTimeout(3000);
    await paymentsPage.validateTransactionCountVisible();
  });

  test(" Validate Payments Table Header Names @regression", async ({
    page,
  }) => {
    await paymentsPage.validatePaymentsPageLoaded();
    await paymentsPage.validatePaymentSTableHeaderName();
  });

  test(" Validate Items Per Page Options @regression", async ({ page }) => {
    await paymentsPage.validatePaymentsPageLoaded();
    await page.waitForTimeout(1000);
    await paymentsPage.validateItemsPerPageOptions();
  });
  test("Validate the invalid search shows no results @regression", async ({
    page,
  }) => {
    await paymentsPage.validatePaymentsPageLoaded();
    // Ensure search input is visible then perform invalid search
    await paymentsPage.utils.waitForVisible(paymentsPage.searchInput, 5000);
    await page.waitForTimeout(3000);
    const text = "invalid-transaction-id-12345"; // Example invalid transaction ID

    await paymentsPage.searchTransaction(text);
    // Give the UI time to process and display "No Results Found"
    await page.waitForTimeout(2000);
    await paymentsPage.validateNoSearchResults();
  });

  test("Validate sorting for Payments Table columns @regression", async ({
    page,
  }) => {
    await paymentsPage.validatePaymentsPageLoaded();
    await page.setDefaultTimeout(30000);

    // Wait for header and first column cells to be visible instead of blind sleep
    await paymentsPage.utils.waitForVisible(paymentsPage.headerDBAName, 80000);
    await paymentsPage.utils.waitForVisible(
      paymentsPage.colDBAName.first(),
      80000,
    );
    await paymentsPage.validateSorting(
      paymentsPage.headerDBAName,
      paymentsPage.colDBAName,
    );

    // Ensure table settled before re-sorting

    await page.setDefaultTimeout(40000);
    await paymentsPage.utils.waitForVisible(
      paymentsPage.colDBAName.first(),
      40000,
    );
    await page.waitForTimeout(2000);
    await paymentsPage.validateSorting(
      paymentsPage.headerDBAName,
      paymentsPage.colDBAName,
    );
  });

  //await paymentsPage.validateSearchResultStatus(searchResult);
  test("Validate that the Ally is able to see all refund transactions associated with the original transaction ID @regression", async ({
    page,
  }) => {
    //const Tid = 'c39140e1-fc9c-4177-8b60-4b0332a79348';

    const Tid = "3440c6f2-68ee-4e99-95d1-10aaa471509c";
    // Navigate to login and sign in with provided credentials
    // await loginPage.navigateTo(CURRENT_ENV);

    // await loginPage.loginAsAlly();

    // Verify Users page is displayed (side menu Users link visible)
    await sideMenuPage.utils.waitForVisible(sideMenuPage.usersMenu, 10000);
    await expect(sideMenuPage.usersMenu).toBeVisible();

    await page.waitForTimeout(1000);

    // Open Payments from side menu
    await sideMenuPage.openPayments();
    await paymentsPage.validatePaymentsPageLoaded();

    // Search for the ID and validate results
    await paymentsPage.searchTransaction(Tid);

    await page.waitForTimeout(2000);
    // searchTransaction already waits for results, no additional sleep needed
    await paymentsPage.validateSearchResultsContain(Tid);
    await page.waitForTimeout(2000);

    // Find the row that contains the ID
    const matchedRow = paymentsPage.resultsRows
      .filter({ hasText: Tid })
      .first();
    await matchedRow.waitFor({ state: "visible", timeout: 30000 });

    // Click the 'Status' cell (status is expected in the 10th column / index 9)
    const statusCell = matchedRow.locator("td").nth(9);
    await statusCell.waitFor({ state: "visible", timeout: 10000 });
    await expect(statusCell).toContainText("Refunded");
    await statusCell.click();
  });
});
