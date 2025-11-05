import { expect } from "@playwright/test";
import { test } from "../fixtures/fixtures";

test("Verify successful signup", async ({ request, testUser }) => {
  const signupRes = await request.post(
    `/api/registration/signup/jackEntertainment/`,
    { data: testUser },
  );

  expect(signupRes.status()).toBe(200);

  const signupBody = await signupRes.json();
  expect(signupBody.data["signupRef"]).toBeTruthy();
});

test("Verify successful login", async ({ request, regUser }) => {
  const loginRes = await request.post(
    `/api/login/jackEntertainment/credentials`,
    {
      data: regUser,
    },
  );

  expect(loginRes.status()).toBe(200);

  const loginBody = await loginRes.json();
  expect(loginBody.status).toContain("SUCCESS");
});
