import { test as base } from "@playwright/test";
import { LoginPage } from "../e2e/pages/loginPage";
import { SignupPage } from "../e2e/pages/signupPage";
import { bonusHistoryRange } from "../utils/utils";
const randomNr = Math.floor(Math.random() * 10000);

type TestUser = {
  registrationType: string;
  currency: string;
  email: string;
  promoCode: string | null;
  hashedPassword: {
    salt: string;
    hash: string;
  };
  alias: string;
};

type RegUser = {
  user: string;
  password: string;
};

type Bonus = {
  filter: {
    types: string[];
    start: number;
    end: number;
  };
  pagination: { pageNumber: number; pageSize: number };
};

export const test = base.extend<{
  testUser: TestUser;
  regUser: RegUser;
  loginPage: LoginPage;
  signupPage: SignupPage;
  bonusData: Bonus;
}>({
  testUser: async ({}, use) => {
    const testUser: TestUser = {
      registrationType: "lite",
      currency: "VCD",
      email: `testdm${randomNr}@example.com`,
      promoCode: "",
      hashedPassword: {
        salt: "9f8afd781f",
        hash: "b853e30ecba2942012b276feb3a87ab098e924cf91676aab126c55ffb80f0c217be3b1ea70de92debfde67c516c1316d0817dc2d4c59e1c620a3eda5e89b39b6",
      },
      alias: `testdm${randomNr}`,
    };
    await use(testUser);
  },
  regUser: async ({}, use) => {
    const regUser: RegUser = {
      user: `testdm`,
      password: "!Test123",
    };
    await use(regUser);
  },
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  signupPage: async ({ page }, use) => {
    const signupPage = new SignupPage(page);
    await use(signupPage);
  },
  bonusData: async ({}, use) => {
    const { start, end } = bonusHistoryRange();
    const bonus: Bonus = {
      filter: {
        types: ["BONUS"],
        start: start,
        end: end,
      },
      pagination: { pageNumber: 1, pageSize: 10 },
    };
    use(bonus);
  },
});
