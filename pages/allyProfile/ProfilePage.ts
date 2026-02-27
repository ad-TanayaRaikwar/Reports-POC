import { Page, expect, Locator } from "@playwright/test"; 
import { BasePage } from "../basePage";
import { CURRENT_ENV } from "../../tests/config/env";
import { CommonUtils } from "../../utils/commonUtils";
import { th } from "@faker-js/faker"; // Use environment variable at runtime instead of a missing module import. 
 

export class ProfilePage extends BasePage {
readonly profileMenu: Locator;
readonly profileButton: Locator;
readonly logoutButton: Locator; 
//readonly alertMessage: Locator;



//ProfilePage
 readonly userDetailsSection:Locator;
 readonly actions : Locator;

 //edit user
readonly editUserButton : Locator;
readonly editUserTxt : Locator;
readonly emailTxt :Locator;
readonly phoneTxt : Locator;
readonly cancelBtn: Locator;
readonly saveBtn :Locator;
readonly successAlert : Locator;
readonly emailValdation :Locator

readonly url: string;

constructor(page: Page) { super(page); this.url = CURRENT_ENV; // use CURRENT_ENV instead of hardcoding
this.profileMenu = page.locator('p.profile-name');
this.profileButton = page.getByText('Profile', { exact: true }).first();
this.logoutButton = page.getByText('Log Out', { exact: true }).first();

//profile
this.userDetailsSection = page.locator('.details-card.user-details');
this.actions = page.locator('div.details-card.actions');

//edituser
this.editUserButton = page.getByRole('button', { name: 'Edit User' });
this.editUserTxt = page.getByRole('heading', { name: 'Edit User' }); 
this.emailTxt = page.getByRole('textbox', { name: 'Email' }); 
this.phoneTxt = page.getByRole('textbox', { name: 'Phone Number' }); 
this.cancelBtn = page.getByRole('button', { name: 'Close' }); 
this.saveBtn = page.locator(`.button.button-pink`);
this.successAlert= page.getByRole('alert', { name: 'User edited successfully.' });
this.emailValdation=page.getByText('Email is not valid.', { exact: true });

}   
async openProfile() {
 await this.utils.click(this.profileMenu);
 }


 async clickProfile() { await this.openProfile();
     await this.profileButton.click(); }
 async clickLogout() { await this.openProfile();
     await this.logoutButton.click(); }

     async getUserDetails(): Promise<Record<string, string>> {
     const userDetails: Record<string, string> = {}; 
     const rows = this.userDetailsSection.locator('.detail-row');
     const count = await rows.count();

     for (let i = 0; i < count; i++)
        { const row = rows.nth(i);
            const key = (await row.locator('.row-key').textContent())?.trim();
             const value = (await row.locator('.row-value').textContent())?.trim();
              if (key)
                 { userDetails[key] = value || ''; } }
      return userDetails; }


      async clickEditUser() {
         await this.actions.getByText('Edit User').click(); 
        }

        async clickChangePassword() { 
            await this.actions.getByText('Change Password').click(); }
             async verifyActionsSection() {
                 const actionsSection = this.actions;
                  await expect(actionsSection.getByText('Edit User')).toBeVisible();
                   await expect(actionsSection.getByText('Change Password')).toBeVisible();
                 }  


    

async updateEmail(email: string) {
  await this.emailTxt.fill(email);
}

async updatePhone(phone: string) {
  await this.phoneTxt.fill(phone);
}

async saveChanges() {
  await this.saveBtn.click();
}


async verifyInvalidEmailError() {
  await expect(this.emailValdation).toBeVisible();
}

}