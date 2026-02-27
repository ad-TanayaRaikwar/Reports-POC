import { test, expect } from "@playwright/test";
import { CURRENT_ENV } from "../config/env";
import { SideMenuPage } from "../../pages/SideMenuPage";
import { LoginPage } from "../../pages/login/loginPage";
import { AddUserPage } from "../../pages/users/addUserPage";
import fs from "fs";
import { CommonUtils } from "../../utils/commonUtils";
import { ReportViewPage } from "../../pages/report/reportView.page";

test.describe("Report Cards Tests", () => {
  let sideMenuPage: SideMenuPage;
  let loginPage: LoginPage;
  let commonUtils: CommonUtils;
  let reportViewPage: ReportViewPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    sideMenuPage = new SideMenuPage(page);
    commonUtils = new CommonUtils(page);
    reportViewPage = new ReportViewPage(page);

    await loginPage.navigateTo(CURRENT_ENV);
    await loginPage.loginAsAlly();
    await sideMenuPage.openReports();
    test.setTimeout(60000);
  });

  test("Verify that the report view page loads correctly with all report cards visible. @smoke @regression", async ({
    page,
  }) => {
    await reportViewPage.validateReportViewPageLoaded();
  });

  test("Verify Daily Authorization Report display and download functionality @regression @smoke", async ({
    page,
  }) => {
    const cardName = "Daily Authorization Report";
    await reportViewPage.validateSingleReportCard(cardName);

    const filePath = await reportViewPage.downloadFirstReport();

    if (filePath) {
      expect(fs.existsSync(filePath)).toBeTruthy();
      console.log("Report downloaded successfully.");
    } else {
      console.log("No report available. Download skipped.");
    }
  });

  test("Verify Daily Settlement Report display and download functionality @regression", async ({
    page,
  }) => {
    const cardName = "Daily Settlement Report";
    await reportViewPage.validateSingleReportCard(cardName);

    const filePath = await reportViewPage.downloadFirstReport();

    if (filePath) {
      expect(fs.existsSync(filePath)).toBeTruthy();
      console.log("Report downloaded successfully.");
    } else {
      console.log("No report available. Download skipped.");
    }
  });

  test("Verify Daily Refund Report display and download functionality @regression @smoke", async ({
    page,
  }) => {
    const cardName = "Daily Refund Report";
    await reportViewPage.validateSingleReportCard(cardName);

    const filePath = await reportViewPage.downloadFirstReport();

    if (filePath) {
      expect(fs.existsSync(filePath)).toBeTruthy();
      console.log("Report downloaded successfully.");
    } else {
      console.log("No report available. Download skipped.");
    }
  });

  test("Verify Daily Chargeback Report display and download functionality @regression", async ({
    page,
  }) => {
    const cardName = "Daily Chargeback Report";
    await reportViewPage.validateSingleReportCard(cardName);

    const filePath = await reportViewPage.downloadFirstReport();

    if (filePath) {
      expect(fs.existsSync(filePath)).toBeTruthy();
      console.log("Report downloaded successfully.");
    } else {
      console.log("No report available. Download skipped.");
    }
  });

  test("Verify Daily NACHA Chargebacks Report display and download functionality @regression", async ({
    page,
  }) => {
    const cardName = "Daily NACHA Chargebacks Report";
    await reportViewPage.validateSingleReportCard(cardName);

    const filePath = await reportViewPage.downloadFirstReport();

    if (filePath) {
      expect(fs.existsSync(filePath)).toBeTruthy();
      console.log("Report downloaded successfully.");
    } else {
      console.log("No report available. Download skipped.");
    }
  });

  test("Verify Daily NACHA Excluded Transaction Report display and download functionality @regression", async ({
    page,
  }) => {
    const cardName = "Daily NACHA Excluded Transaction Report";
    await reportViewPage.validateSingleReportCard(cardName);

    const filePath = await reportViewPage.downloadFirstReport();

    if (filePath) {
      expect(fs.existsSync(filePath)).toBeTruthy();
      console.log("Report downloaded successfully.");
    } else {
      console.log("No report available. Download skipped.");
    }
  });

  test("Verify Daily NACHA Transactions Report display and download functionality @regression @smoke", async ({
    page,
  }) => {
    const cardName = "Daily NACHA Transactions Report";
    await reportViewPage.validateSingleReportCard(cardName);

    const filePath = await reportViewPage.downloadFirstReport();

    if (filePath) {
      expect(fs.existsSync(filePath)).toBeTruthy();
      console.log("Report downloaded successfully.");
    } else {
      console.log("No report available. Download skipped.");
    }
  });

  test("Verify Monthly Profitability Report display and download functionality @regression @smoke", async ({
    page,
  }) => {
    const cardName = "Monthly Profitability Report";
    await reportViewPage.validateSingleReportCard(cardName);

    const filePath = await reportViewPage.downloadFirstReport();

    if (filePath) {
      expect(fs.existsSync(filePath)).toBeTruthy();
      console.log("Report downloaded successfully.");
    } else {
      console.log("No report available. Download skipped.");
    }
  });
});
