import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/login/loginPage";
import { SideMenuPage } from "../../pages/SideMenuPage";
import { AddUserPage } from "../../pages/users/addUserPage";
import { CommonUtils } from "../../utils/commonUtils";
import { generateUser } from "../../utils/testDataGenerator";
import loginData from "../../testData/loginData.json";
import { CURRENT_ENV } from "../../tests/config/env";
import { ProfilePage } from "../../pages/allyProfile/ProfilePage";
import { UsersPage } from "../../pages/users/usersPage";

test.describe("Login Module Failed Tests", () => {
  test("Login with valid credentials @smoke @regression", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigate();
    await loginPage.loginAsAlly();

    const usersHeader = page.locator("//h3[normalize-space()='Users']");

    // Wrong expectation to force failure
    await expect(usersHeader).toHaveText("Dashboard");
  });

  test("Login with invalid credentials @regression", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigate();

    await loginPage.login(loginData[1].username, loginData[1].password);

    const errorAlert = page.locator("//div[@role='alert']");

    // Expect success instead of error → will fail
    await expect(errorAlert).toHaveText("Login successful");
  });

  test("Verify logo present ", async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigate();

    await expect(loginPage.loginButton).toBeHidden();
  });

  test("Forgot password navigation", async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigateToForgotPassword();

    // Expect wrong text
    await expect(loginPage.recoverPasswordText).toHaveText("Change Password");
  });

  test("Reset password", async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigateToForgotPassword();

    await loginPage.usernameForResetPasswordInput.fill(loginData[2].username);

    await loginPage.submitButton.click();

    // Expect failure message instead of success
    await expect(loginPage.successMessage).toHaveText("Password reset failed");
  });

  test("Invalid username forgot password  @regression", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigateToForgotPassword();

    await loginPage.usernameForResetPasswordInput.fill(loginData[1].username);

    await loginPage.submitButton.click();

    // Expect wrong error message
    await expect(loginPage.alertMessage).toHaveText("User reset successful");
  });
});

test.describe("Profile Module Failed Tests", () => {
  test("Verify logged ally details  @smoke @regression", async ({
    page,
  }) => {
    const profilePage = new ProfilePage(page);

    const profileValue = await profilePage.profileMenu.innerText();

    console.log("Profile Menu Value:", profileValue);

    await profilePage.clickProfile();

    // Force failure → expecting wrong name
    expect(profileValue).toBe("Invalid User");
  });

  test("Verify Profile page loads & User details visible  @smoke @regression", async ({
    page,
  }) => {
    const profilePage = new ProfilePage(page);

    await profilePage.clickProfile();

    const details = await profilePage.getUserDetails();

    console.log("User Details:", details);

    // Wrong validations to fail
    expect(details["Username"]).toBe("FakeUser");

    expect(details["Email"]).toContain("#");

    expect(details["Phone"]).toBeFalsy();

    expect(details["Address"]).toBeFalsy();

    expect(details["Password"]).toBeUndefined();
  });

  test("Verify Actions section  @regression", async ({
    page,
  }) => {
    const profilePage = new ProfilePage(page);

    await profilePage.clickProfile();

    await profilePage.verifyActionsSection();

    // Force fail
    expect(true).toBe(false);
  });

  test("Verify logout navigates to login page ", async ({
    page,
  }) => {
    const profilePage = new ProfilePage(page);

    await profilePage.clickLogout();

    // Expect wrong URL
    await expect(page).toHaveURL(/dashboard/);

    console.log("Logout validation failed intentionally");
  });

  test("Validate navigation to Change Password  @regression @smoke", async ({
    page,
  }) => {
    const profilePage = new ProfilePage(page);

    await profilePage.clickProfile();

    await profilePage.clickChangePassword();

    // Expect wrong heading
    await expect(
      page.getByRole("heading", { name: "Reset Password" }),
    ).toBeVisible();

    // Wrong URL expectation
    await expect(page).toHaveURL(/reset-password/);
  });

  test("Verify update email and phone  @regression @smoke", async ({
    page,
  }) => {
    const profilePage = new ProfilePage(page);

    // const testUser = generateUser();

    await profilePage.clickProfile();

    await profilePage.clickEditUser();

    await profilePage.updateEmail("testuser123@gmail.com");

    await profilePage.saveChanges();

    // Expect failure alert instead of success
    await expect(profilePage.successAlert).toHaveText("Update Failed");
  });

  test("Verify validation for invalid email ID ", async ({
    page,
  }) => {
    const profilePage = new ProfilePage(page);

    await profilePage.clickProfile();

    await profilePage.clickEditUser();

    await profilePage.updateEmail("invalidEmail@123");

    await profilePage.saveChanges();

    // Expect wrong error message
    await expect(profilePage.emailValdation).toHaveText("Email accepted");
  });
});

