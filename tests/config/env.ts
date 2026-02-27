// tests/config/env.ts

export const ENV = {
  QAT: "https://ally.qat.anddone.com/#/login",
  UAT: "https://ally.uat.anddone.com/#/login",
};

export const CURRENT_ENV = process.env.TEST_ENV || ENV.QAT;
