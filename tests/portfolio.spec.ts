import { expect, test } from '@playwright/test';

for (const width of [390, 1440, 1920, 2560]) {
  test(`editorial project grid adapts at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/');

    const cards = page.locator('.project-card');

    await expect(cards).toHaveCount(4);
    await expect(cards.first()).toBeVisible();
    await expect(page.locator('.carousel-controls')).toBeHidden();

    const columns = await page
      .locator('.project-carousel')
      .evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(' ').length);

    expect(columns).toBe(width <= 760 ? 1 : 2);
  });
}

test('extracted sections retain photo, CV, links and saved preferences', async ({
  page,
}) => {
  await page.goto('/');
  await page.locator('select').selectOption('en');
  await page.getByRole('button', { name: 'Switch to light theme' }).click();
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'make a difference.',
  );
  await page.locator('select').selectOption('es');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'marcan la diferencia.',
  );
  await expect(page.locator('.portrait-frame img')).toHaveJSProperty(
    'naturalWidth',
    1075,
  );
  expect((await page.request.get('/Caio-Massola-CV.pdf')).status()).toBe(200);

  const repositories = [
    'tic-tac-toe',
    'tic-tac-toe-backend',
    'lol-quiz',
    'block-boost-arena',
  ];
  const links = page.locator('.project-links > a:first-child');

  await expect(links).toHaveCount(repositories.length);

  for (const [index, repository] of repositories.entries()) {
    await expect(links.nth(index)).toHaveAttribute(
      'href',
      'https://github.com/CaioMassola/' + repository,
    );
    await expect(links.nth(index)).toHaveAttribute('target', '_blank');
  }
});
