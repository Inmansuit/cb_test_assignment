import { test } from "../fixtures/fixtures";
import { defaultPass } from "../utils/utils";

test("Verify successful signup with credentials", async ({
  signupPage,
  testUser,
}) => {
  await signupPage.performSuccessSignup(
    testUser.alias,
    testUser.email,
    defaultPass,
  );
});
