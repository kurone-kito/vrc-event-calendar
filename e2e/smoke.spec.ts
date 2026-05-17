import { expect, test } from '@playwright/test';

test('homepage responds with the starter shell', async ({ page, request }) => {
  const apiResponse = await request.get('/');
  expect(apiResponse.status()).toBe(200);

  const pageResponse = await page.goto('/');
  expect(pageResponse?.status()).toBe(200);

  await expect(
    page.getByRole('heading', {
      level: 1,
      name: /VRC Event Calendar starts with a clean, type-safe app shell\./i,
    }),
  ).toBeVisible();
});
