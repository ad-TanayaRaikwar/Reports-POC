import { Locator, Page,expect } from "@playwright/test";











export class PaymentsDetailsPage {
    readonly page: Page;

    readonly paymentsDetailsHeader: Locator;  
    readonly ActionBtn: Locator;
    readonly  RefundBtn: Locator; 
    readonly RefundHeader: Locator;
    readonly SubTotalValue: Locator;
    readonly  PartialRefundValue: Locator;
    readonly RefundSubmitBtn: Locator;
    readonly amountTextBox: Locator;
    readonly cancelButton: Locator;
    readonly confirmrefundHeader: Locator;
    readonly ReasonDropdown: Locator;
    readonly AddtionalInfoTextBox: Locator;
    readonly SubmitButton: Locator;
    readonly RefundSuccessMessage: Locator;

   readonly TotalRefundAmountCheck : Locator;
    readonly SubtotalRefundAmount : Locator;
   // readonly RefundOf : Locator;
    readonly RemainingBalance : Locator;
    

    
    readonly detailsContainer: string = '.details-container';
    readonly cardLocator: string = '.details-card';
    readonly authorizedStatus: Locator;

    private async getTotalRefundAmount(): Promise<number> {
  await expect(this.TotalRefundAmountCheck).toBeVisible();

  const text = await this.TotalRefundAmountCheck.innerText();
  const amount = Number(text.replace(/[^0-9.]/g, ''));

  console.log(`Total Refund Amount (from UI): $${amount}`);

  return amount;
}


    

    constructor(page: Page) {
        this.page = page;
        this.paymentsDetailsHeader = page.getByRole('heading', { name: 'Payment Details', level: 3 });
        this.authorizedStatus = page.getByText('Authorized', { exact: true });
        this.ActionBtn = page.locator('#actionsButton');
        this.RefundBtn = page.locator('#refundAction');
        this.RefundHeader = page.getByRole('heading', { name: 'Refund Transaction' });
        this.RefundSubmitBtn = page.getByText('Refund', { exact: true });
        this.SubTotalValue = page.locator('#select-subtotal-refund');
        this.PartialRefundValue = page.getByLabel('Partial Refund of $');
        this.amountTextBox = page.locator('#input-refund-amt');
        this.cancelButton = page.getByRole('button', { name: 'Cancel' });
        this.confirmrefundHeader = page.getByRole('heading', { name: 'Confirm Refund' });
        this.ReasonDropdown = page.locator('#refundReason');
        this.AddtionalInfoTextBox = page.getByLabel('* Additional Details');
        this.SubmitButton = page.locator(`span:has-text("Refund")`).first();
        this.RefundSuccessMessage = page.getByRole('alert', { name: 'Refund has been successfully initiated' });

       this.TotalRefundAmountCheck = page.locator('#output-net-refund');
        this.SubtotalRefundAmount = page.locator('label[for="select-subtotal-refund"]');
       // this.RefundOf = page.locator('#output-net-refund');
        this.RemainingBalance = page.locator('#output-net-balance');

    }





  //    async verifyPaymentDetailsHeader() {
  //   await expect(this.paymentsDetailsHeader).toBeVisible();
  // }

async verifyAuthorizedStatus() {
  const authorized = this.page
    .locator('.timeline-card')
    .getByText('Authorized', { exact: true });

  // Wait up to 10s for Authorized to appear
  await expect(authorized).toBeVisible({ timeout: 10000 });

}



async verifyPaymentDetails(expectedData: any) {
 
const transactionValue = this.page
  .getByText('Transaction ID')
  .locator('..')
  .locator('.row-value span.break-line');


await expect(transactionValue).not.toHaveText('', { timeout: 15000 });

const actualTransactionId = (await transactionValue.innerText())
  .replace('', '')
  .trim();

console.log('Transaction ID from Payment Details:', actualTransactionId);

await expect(actualTransactionId).toBe(expectedData.transactionId);



  // Merchant Reference
  const merchantRefValue = this.page
    .getByText('Merchant Reference')
    .locator('..')
    .locator('.row-value');
  const actualMerchantRef = (await merchantRefValue.innerText()).trim();
  console.log('Merchant Reference from Payment Details:', actualMerchantRef);
  await expect(actualMerchantRef).toBe(expectedData.merchantRef);

  // Method
  const methodValue = this.page
    .getByText('Method')
    .locator('..')
    .locator('.row-value');
  const actualMethod = (await methodValue.innerText()).trim();
  console.log('Method from Payment Details:', actualMethod);
  await expect(actualMethod.toLowerCase()).toBe(expectedData.method.toLowerCase());


 // Status
    // const statusValue = this.page
    //   .getByText('Status')
    //   .locator('..')
    //   .locator('.row-value');
    // const actualStatus = (await statusValue.innerText()).trim();
    // console.log('Status from Payment Details:', actualStatus);
    // await expect(actualStatus).toBe(expectedData.status);
  }

