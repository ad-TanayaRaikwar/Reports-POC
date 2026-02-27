import { test, expect } from '@playwright/test';
import { PaymentsPage } from '../../pages/payments/paymentsPage';
import { PaymentsDetailsPage } from '../../pages/payments/paymentsDetailsPage';
import { CURRENT_ENV } from '../../tests/config/env';
import { SideMenuPage } from '../../pages/SideMenuPage';
import { LoginPage } from '../../pages/login/loginPage';  
import { CommonUtils } from '../../utils/commonUtils';

test.describe('Payments Module', () => {
  let loginPage: LoginPage;
  let sideMenuPage: SideMenuPage;
  let paymentsPage: PaymentsPage;
  let commonUtils: CommonUtils; 
  let paymentsDetailsPage: PaymentsDetailsPage;
  

    test.beforeEach(async ({page}) => { 
    loginPage = new LoginPage(page);    
    sideMenuPage = new SideMenuPage(page);
    paymentsPage = new PaymentsPage(page);
    commonUtils = new CommonUtils(page);   
    paymentsDetailsPage = new PaymentsDetailsPage(page); 
     
    // Login and navigate to Payments page
    await loginPage.navigateTo(CURRENT_ENV);
    await loginPage.loginAsAlly();
    await sideMenuPage.openPayments();
    });



test('Validate correctness of payment details for selected payment', async ({ page }) => {


 await page.waitForTimeout(3000);
  const rowData = await paymentsPage.getRowDataByIndex(0);
  await page.waitForTimeout(3000);
  await paymentsPage.clickRowByIndex(0);
 await page.waitForTimeout(3000);
  await paymentsDetailsPage.verifyPaymentDetails(rowData);
  //await page.waitForTimeout(8000);
});




test('Validate payment details header @regression @smoke', async ({ page }) => {
  
   await page.waitForTimeout(4000);
  await paymentsPage.clickRowByIndex(0);
  await page.waitForTimeout(3000);
  //await paymentsDetailsPage.verifyPaymentDetailsHeader();
  await page.waitForTimeout(2000);
  await paymentsDetailsPage.verifyAllCardsVisible();
});

test('Validate Authorized status is displayed in Timeline @regression', async ({ page }) => {
  
  await page.waitForTimeout(2000);
  await paymentsPage.clickRowByIndex(0);
  
  
  await page.waitForTimeout(2000);
  await paymentsDetailsPage.verifyAuthorizedStatus();
  //await paymentsDetailsPage.verifyPaymentDetailsHeader();
});


test('Verify the ally can successfully refund a transaction (Full Refund) @regression @smoke', async ({ page }) => {
  test.setTimeout(60000);

  await test.step('Apply filters and open a settled payment', async () => {
    await paymentsPage.validateItemsPerPageOptions();
    await paymentsPage.applyLast14DaysDateFilter();
    await paymentsPage.applySettledStatusFilter();
    await paymentsPage.clickLastFourRows();
  });

  await test.step('Verify payment is in Authorized status', async () => {
    await paymentsDetailsPage.verifyAuthorizedStatus();
  });

  await test.step('Open refund transaction', async () => {
    await paymentsDetailsPage.openRefundTransaction();
  });

  await test.step('Submit full refund request', async () => {
    await paymentsDetailsPage.RefundTransaction();
  });

  await test.step('Confirm refund with reason and additional details', async () => {
    await paymentsDetailsPage.confirmRefundFlow(
      'Fraud',
      'Customer requested a refund due Duplicate Purchase.'
    );
  });
});

//'Fraud', 'Duplicate Purchase', 'Product Returned',  'Shopper Request',  'Other'
test('Verify the ally can successfully refund a transaction (Subtotal Refund) @regression', async ({ page }) => {
  test.setTimeout(60000);

  await test.step('Apply filters and open a settled payment', async () => {
    await paymentsPage.validateItemsPerPageOptions();
    await paymentsPage.applyLast14DaysDateFilter();
    await paymentsPage.applySettledStatusFilter();
    await paymentsPage.clickLastFourRows();
  });

  await test.step('Verify payment is in Authorized status', async () => {
    await paymentsDetailsPage.verifyAuthorizedStatus();
  });

  await test.step('Open refund transaction', async () => {
    await paymentsDetailsPage.openRefundTransaction();
  });

  await test.step('Select subtotal refund option', async () => {
    await paymentsDetailsPage.SubtotalRefund();
  });

  await test.step('Submit refund request', async () => {
    await paymentsDetailsPage.RefundTransaction();
  });

  await test.step('Validate subtotal refund balances', async () => {
    await paymentsDetailsPage.validateSubtotalRefundBalances();
  });

  await test.step('Confirm refund with reason and additional details', async () => {
    await paymentsDetailsPage.confirmRefundFlow(
      'Duplicate Purchase',
      'Customer requested a refund due Duplicate Purchase.'
    );
  });
});



test('Verify Partial Refund cannot exceed Total Refund amount @regression @smoke', async ({ page }) => {
  test.setTimeout(60000);

  await test.step('Apply filters and open a settled payment', async () => {
    await paymentsPage.validateItemsPerPageOptions();
    await paymentsPage.applySettledStatusFilter();
    await paymentsPage.applyLast14DaysDateFilter();
    
    await paymentsPage.clickLastFourRows();
  });

  await test.step('Verify payment is in Authorized status', async () => {
    await paymentsDetailsPage.verifyAuthorizedStatus();
  });

  await test.step('Open refund transaction', async () => {
    await paymentsDetailsPage.openRefundTransaction();
  });

  let excessiveAmount: number;

  await test.step('Calculate partial refund amount exceeding total refund', async () => {
    const totalRefundText =
      await paymentsDetailsPage.TotalRefundAmountCheck.innerText();

    const totalRefund = Number(totalRefundText.replace(/[^0-9.]/g, ''));
    excessiveAmount = totalRefund + 10;

    console.log(
      `Total refund: $${totalRefund}, attempting excessive refund: $${excessiveAmount}`
    );
  });

  await test.step('Enter excessive partial refund amount', async () => {
    await paymentsDetailsPage.enterPartialRefundAmount(excessiveAmount);
  });

  await test.step('Verify validation error is displayed', async () => {
    const errorMessage = page.locator('text=Amount exceeding');
    await expect(errorMessage).toBeVisible();
  });
});



///
test('Verify the ally can successfully refund a transaction (Partial Refund) @regression',
  async ({ page }) => {

    test.setTimeout(60000);

    await test.step('Validate payments list and apply filters', async () => {
      await paymentsPage.validateItemsPerPageOptions();
      await paymentsPage.applyLast14DaysDateFilter();
      await paymentsPage.applySettledStatusFilter();
      await paymentsPage.clickLastFourRows();
    });

    await test.step('Verify transaction is authorized', async () => {
      await paymentsDetailsPage.verifyAuthorizedStatus();
    });

    await test.step('Open refund transaction', async () => {
      await paymentsDetailsPage.openRefundTransaction();
    });

    await test.step('Enter partial refund amount', async () => {
      await paymentsDetailsPage.enterPartialRefundAmount(5.00);
    });

    await test.step('Submit refund', async () => {
      await paymentsDetailsPage.RefundTransaction();
    });

    await test.step('Validate refund balances', async () => {
      await paymentsDetailsPage.validateSubtotalRefundBalances();
    });

    await test.step('Confirm refund with reason', async () => {
      await paymentsDetailsPage.confirmRefundFlow(
        'Shopper Request',
        'Customer requested a refund due Duplicate Purchase.'
      );
    });

  }
);



});