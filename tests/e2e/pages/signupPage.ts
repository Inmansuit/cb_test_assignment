import test, { expect, Page } from "@playwright/test";
import { SignupSelectors } from "../../selectors/signupSelectors";

export class SignupPage {
  constructor(private page: Page) {}

  private readonly DEFAULT_TIMEOUT = 10000;
  private readonly SHORT_TIMEOUT = 5000;

  async navigate() {
    await test.step(` Navigate to home page`, async () => {
      await this.page.goto("/", { waitUntil: "domcontentloaded" });
      await expect(this.page).toHaveURL(/.*\/$/, {
        timeout: this.DEFAULT_TIMEOUT,
      });
      await expect(this.page.locator(SignupSelectors.headerSignup)).toBeVisible(
        { timeout: this.DEFAULT_TIMEOUT },
      );
    });
  }
  async openSignUp() {
    await test.step(`Open Login modal`, async () => {
      const signupBtn = this.page.locator(SignupSelectors.headerSignup);
      await expect(signupBtn).toBeVisible({ timeout: this.SHORT_TIMEOUT });
      await signupBtn.click({ timeout: this.SHORT_TIMEOUT });
      await this.waitForStableElement(SignupSelectors.usernameInput);
    });
  }

  async enterUsername(username: string) {
    await test.step(`Entering username: ${username}`, async () => {
      const usernameInput = this.page.locator(SignupSelectors.usernameInput);
      await usernameInput.waitFor({
        state: "visible",
        timeout: this.SHORT_TIMEOUT,
      });
      await usernameInput.fill(username, { timeout: this.SHORT_TIMEOUT });
    });
  }

  async enterEmail(email: string) {
    await test.step(`Entering email: ${email}`, async () => {
      const emailInput = this.page.locator(SignupSelectors.emailInput);
      await emailInput.waitFor({
        state: "visible",
        timeout: this.SHORT_TIMEOUT,
      });
      await emailInput.fill(email, { timeout: this.SHORT_TIMEOUT });
    });
  }

  async enterPassword(password: string) {
    await test.step(`Entering password: ${password}`, async () => {
      const passwordInput = this.page.locator(SignupSelectors.passwordInput);
      await passwordInput.waitFor({
        state: "visible",
        timeout: this.SHORT_TIMEOUT,
      });
      await passwordInput.fill(password, { timeout: this.SHORT_TIMEOUT });
    });
  }

  async clickSignupButton() {
    await test.step(`Clicking on the signup button`, async () => {
      const submitSignup = this.page.locator(SignupSelectors.signupButton);

      await submitSignup.waitFor({
        state: "visible",
        timeout: this.DEFAULT_TIMEOUT,
      });
      await expect(submitSignup).toBeEnabled({ timeout: this.SHORT_TIMEOUT });

      await submitSignup.click({ timeout: this.SHORT_TIMEOUT });
    });
  }

  async fillSignup(username: string, email: string, password: string) {
    await test.step(`Filling signup form`, async () => {
      await this.navigate();
      await this.openSignUp();
      await this.enterUsername(username);
      await this.enterEmail(email);
      await this.enterPassword(password);

      const signupResponse = this.page.waitForResponse(
        (response) => response.status() === 200,
        { timeout: this.DEFAULT_TIMEOUT },
      );

      await this.clickSignupButton();
      await signupResponse;
    });
  }

  async acceptTermsandConditions() {
    await test.step(`Accepting T&C`, async () => {
      const terms = this.page.locator(SignupSelectors.termsAndCon);
      await terms.waitFor({ state: "visible", timeout: this.DEFAULT_TIMEOUT });

      const check = this.page.locator(SignupSelectors.agreeCheck);

      await check.scrollIntoViewIfNeeded();
      await this.page.waitForTimeout(500);

      await expect(check).not.toBeChecked({ timeout: this.SHORT_TIMEOUT });
      await check.click({ timeout: this.SHORT_TIMEOUT });
      await expect(check).toBeChecked({ timeout: this.SHORT_TIMEOUT });

      const privacy = this.page.locator('[id*="onetrust-accept-btn-handler"]');
      await expect(privacy).toBeVisible({ timeout: this.DEFAULT_TIMEOUT });
      await privacy.click({ timeout: this.SHORT_TIMEOUT });
    });
  }

  async performSuccessSignup(
    username: string,
    email: string,
    password: string,
  ) {
    await test.step(`Performing successful signup`, async () => {
      await this.fillSignup(username, email, password);
      await this.acceptTermsandConditions();

      const continueBtn = this.page.getByRole("button", { name: "Continue" });

      await continueBtn.waitFor({
        state: "visible",
        timeout: this.DEFAULT_TIMEOUT,
      });
      await expect(continueBtn).toBeEnabled({ timeout: this.DEFAULT_TIMEOUT });

      await Promise.all([
        this.page.waitForLoadState("networkidle", {
          timeout: this.DEFAULT_TIMEOUT,
        }),
        this.page.waitForLoadState("domcontentloaded", {
          timeout: this.DEFAULT_TIMEOUT,
        }),
        continueBtn.click({ timeout: this.SHORT_TIMEOUT }),
      ]);

      const balance = this.page.locator(SignupSelectors.userBalance);

      await this.waitForElementWithRetry(
        SignupSelectors.userBalance,
        this.DEFAULT_TIMEOUT,
      );

      await expect(
        this.page.locator(SignupSelectors.headerSignup),
      ).not.toBeVisible({ timeout: this.SHORT_TIMEOUT });
    });
    return this;
  }
  private async waitForStableElement(
    selector: string,
    timeout: number = this.DEFAULT_TIMEOUT,
  ): Promise<void> {
    const element = this.page.locator(selector);

    await element.waitFor({ state: "visible", timeout });

    await this.page.waitForTimeout(200);
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
