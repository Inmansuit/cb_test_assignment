import { test } from "../fixtures/fixtures";

test("Verify successful signup with credentials", async ({
  loginPage,
  regUser,
}) => {
  await loginPage.performSuccessLogin(regUser.user, regUser.password);
});