// Generate test data
    const user = generateUser();

test.describe("Add ally users tests", () => {
  let sideMenuPage: SideMenuPage;
  let loginPage: LoginPage;
  let addUserPage: AddUserPage;
  let commonUtils: CommonUtils;
  let usersPage: UsersPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    sideMenuPage = new SideMenuPage(page);
    addUserPage = new AddUserPage(page);
    commonUtils = new CommonUtils(page);
    usersPage = new UsersPage(page);

    await loginPage.navigateTo(CURRENT_ENV);
    await loginPage.loginAsAlly();
    await sideMenuPage.openUsers();
  });

  test("Verify that an Ally can create a Basic Auth Ally user. @smoke @regression", async ({
    page,
  }) => {
    // Click Add User button
    await addUserPage.AddUserBtn.click();

    // Verify Add User form is visible
    await expect(addUserPage.AddUserTxt).toBeVisible({ timeout: 15000 });

    

    // Fill form
    await addUserPage.userNameTxt.fill(user.username);
    await addUserPage.basicAuthBtn.click();
    await addUserPage.firstNameInputBox.fill(user.firstName);
    await addUserPage.lastNameInputBox.fill(user.lastName);
    await addUserPage.phoneNumberInputBox.fill(user.phone);
    await addUserPage.emailInputBox.fill(user.email);

    // Click Save
    await addUserPage.saveButton.click();

    // Wait for toast message to appear (stable way)
    const successToast = page.locator(".toast-message").filter({
      hasText: /User added successfully/i,
    });
    await expect(successToast).toBeVisible({ timeout: 15000 });

    // Optionally check text
    await expect(successToast).toHaveText(/User added failed/i, {
      timeout: 15000,
    });
  });

  test("Verify that an Ally can create a API Key Ally user.@smoke @regression", async ({
    page,
  }) => {
    await addUserPage.AddUserBtn.click();
    await expect(addUserPage.AddUserTxt).toBeVisible({ timeout: 15000 });
    await addUserPage.userNameTxt.fill(user.username);
    await addUserPage.apiKeyBtn.click();
    // await addUserPage.firstNameInputBox.fill(user.firstName);
    // await addUserPage.lastNameInputBox.fill(user.lastName);
    // await addUserPage.phoneNumberInputBox.fill(user.phone);
    await addUserPage.emailInputBox.fill(user.email);
    await page.waitForTimeout(1000);
    await addUserPage.saveButton.click();
    await page.waitForTimeout(1000);
    await page.waitForSelector(".toast-message", { timeout: 15000 });
    await expect(addUserPage.errorAlert).toBeVisible({ timeout: 15000 });

    //await expect(addUserPage.successAlert).toBeVisible({ timeout: 15000 });
    await page.waitForTimeout(1000);
  });
  test("Verify that an Ally can create a Basic Auth + API Key Ally user. @smoke @regression", async ({
    page,
  }) => {
    await addUserPage.AddUserBtn.click();
    await expect(addUserPage.AddUserTxt).toBeVisible({ timeout: 15000 });
    await addUserPage.userNameTxt.fill(user.username);
    await addUserPage.basicAuthBtn.click();
    await page.waitForTimeout(1000);
    await addUserPage.apiKeyBtn.click();
    await addUserPage.firstNameInputBox.fill(user.firstName);
    await addUserPage.lastNameInputBox.fill(user.lastName);
    await addUserPage.phoneNumberInputBox.fill(user.phone);
    await addUserPage.emailInputBox.fill(user.email);
    await page.waitForTimeout(1000);
    await addUserPage.saveButton.click();
    await page.waitForTimeout(1000);
    await page.waitForSelector(".toast-message", { timeout: 15000 });
    await expect(addUserPage.errorAlert).toBeVisible({ timeout: 15000 });

    //await expect(addUserPage.successAlert).toBeVisible({ timeout: 15000 });
    await page.waitForTimeout(1000);
  });

  test("Verify that a validation error appears when creating a user with an existing username.@smoke @regression", async ({
    page,
  }) => {
    await addUserPage.AddUserBtn.click();
    await expect(addUserPage.AddUserTxt).toBeVisible({ timeout: 15000 });
    await addUserPage.userNameTxt.fill("Genesis24"); //existing user
    await addUserPage.apiKeyBtn.click();

    await addUserPage.emailInputBox.fill(user.email);
    await page.waitForTimeout(1000);
    await addUserPage.saveButton.click();

    await page.waitForSelector(".toast-message", { timeout: 15000 });

    await expect(addUserPage.successAlert).toBeVisible();
  });



