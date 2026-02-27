import { Page, Locator } from "@playwright/test";
import { BasePage } from "../basePage";
import { CURRENT_ENV } from "../../tests/config/env";
import { CommonUtils } from "../../utils/commonUtils";
import loginData from "../../testData/loginData.json";

// Use environment variable at runtime instead of a missing module import.

export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly logo: Locator;
  readonly forgotPassword: Locator;
  readonly recoverPasswordText: Locator;
  readonly usernameForResetPasswordInput: Locator;
  readonly alertMessage: Locator;
  readonly submitButton: Locator;
  readonly successMessage: Locator;

  readonly url: string;

  constructor(page: Page) {
    super(page);
    this.url = CURRENT_ENV; // use CURRENT_ENV instead of hardcoding

    this.usernameInput = page.locator("#loginUsername");
    this.passwordInput = page.locator("#loginPassword");
    this.loginButton = page.locator("#login-button");
    this.logo = page.locator(`//img[@class='anddone-logo']`);
    this.forgotPassword = page.locator(
      `//a[normalize-space()='Forgot Password?']`,
    );
    this.recoverPasswordText = page.locator(
      `//h5[normalize-space()='Recover Password']`,
    );
    this.usernameForResetPasswordInput = page.locator(
      `//input[@id='userEmail']`,
    );
    this.alertMessage = page.locator(
      `//div[normalize-space()='User Name is invalid']`,
    );
    this.submitButton = page.locator(".button.button-green");
    this.successMessage = page.locator(`#toast-container > div.toast-success`);
  }

  async navigate() {
    await this.navigateTo(this.url);
  }

  async login(username: string, password: string) {
    await this.fill(this.usernameInput, username);
    await this.fill(this.passwordInput, password);
    await this.click(this.loginButton);
    await this.page.waitForTimeout(10000);
    // await this.page.waitForLoadState('networkidle');
  }

  async loginAsAlly() {
    // await this.navigate();
    await this.login(loginData[0].username, loginData[0].password); //both QAt and UAT
  }

  // async loginAsAlly() {
  //   const username = process.env.TEST_USERNAME!;
  //   const password = process.env.TEST_PASSWORD!;

  //   await this.login(username, password);
  // }
  async navigateToForgotPassword() {
    await this.navigateTo(this.url);
    await this.click(this.forgotPassword);
  }
}
