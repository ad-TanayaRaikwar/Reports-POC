import { faker } from '@faker-js/faker';

export function generateUser() {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const twoDigits = faker.number.int({ min: 10, max: 99 });

  return {
    firstName,
    lastName,
    username: `${twoDigits}${lastName}${twoDigits}${firstName}`,       // Dhanush01
    email: `${firstName}.${twoDigits}@yopmail.com`,        // Dhanush.Kumar23@yopmail.com
    phone: faker.phone.number("##########")                // Random 10-digit phone
  };
}

// ----------------------
// New function for webhook URL
// ----------------------
export function generateWebhookUrl(baseUrl = 'https://ally.qat.anddone.com/#/ally/webhooks'): string {
  const randomNumber = faker.number.int({ min: 1000, max: 9999 }); // random 4-digit number
  return `${baseUrl}${randomNumber}`;
}