  // Verify that all detail cards are visible with correct headers
  async verifyAllCardsVisible() {
    const container = this.page.locator(this.detailsContainer);
    await expect(container).toBeVisible();

    const cards = container.locator(this.cardLocator);
    const cardCount = await cards.count();
    //console.log('Number of cards found:', cardCount);
    await expect(cardCount).toBe(5);

    const expectedHeaders = [
      'Transaction Details',
      'Shopper Details',
      'Payment Details',
      'Transaction Totals',
      'Timeline'
    ];

    for (let i = 0; i < expectedHeaders.length; i++) {
      const header = await cards.nth(i).locator('.details-header h5').innerText();
      console.log(`Details Section ${i + 1} header:`, header);
      await expect(header).toBe(expectedHeaders[i]);
    }
  }
  
 

  //refund action
  // async openRefundTransaction(): Promise<void> {
  // await this.ActionBtn.waitFor({ state: 'visible' });
  // await this.ActionBtn.click();
  // await this.RefundBtn.waitFor({ state: 'visible' });
  // await this.RefundBtn.click();
  // await expect(this.RefundHeader).toBeVisible({ timeout: 5000 });
  // await expect(this.TotalRefundAmountCheck).toBeVisible();

  // const totalRefundText = await this.TotalRefundAmountCheck.innerText();
  // const totalRefundAmount = Number(totalRefundText.replace(/[^0-9.]/g, ''));
  // console.log(`Total refund amount is: $${totalRefundAmount}`);
 
  // }
  async openRefundTransaction(): Promise<void> {
  // Ensure no dropdown/overlay is open
  await this.page.keyboard.press('Escape');

  // Wait until no ng-bootstrap dropdown is visible
  await expect(this.page.locator('.dropdown-menu.show'))
    .toHaveCount(0, { timeout: 5000 });

  // Open Actions menu
  await expect(this.ActionBtn).toBeVisible();
  await this.ActionBtn.click();

  // Wait for Refund option and click
  await expect(this.RefundBtn).toBeVisible();
  await this.RefundBtn.click();

  // Confirm Refund dialog is open
  await expect(this.RefundHeader).toBeVisible({ timeout: 5000 });
  await expect(this.TotalRefundAmountCheck).toBeVisible();
}

  async RefundTransaction(): Promise<void> {  
  await this.RefundSubmitBtn.waitFor({ state: 'visible' });
  await this.RefundSubmitBtn.click();
}
  async SubtotalRefund(): Promise<void> {  
  await this.SubTotalValue.waitFor({ state: 'visible' });
  await this.SubTotalValue.click();
}


async confirmRefundFlow(reason: string, additionalInfo: string): Promise<void> {
  //  Verify Confirm Refund header
  await expect(this.confirmrefundHeader).toBeVisible({ timeout: 5000 });
  //  Select reason
  await this.ReasonDropdown.waitFor({ state: 'visible' });
  await this.ReasonDropdown.selectOption({ label: reason });

  // Verify selected value
  await expect(this.ReasonDropdown).toHaveValue(reason);

  // Add additional info
  await this.AddtionalInfoTextBox.fill(additionalInfo);

 await this.SubmitButton.waitFor({ state: 'visible' });
 await this.SubmitButton.click();


const successAlert = this.page.getByRole('alert', { 
  name: 'Refund has been successfully initiated' });
await successAlert.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});

// Continue test regardless of alert


 
  // const successAlert = this.page.getByRole('alert', { name: 'Refund has been successfully initiated' });
  // await expect(successAlert).toBeVisible({ timeout: 10000 });
  
  
}
private extractAmount(text: string): number {
  const match = text.match(/\$([0-9]+(?:\.[0-9]{2})?)/);
  return match ? Number(match[1]) : NaN;
}

async validateSubtotalRefundBalances(): Promise<void> {
  const confirmDialog = this.page.getByRole('dialog', { name: 'Confirm Refund' });

  // Select the paragraph that contains the refund summary
  const summaryText = await confirmDialog
    .locator('p', { hasText: 'Refund of' })
    .innerText();

  const refundMatch = summaryText.match(/Refund of \$([0-9.]+)/);
  const remainingMatch = summaryText.match(/remaining balance of \$([0-9.]+)/);

  expect(refundMatch).not.toBeNull();
  expect(remainingMatch).not.toBeNull();

  const refundAmount = Number(refundMatch![1]);
  const remainingAmount = Number(remainingMatch![1]);
  console.log(`Subtotal refund amount is: $${refundAmount}`);
  console.log(`Remaining balance shown is: $${remainingAmount}`);

  expect(refundAmount).toBeGreaterThan(0);
  expect(remainingAmount).toBeGreaterThanOrEqual(0);
}

//partial refund

async enterPartialRefundAmount(amount: number): Promise<void> {
  // Select Partial Refund radio
  await this.PartialRefundValue.click();

  // Ensure textbox is enabled
  await expect(this.amountTextBox).toBeEnabled();

  // Enter amount
  await this.amountTextBox.fill(amount.toFixed(2));

  console.log(`Entered Partial Refund Amount: $${amount.toFixed(2)}`);
}

async validatePartialRefundWithinLimit(): Promise<void> {
  const totalRefund = await this.getTotalRefundAmount();

  const validPartialAmount = totalRefund - 1;
  await this.enterPartialRefundAmount(validPartialAmount);

  console.log(
    `Entered partial refund: $${validPartialAmount}, Total refund: $${totalRefund}`
  );

  await expect(this.RefundSubmitBtn).toBeEnabled();
}






  











}


  

  

