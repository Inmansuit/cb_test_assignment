import { expect, request as baseRequest } from "@playwright/test";
import { test } from "../fixtures/fixtures";

test("Verify user has registration bonus", async ({
  request,
  regUser,
  bonusData,
}) => {
  const loginRes = await request.post(
    `/api/login/jackEntertainment/credentials`,
    { data: regUser },
  );
  expect(loginRes.status()).toBe(200);

  const loginBody = await loginRes.json();
  const userId = loginBody.data.player.playerGuid;
  const userToken = loginBody.data.token;

  const authContext = await baseRequest.newContext({
    extraHTTPHeaders: {
      "GAN-API-PLAYER": userId,
      "GAN-API-TOKEN": userToken,
    },
  });

  const bonusRes = await authContext.post(`/api/accounts/movements/`, {
    data: bonusData,
  });

  expect(bonusRes.status(), "Bonus request should succeed").toBe(200);

  const json = await bonusRes.json();
  const bonuses = json.data ?? [];

  expect(bonuses.length, "Bonus list should not be empty").toBeGreaterThan(0);

  const regBonus = bonuses.find((b: any) =>
    b.description?.toLowerCase().includes("registration"),
  );

  expect(
    regBonus,
    "Registration bonus should exist after signup",
  ).toBeDefined();
});