// ---------------------------------------------
// Users Module - Failed Test Cases
// ---------------------------------------------

test.describe("Users Module Failed Tests", () => {

  // ---------------------------------------------
  // 1️⃣ Validate Users page loads (Fail)
  // ---------------------------------------------
  test("Verify the Users page loads correctly  @smoke @regression", async () => {

    await usersPage.validateUsersPageLoaded();

    // Force failure
    expect(true).toBe(false);

  });


  // ---------------------------------------------
  // 3️⃣ Clear search (Fail)
  // ---------------------------------------------
  test("Verify clear search field  @smoke @regression", async () => {

    const username = "testnew123";

    await usersPage.searchUser(username);

    await usersPage.clearSearch();

    // Intentional fail
    expect("Search Cleared").toBe("Search Failed");

  });


  // ---------------------------------------------
  // 4️⃣ Items per page options (Fail)
  // ---------------------------------------------
  test("Validate Items Per Page Options  @regression", async () => {

    await usersPage.validateUsersPageLoaded();

    await usersPage.validateItemsPerPageOptions();

    expect(10).toBe(20);

  });


  // ---------------------------------------------
  // 5️⃣ Activate inactive user (Fail)
  // ---------------------------------------------
  test("Activate inactive user account ", async ({ page }) => {

    const users = new UsersPage(page);

    const firstRow = users.userRows.first();

    const status = await users.getStatus(firstRow);

    console.log(`Current status: ${status}`);

    if (status === "Inactive") {
      await users.clickAction(firstRow, "Activate");
    }

    // Intentional fail
    expect(status).toBe("Deleted");

  });


  // ---------------------------------------------
  // 6️⃣ Deactivate active user (Fail)
  // ---------------------------------------------
  test("Deactivate active user account ", async ({ page }) => {

    const users = new UsersPage(page);

    await users.validateUsersPageLoaded();

    await users.deactivateFirstActiveUser();

    // Intentional fail
    expect(false).toBe(true);

  });


  // ---------------------------------------------
  // 7️⃣ Search non-existing user (Fail)
  // ---------------------------------------------
  test("Search invalid user ", async () => {

    await usersPage.searchUser("NoUser999");

    // Wrong expectation
    expect("No Records").toBe("User Found");

  });


  // ---------------------------------------------
  // 8️⃣ Page title validation (Fail)
  // ---------------------------------------------
  test("Validate Users page title ", async ({ page }) => {

    await usersPage.validateUsersPageLoaded();

    await expect(page).toHaveTitle("Dashboard");

  });


  // ---------------------------------------------
  // 9️⃣ Pagination validation (Fail)
  // ---------------------------------------------
  test("Validate pagination works ", async () => {

    expect(1).toBe(2);

  });


  // ---------------------------------------------
  // 🔟 Refresh page validation (Fail)
  // ---------------------------------------------
  test("Validate page refresh", async ({ page }) => {

    await page.reload();

    expect("Users").toBe("Login");

  });

});
});