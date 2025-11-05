import test, { expect, Page } from "@playwright/test";
import { LoginSelectors } from "../../selectors/loginSelectors";

export class LoginPage {
  constructor(private page: Page) {}

  private readonly DEFAULT_TIMEOUT = 10000;
  private readonly SHORT_TIMEOUT = 5000;

  async navigate() {
    await test.step(` Navigate to home page`, async () => {
      await this.page.goto("/", { waitUntil: "domcontentloaded" });
      await expect(this.page).toHaveURL(/.*\/$/, {
        timeout: this.DEFAULT_TIMEOUT,
      });
      await expect(this.page.locator(LoginSelectors.headerLogin)).toBeVisible({
        timeout: this.DEFAULT_TIMEOUT,
      });
    });
  }

  async openLogin() {
    await test.step(`Open Login modal`, async () => {
      const loginBtn = this.page.locator(LoginSelectors.headerLogin);
      await expect(loginBtn).toBeVisible({ timeout: this.DEFAULT_TIMEOUT });
      await expect(loginBtn).toBeEnabled({ timeout: this.SHORT_TIMEOUT });

      await loginBtn.click();

      const usernameInput = this.page.locator(LoginSelectors.usernameInput);
      await usernameInput.waitFor({
        state: "visible",
        timeout: this.DEFAULT_TIMEOUT,
      });

      await expect(usernameInput).toBeEnabled({ timeout: this.SHORT_TIMEOUT });
    });
  }

  async enterUsername(username: string) {
    await test.step(`Entering username: ${username}`, async () => {
      const usernameInput = this.page.locator(LoginSelectors.usernameInput);
      await usernameInput.waitFor({
        state: "visible",
        timeout: this.SHORT_TIMEOUT,
      });
      await usernameInput.clear();
      await usernameInput.fill(username, { timeout: this.SHORT_TIMEOUT });
      await expect(usernameInput).toHaveValue(username, {
        timeout: this.SHORT_TIMEOUT,
      });
    });
  }

  async enterPassword(password: string) {
    await test.step(`Entering password: ${password}`, async () => {
      const passwordInput = this.page.locator(LoginSelectors.passwordInput);
      await passwordInput.waitFor({
        state: "visible",
        timeout: this.SHORT_TIMEOUT,
      });
      await passwordInput.fill(password, { timeout: this.SHORT_TIMEOUT });
    });
  }

  async clickLoginButton() {
    await test.step(`Clicking on the login button`, async () => {
      const submitLogin = this.page.locator(LoginSelectors.loginButton);
      await submitLogin.waitFor({
        state: "visible",
        timeout: this.DEFAULT_TIMEOUT,
      });
      await expect(submitLogin).toBeEnabled();
      await submitLogin.click();
    });
  }

  async performSuccessLogin(username: string, password: string) {
    await test.step(`Performing successful login`, async () => {
      await this.navigate();
      await this.openLogin();
      await this.fillLoginForm(username, password);

      const privacy = this.page.locator('[id*="onetrust-accept-btn-handler"]');
      await expect(privacy).toBeVisible({ timeout: this.DEFAULT_TIMEOUT });
      await privacy.click({ timeout: this.SHORT_TIMEOUT });

      const loginResponse = this.page.waitForResponse(
        (response) => response.status() === 200,
        { timeout: this.DEFAULT_TIMEOUT },
      );

      await this.clickLoginButton();
      await loginResponse;
      const balance = this.page.locator(LoginSelectors.userBalance);

      await this.waitForElementWithRetry(
        LoginSelectors.userBalance,
        this.DEFAULT_TIMEOUT,
      );

      await expect(balance).toBeVisible({ timeout: this.DEFAULT_TIMEOUT });
      await expect(
        this.page.locator(LoginSelectors.headerLogin),
      ).not.toBeVisible({ timeout: this.SHORT_TIMEOUT });
    });
    return this;
  }
  async fillLoginForm(username: string, password: string) {
    await test.step(`Filling login form with username: ${username}`, async () => {
      await this.enterUsername(username);
      await this.enterPassword(password);
    });
  }
  private async waitForElementWithRetry(
    selector: string,
    timeout: number = this.DEFAULT_TIMEOUT,
    retries: number = 3,
  ): Promise<void> {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const element = this.page.locator(selector);
        await element.waitFor({ state: "visible", timeout: timeout / retries });
        return;
      } catch (error) {
        if (attempt === retries) throw error;
        await this.page.waitForTimeout(1000);
      }
    }
  }
}
