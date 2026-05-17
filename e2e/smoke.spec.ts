import { expect, test } from '@playwright/test';

test('home page loads and displays at least one event card', async ({
  page,
}) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', { level: 1, name: 'VRChat Events' }),
  ).toBeVisible();

  const eventLinks = page.locator('a[href^="/events/"]');
  await expect(eventLinks.first()).toBeVisible();
});

test('clicking an event card opens the detail page with the event title visible', async ({
  page,
}) => {
  await page.goto('/');

  const firstLink = page.locator('a[href^="/events/"]').first();
  const titleText = await firstLink.textContent();
  await firstLink.click();

  await expect(page).toHaveURL(/\/events\//);

  if (titleText) {
    await expect(
      page.getByRole('heading', { name: titleText.trim() }),
    ).toBeVisible();
  }
});

test('create event form submits successfully and redirects to event detail page', async ({
  page,
}) => {
  await page.goto('/events/new');

  await page.getByLabel(/title/i).fill('E2E Test Event');
  await page.getByLabel(/start/i).fill('2026-12-01T10:00');
  await page.getByLabel(/end/i).fill('2026-12-01T12:00');

  const categorySelect = page.getByLabel(/category/i);
  await categorySelect.selectOption('SOCIAL');

  await page.getByRole('button', { name: /create|submit/i }).click();

  await expect(page).toHaveURL(/\/events\/[^/]+$/);
  await expect(
    page.getByRole('heading', { name: 'E2E Test Event' }),
  ).toBeVisible();
});
