import { test, expect } from '@playwright/test';
import { CURRENT_ENV } from '../../tests/config/env';
import { LoginPage } from '../../pages/login/loginPage';
import { SideMenuPage } from '../../pages/SideMenuPage';
import { CommonUtils } from '../../utils/commonUtils';
import { UsersPage } from '../../pages/users/usersPage';

test.describe('Users - Search/Filter/Table', () => {
  let loginPage: LoginPage;
  let sideMenuPage: SideMenuPage;
  let usersPage: UsersPage;
  let commonUtils: CommonUtils; 

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    sideMenuPage = new SideMenuPage(page);
    usersPage = new UsersPage(page);
    commonUtils = new CommonUtils(page);

    // Login + navigate to Users page
    await loginPage.navigateTo(CURRENT_ENV);
    await loginPage.loginAsAlly();
    await sideMenuPage.openUsers();

    // Ensure page loaded
    //await usersPage.validateUsersPageLoaded();
  });

  // ---------------------------------------------
  // 1️⃣ Validate Users page loads
  // ---------------------------------------------
  test('Verify the Users page loads correctly @smoke @regression', async () => {
    await usersPage.validateUsersPageLoaded();
  });

  // ---------------------------------------------
  // 2️⃣ Search by username
  // ---------------------------------------------
  test('Verify that an Ally can search for a user by username @smoke @regression', async () => {
    const username = 'testnew123'; // valid test data

    await usersPage.searchUser(username);
    await usersPage.validateSearchResults(username);
  });

  // ---------------------------------------------
  // 3️⃣ Clear search and reload full list
  // ---------------------------------------------
  test('Verify that an Ally can clear the search field @smoke @regression', async () => {
    const username = 'testnew123';
 
    await usersPage.searchUser(username);
    await usersPage.validateSearchResults(username);
    
    await usersPage.clearSearch();
   
    await usersPage.validateAllRecordsLoaded();
    
  });

  test('Validate Items Per Page Options @regression', async ({page}) => {

  await usersPage.validateUsersPageLoaded();
  await usersPage.validateItemsPerPageOptions();   
 });

 test('Verify that an Ally user can successfully activate an inactive ally user account', async ({ page }) => {
  const users = new UsersPage(page);

  // Get the first row
  const firstRow = users.userRows.first();

  // Check status
  const status = await users.getStatus(firstRow);
  console.log(`Current status: ${status}`);
await page.setDefaultTimeout(10000);
  // Only act if user is Inactive
  if (status === 'Inactive') {
    await users.clickAction(firstRow, 'Activate');
  } else {
    console.log('User is already Active. Skipping.');
  }
  
});

test('Validate that an Ally can successfully deactivat an actective Ally users account.', async ({ page }) => {
  const users = new UsersPage(page);
 await users.validateUsersPageLoaded();
 await page.setDefaultTimeout(10000);
  await users.deactivateFirstActiveUser();

});


//test
}); 
