import { Page, expect } from "@playwright/test";
import { BasePage } from "../basePage";
import { CURRENT_ENV } from "../../tests/config/env";   

export class AddUserPage extends BasePage {

    //AddUserlocators


    readonly url: string;
    constructor(page: Page) {
        super(page);
        this.url = `${CURRENT_ENV}/users/add`;
    }

    
    readonly AddUserBtn= this.page.locator("//div[@class='header']//div[@class='button button-green']");
    readonly AddUserTxt= this.page.getByText('Add User', { exact: true });
    readonly userNameTxt= this.page.getByRole('textbox', { name: '*Username' });
    readonly basicAuthBtn= this.page.locator("//label[@for='basicAuth']");
    readonly apiKeyBtn= this.page.locator("//label[@for='apiKey']");

    readonly firstNameInputBox= this.page.locator('#inputFirstName');
    readonly lastNameInputBox= this.page.locator('#input-name');
    readonly phoneNumberInputBox= this.page.locator('#inputPhone');
    readonly emailInputBox= this.page.locator('#inputEmail')

    readonly saveButton= this.page.getByRole('button', { name: 'Save' });
    readonly cancelButton= this.page.locator(':text("CANCEL")');

    readonly  successAlert= this.page.getByRole('alert', { name: 'User added successfully, Please continue to activate user.' });
//readonly  errorAlert= this.page.getByRole('alert', { name: /User name already exists/i });

 readonly errorAlert = this.page.locator(".toast-message", { hasText: "User name already exists" });
       
 readonly actionButton= this.page.locator('button.action-button');
 readonly deactivateButton= this.page.locator(':text("Deactivate")');
 readonly activateButton= this.page.locator(':text("Activate")');
 
readonly tableRows = this.page.locator('div.table-container table tbody tr');
// First row
readonly firstRow = this.tableRows.first();
// Ellipsis inside first row
readonly firstRowEllipsis = this.firstRow.locator('span.material-symbols-outlined');



}