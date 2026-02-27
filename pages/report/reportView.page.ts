import { Page, Locator, expect } from "@playwright/test";
import { CommonUtils } from "../../utils/commonUtils";

import { BasePage } from "../basePage";

import fs from "fs";
import path from "path";

export class ReportViewPage extends BasePage {
  readonly page: Page;
  readonly utils: CommonUtils;

  readonly reportTitle: Locator;
  readonly cardsContainer: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.utils = new CommonUtils(page);
    this.reportTitle = page.getByRole("heading", { name: "Ally Reporting" });
    this.cardsContainer = page.locator(".cards-container");
  }

  async validateReportViewPageLoaded() {
    await this.waitForVisible(this.reportTitle, 10000);
    await expect(this.reportTitle).toHaveText("Ally Reporting");

    await this.waitForVisible(this.cardsContainer, 10000);
    await expect(this.cardsContainer).toBeVisible();

    const reportCards = this.cardsContainer.locator(".report-card");
    await expect(reportCards.first()).toBeVisible();
    const cards = this.cardsContainer.locator(".report-card");
    const count = await cards.count();

    console.log(`Total report cards loaded: ${count}`);

    for (let i = 0; i < count; i++) {
      const text = await cards.nth(i).innerText();
      console.log(`Card ${i + 1}:`, text);
    }
  }

  // async validateEachReportCard() {
  //   const loader = this.page.getByRole("heading", {
  //     name: "Loading...",
  //     level: 5,
  //   });

  //   // Wait for loader to disappear first
  //   await loader.waitFor({ state: "hidden" });

  //   // Wait for cards container to be visible
  //   await this.cardsContainer.waitFor({ state: "visible" });

  //   // Wait for at least one card to be visible
  //   const firstCard = this.cardsContainer.locator(".report-card").first();
  //   await firstCard.waitFor({ state: "visible" });

  //   // Now safely capture all card titles
  //   const cardTitles = await this.cardsContainer
  //     .locator(".report-card .card-title")
  //     .allTextContents();

  //   expect(cardTitles.length).toBeGreaterThan(0);

  //   for (const cardTitle of cardTitles) {
  //     console.log(`Validating card: ${cardTitle}`);

  //     // Re-locate card fresh after navigation
  //     const card = this.cardsContainer
  //       .locator(".report-card", { hasText: cardTitle })
  //       .first();

  //     await card.waitFor({ state: "visible" });
  //     await card.click();

  //     // Wait for report header
  //     const reportHeader = this.page.getByRole("heading", { name: cardTitle });
  //     await reportHeader.waitFor({ state: "visible" });

  //     // Wait for table or empty state
  //     await this.page.waitForFunction(
  //       () =>
  //         document.querySelector(".table-container") ||
  //         document.body.innerText.includes("No Results Found"),
  //     );

  //     // Navigate back to cards view
  //     // Navigate back to cards view
  //     await this.page.click('a[href="#/ally/reports"]');

  //     // Wait for loader to appear (optional, ensures SPA started loading)
  //     await loader
  //       .waitFor({ state: "visible", timeout: 9000 })
  //       .catch(() => null);

  //     // Wait for loader to disappear
  //     await loader.waitFor({ state: "hidden" });

  //     // Wait for cards container to be visible
  //     await this.cardsContainer.waitFor({ state: "visible" });
  //   }
  // }

  async validateSingleReportCard(cardName: string) {
    // Wait for cards container
    await this.cardsContainer.waitFor({ state: "visible", timeout: 10000 });

    // Locate card by its title and ensure it is visible
    const card = this.cardsContainer
      .locator(".report-card", { hasText: cardName })
      .first();

    await card.waitFor({ state: "visible", timeout: 10000 });

    // Click the card
    await card.click();

    // Validate report page header
    const reportHeader = this.page.getByRole("heading", { name: cardName });
    await reportHeader.waitFor({ state: "visible", timeout: 10000 });

    console.log(`Report for ${cardName} is displayed correctly.`);
  }

  async waitForReportTableToLoad() {
    const loader = this.page.getByRole("img", { name: "placeholder" });
    const reportTable = this.page.locator(".table-container");

    // Loader may appear briefly or not at all
    await loader.waitFor({ state: "hidden", timeout: 20000 }).catch(() => null);

    // Ensure table shell is visible
    await reportTable.waitFor({ state: "visible", timeout: 10000 });
  }

  async downloadFirstReport(): Promise<string | null> {
    const noResultsText = this.page.getByRole("heading", {
      name: "No Results Found",
    });

    await this.waitForReportTableToLoad();

    // Empty state
    if (await noResultsText.isVisible().catch(() => false)) {
      console.log("No results found. No reports available to download.");
      return null;
    }

    const reportTable = this.page.locator(".table-container");
    const dataRows = reportTable.locator("tbody tr");

    const rowCount = await dataRows.count();
    if (rowCount === 0) {
      console.log("Table loaded but no generated reports yet.");
      return null;
    }

    const downloadButton = dataRows.first().locator(".download-report");

    await downloadButton.waitFor({ state: "visible", timeout: 10000 });

    const downloadDir = path.join(process.cwd(), "downloads");
    if (!fs.existsSync(downloadDir)) {
      fs.mkdirSync(downloadDir);
    }

    const [download] = await Promise.all([
      this.page.waitForEvent("download"),
      downloadButton.click(),
    ]);

    const filePath = path.join(downloadDir, await download.suggestedFilename());
    await download.saveAs(filePath);

    console.log(`Downloaded to: ${filePath}`);
    return filePath;
  }
}
