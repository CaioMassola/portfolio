import { expect, test } from '@playwright/test';

for (const width of [390, 1920]) {
  test(`memory game works at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/');
    await expect(page.locator('.memory-panel')).toBeHidden();
    await page.getByRole('button', { name: 'Abrir jogo da memória' }).click();
    await expect(page.locator('.memory-panel')).toBeVisible({ timeout: 300 });
    await expect(page.locator('.memory-panel')).toBeInViewport();
    await expect(page.locator('.memory-card')).toHaveCount(12);
    await page.locator('.memory-card').first().click();
    await expect(page.locator('.memory-card.is-flipped')).toHaveCount(1);
    await page.getByRole('button', { name: 'Minimizar jogo da memória' }).click();
    await page.getByRole('button', { name: 'Abrir jogo da memória' }).click();
    await expect(page.locator('.memory-card.is-flipped')).toHaveCount(1);
    await page.locator('select').selectOption('en');
    await expect(page.locator('.memory-heading')).toContainText('Memory game');
    await page.locator('.memory-restart').click();
    await expect(page.locator('.memory-card.is-flipped')).toHaveCount(0);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    ).toBe(true);
    await page.screenshot({ path: `test-results/memory-${width}.png` });
    await page.keyboard.press('Escape');
    await expect(page.getByRole('button', { name: 'Open memory game' })).toBeFocused();
  });
}

test('both launchers pulse until opened without showing tooltips', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1000 });
  await page.goto('/');

  for (const selector of ['.game-launcher', '.memory-launcher']) {
    const launcher = page.locator(selector);

    await expect(launcher).toBeVisible();
    await expect(launcher).toHaveAttribute('aria-expanded', 'false');
    expect(
      await launcher.evaluate(
        (e) => getComputedStyle(e, '::before').animationIterationCount,
      ),
    ).toBe('infinite');
    await launcher.focus();
    await expect(page.getByRole('tooltip')).toBeHidden();
    await launcher.hover();
    await expect(page.getByRole('tooltip')).toBeHidden();
    await launcher.click();
    await page.keyboard.press('Escape');
    expect(
      await launcher.evaluate((e) => getComputedStyle(e, '::before').animationName),
    ).toBe('none');
  }

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload();

  for (const selector of ['.game-launcher', '.memory-launcher']) {
    expect(
      await page
        .locator(selector)
        .evaluate((e) => getComputedStyle(e, '::before').animationName),
    ).toBe('none');
  }
});
