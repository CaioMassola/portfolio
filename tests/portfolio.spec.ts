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
      .evaluate(
        (element) => getComputedStyle(element).gridTemplateColumns.split(' ').length,
      );

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

  const resumes = [
    '/Caio-Massola-CV-PT.pdf',
    '/Caio-Massola-CV-EN.pdf',
    '/Caio-Massola-CV-ES.pdf',
  ];

  for (const resume of resumes) {
    expect((await page.request.get(resume)).status()).toBe(200);
  }

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

test('action tooltips support keyboard, Escape, hover and translations', async ({
  page,
}) => {
  await page.goto('/');
  await page.locator('select').selectOption('en');

  const button = page.getByRole('button', { name: 'Switch to light theme' });
  const tooltip = page.getByRole('tooltip');

  await button.focus();
  await expect(tooltip).toHaveText('Switch to light theme');
  await expect(button).toHaveAttribute(
    'aria-describedby',
    (await tooltip.getAttribute('id')) as string,
  );
  await page.keyboard.press('Escape');
  await expect(tooltip).toBeHidden();
  await expect(button).toBeFocused();
  await expect(button).not.toHaveAttribute('aria-describedby');
  await button.hover();
  await expect(tooltip).toBeVisible();
  await tooltip.hover();
  await expect(tooltip).toBeVisible();
  await button.click();
  await expect(tooltip).toHaveText('Switch to dark theme');
  await page.mouse.move(0, 0);
  await expect(tooltip).toBeHidden();
  await expect(page.locator('.theme-toggle')).toBeFocused();
  await page.locator('.theme-toggle').hover();
  await expect(tooltip).toHaveText('Switch to dark theme');
  await page.locator('.theme-toggle').click();
  await expect(tooltip).toHaveText('Switch to light theme');
  await page.locator('h1').click();
  await expect(tooltip).toBeHidden();
  await page.locator('select').selectOption('pt');
  await page.locator('.theme-toggle').blur();
  await page.locator('.theme-toggle').focus();
  await expect(tooltip).toHaveText(
    (await page.locator('.theme-toggle').getAttribute('aria-label')) as string,
  );
});

test('tooltips stay dismissed when returning to the page', async ({ page }) => {
  await page.goto('/');

  const link = page.locator('.hero-socials a').first();
  const tooltip = page.getByRole('tooltip');

  await link.focus();
  await expect(tooltip).toBeVisible();
  await page.evaluate(() => {
    window.dispatchEvent(new Event('blur'));
    window.dispatchEvent(new Event('pagehide'));
    window.dispatchEvent(new Event('pageshow'));
    window.dispatchEvent(new Event('focus'));
    document.activeElement?.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
  });
  await expect(tooltip).toBeHidden();
  await expect(link).not.toHaveAttribute('aria-describedby');
  await page.keyboard.press('Tab');
  await expect(tooltip).toBeVisible();
  await page.evaluate(() => window.dispatchEvent(new Event('blur')));
  await expect(tooltip).toBeHidden();
  await link.hover();
  await expect(tooltip).toBeVisible();
});

test('tooltips fit the mobile viewport and describe icon links', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.locator('.menu-toggle').focus();

  const tooltip = page.getByRole('tooltip');

  await expect(tooltip).toBeVisible();

  const bounds = await tooltip.boundingBox();

  expect(bounds!.x).toBeGreaterThanOrEqual(8);
  expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(382);
  await page.locator('.hero-socials a').first().focus();
  await expect(tooltip).toHaveText('GitHub');
});
