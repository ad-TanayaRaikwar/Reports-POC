import { test, expect } from "@playwright/test";
//import { test, expect } from '../../utils/Wrapper/customTest';
import { LoginPage } from "../../pages/login/loginPage";
import loginData from "../../testData/loginData.json";

test.describe("Login Module", () => {
  test("Login with valid credentials @smoke @regression", async ({ page }) => {
    //test.setTimeout(70000);

    const loginPage = new LoginPage(page); //test

    await loginPage.navigate();
    await loginPage.loginAsAlly(); //loginmethod called here

    const usersHeader = page.locator("//h3[normalize-space()='Users']");
    await expect(usersHeader).toBeVisible({ timeout: 15000 });
    await expect(usersHeader).toHaveText("Users");
  });

  // Negative test - invalid credentials (Regression)
  test("Login with invalid credentials @regression", async ({ page }) => {
    test.setTimeout(60000); // Entire test timeout

    const loginPage = new LoginPage(page);

    // Navigate to login page (QA or UAT)
    await loginPage.navigate();

    // Perform login with wrong credentials
    //await loginPage.login('invalidUser', 'wrongPass');
    await loginPage.login(loginData[1].username, loginData[1].password);

    // Validate error alert
    const errorAlert = page.locator(
      "//div[@role='alert' and @aria-label='We could not log you in. Please check your credentials and try again.']",
    );

    await expect(errorAlert).toBeVisible({ timeout: 15000 });
    await expect(errorAlert).toHaveText(
      "We could not log you in. Please check your credentials and try again.",
    );
  });

  test("Verify that logo is present on login page", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await expect(loginPage.logo).toBeVisible({ timeout: 15000 });
  });

  test("Verify that clicking on forgot password navigates to recover password pop up", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateToForgotPassword();
    await expect(loginPage.recoverPasswordText).toBeVisible({
      timeout: 15000,
    });
  });

  test.skip("Verify that user is able to reset password successfully", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateToForgotPassword();
    await loginPage.usernameForResetPasswordInput.fill(loginData[2].username);
    await loginPage.submitButton.click();
    await expect(loginPage.successMessage).toBeVisible({ timeout: 15000 });
  });

  test.skip("Verify that entering invalid username gives alert message on forgot password page @regression", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateToForgotPassword();
    await loginPage.usernameForResetPasswordInput.fill(loginData[1].username);
    await loginPage.submitButton.click();
    await page.waitForTimeout(2000);
    await expect(loginPage.alertMessage).toBeVisible({ timeout: 10000 });
    await page.waitForTimeout(1000);
    await expect(loginPage.alertMessage).toHaveText("User Name is invalid");
  });
});
