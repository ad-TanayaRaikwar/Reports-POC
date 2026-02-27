import { defineConfig, devices } from "@playwright/test";
import { OrtoniReportConfig } from "ortoni-report";
import dotenv from "dotenv";
import * as os from "os";
dotenv.config();
const reportConfig: OrtoniReportConfig = {
  open: process.env.CI ? "never" : "always",
  folderPath: "my-report",
  filename: "Ally_Portal.html",
  title: "Ally Portal UI Test Report",
  showProject: false,
  projectName: "Ally Portal",
  testType: "E2E-Functional",

  authorName: os.userInfo().username,
  base64Image: false,

  // Branding
  // logo: "AndDone.png",
  headerText: "Ally Portal UI Automation Report", // custom property
  //customCss: "custom.css",
  logo: "./assets/AllyLogoDark.svg",

  // Enables clickable dashboard
  stdIO: false,

  meta: {
    "Test Cycle": "AN_ALMGMT_V14",
    // Environment: process.env.NODE_ENV || "QAT",
    "Executed On": new Date().toLocaleString(),
    version: "1",
    release: "V14",
    platform: os.type(),
  },
} as any; // <-- bypass TypeScript type checking for headerText

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 3 : undefined,
  // Required for Ortoni to read test artifacts
  outputDir: "test-results",

  //  Existing HTML report + Allure added
  reporter: [
    ["ortoni-report", reportConfig],
    ["html"],
    ['allure-playwright']
    // existing
  ],

  use: {
    trace: "on-first-retry",
    viewport: null,
    // optional but useful for Allure:
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  projects: [
    {
      name: "Ally_chromium",
      use: {
        ...devices["Desktop Chrome"],
        viewport: null,
        deviceScaleFactor: undefined,
        launchOptions: {
          args: ["--start-maximized"],
        },
      },
    },

    //    {
    //     name: 'Mobile Safari',
    //     use: {
    //       ...devices['iPhone 13'],
    //     },
    //   },
    // {
    //   name: 'Mobile Chrome (Pixel 5)',
    //   use: {
    //     ...devices['Pixel 5'], // Emulates a Pixel 5 with Chrome
    //   },
    // },

    // Edge project kept commented as you had it
    // {
    //   name: 'Microsoft Edge',
    //   use: {
    //     ...devices['Desktop Edge'],
    //     channel: 'msedge',
    //     viewport: null,
    //     deviceScaleFactor: undefined,
    //     launchOptions: {
    //       args: ['--start-maximized'],
    //     },
    //   },
    // },
  ],
});
