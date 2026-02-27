import { Page, Locator, expect } from '@playwright/test';

export class PaymentWidgetPage {
  readonly page: Page;

  // method Locators
  readonly paymentMethodHeader: Locator;
 readonly achOption: Locator;
  readonly cardOption: Locator;
 //bank details
  readonly accountHolderNameInput: Locator;
  readonly bankRoutingNumberInput: Locator;
  readonly bankAccountNumberInput: Locator;
  readonly verifyBankAccountNumberInput: Locator;
//card details
readonly nameOnCardInput: Locator;
readonly cardNumberInput: Locator;
readonly cardExpiryInput: Locator;
readonly cardCVVInput: Locator;
readonly cardCVVdebitInput: Locator;
//Billing Address-for card
readonly addressInput: Locator;
readonly cityInput: Locator;
readonly suite: Locator;
//readonly stateInput: Locator;
readonly postalCodeInput: Locator;




  readonly submitPaymentButton: Locator;
  readonly sueccessMessage: Locator;

  //Payment intent is already processed.
  readonly alreadyProcessedMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    // Payment method options
    this.paymentMethodHeader = page.locator(`span:has-text("Payment Method")`);
    this.achOption = page.locator(`//*[local-name()='svg' and @viewBox='0 0 38 38']`);
    this.cardOption = page.getByText('CARD', { exact: true });

    // Bank details inputs
    this.accountHolderNameInput = page.locator("//input[@id='accountHolderName']");
    this.bankRoutingNumberInput = page.locator("//input[@id='verifyBankRoutingNumberInput']");
    this.bankAccountNumberInput = page.locator("//input[@id='bankAccountNumberInput']");
    this.verifyBankAccountNumberInput = page.locator("//input[@id='verifyBankAccountNumberInput']");

    //Card deatils inputs
    this.nameOnCardInput = page.locator(`//input[@id='cardAccountHolder']`);
   this.cardNumberInput = page.locator(`//input[@id='cardNumber']`);
    this.cardExpiryInput =page.locator('input#validThrough');
   this.cardCVVInput = page.locator('input[type="password"][maxlength="4"]'); //cc
   this.cardCVVdebitInput = page.locator('input[type="password"][maxlength="3"]');//debit
  



    //Billing Address-for card
    this.addressInput = page.locator("//div[@id='streetName']//input");
    this.cityInput = page.locator(`//input[@id='city']`);
    this.suite = page.locator("div#streetNumber input");
    //this.stateInput = page.locator(`//input[@id='stateInput']`);
    this.postalCodeInput = page.locator(`//input[@id='postalCode']`);

    // Submit button
    this.submitPaymentButton = page.getByRole('button', { name: 'Submit Payment' });

    // Toast message
    this.sueccessMessage= page.locator(`span:has-text("Thank you for your payment!")`);

    //Payment intent is already processed.
    this.alreadyProcessedMessage = page.getByText('Payment intent is already processed.', { exact: true });
  }

  selectACH() {
    return this.page.locator('.paySelect', { hasText: 'ACH' }).first();
  }

  
  
  async verifyPageLoaded() {
    await expect(this.paymentMethodHeader).toBeVisible();
    //await expect(this.achOption).toBeVisible();
  }

  // async selectACH() {
  //   await this.achOption.click();
  // }

  async fillBankDetails(details: { accountHolder: string; routingNumber: string; accountNumber: string }) {
    await this.accountHolderNameInput.fill(details.accountHolder);
    await this.bankRoutingNumberInput.fill(details.routingNumber);
    await this.bankAccountNumberInput.fill(details.accountNumber);
    await this.verifyBankAccountNumberInput.fill(details.accountNumber);
  }

  async submitPayment() {
    await this.submitPaymentButton.click();
  }

  async verifySuccessMessage(expectedText: string) {
    await expect(this.sueccessMessage).toHaveText(expectedText);
  }

//card
async selectCard() {
    await this.cardOption.click();
     await expect(this.cardNumberInput).toBeVisible({ timeout: 5000 });
    // wait for card fields to appear
    //await expect(this.cardAccountHolderInput).toBeVisible({ timeout: 5000 });
  }

  async fillCCardDetails(details: {   //credit card
    nameOnCard: string;
    cardNumber: string;
    expiry: string;
    cvv: string;
  }) {
    await this.nameOnCardInput.fill(details.nameOnCard);
    await this.cardNumberInput.fill(details.cardNumber);
    await this.cardExpiryInput.fill(details.expiry);
     await this.cardCVVInput.click();
  await this.cardCVVInput.fill(details.cvv);
    
  }
   async fillDCardDetails(details: {   //debit card
    nameOnCard: string;
    cardNumber: string;
    expiry: string;
    cvv: string;
  }) {
    await this.nameOnCardInput.fill(details.nameOnCard);
    await this.cardNumberInput.fill(details.cardNumber);
    await this.cardExpiryInput.fill(details.expiry);
     await this.cardCVVdebitInput.click();
  await this.cardCVVdebitInput.fill(details.cvv);
    
  }
  async billingAddress(details: {
    address: string;
    suite: string;
    city: string;
    postalCode: string;
  }) {
    await this.addressInput.fill(details.address);
    await this.suite.fill(details.suite);
    await this.cityInput.fill(details.city);
    await this.postalCodeInput.fill(details.postalCode);
    }




}


