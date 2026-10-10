import { expect, test } from '@playwright/test';

test.use({ reducedMotion: 'reduce' });

test('mini game preserves the match while navigating, minimizing and translating', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('/');

  const panel = page.locator('.game-panel');
  const cells = page.locator('.game-board-mini button');

  await expect(panel).toBeHidden();
  await page.getByRole('button', { name: 'Abrir jogo da velha' }).click();
  await expect(panel).toBeVisible();
  await cells.nth(0).click();
  await cells.nth(1).evaluate((button) => button.click());
  await expect(page.locator('.mark-X')).toHaveCount(1);
  await expect(page.locator('.mark-O')).toHaveCount(1);
  await expect(cells.nth(4)).toHaveAttribute('aria-label', /O$/);
  await page.locator('.navigation a').last().click();
  await expect(panel).toBeInViewport();
  await page.locator('select').selectOption('en');
  await expect(page.locator('.game-status')).toHaveText('Your turn. You are X.');
  await page.getByRole('button', { name: 'Minimize game' }).click();
  await expect(panel).toBeHidden();
  await page.getByRole('button', { name: 'Open tic tac toe' }).click();
  await expect(page.locator('.mark-X')).toHaveCount(1);
  await page.getByRole('button', { name: 'Play again' }).click();
  await expect(page.locator('.game-mark')).toHaveCount(0);
  await cells.nth(0).click();
  await page.getByRole('button', { name: 'Play again' }).click();
  await page.waitForTimeout(600);
  await expect(page.locator('.game-mark')).toHaveCount(0);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Open tic tac toe' })).toBeFocused();
});

test('mobile game starts minimized and fits without horizontal overflow', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.locator('.game-panel')).toBeHidden();
  await page.getByRole('button', { name: 'Abrir jogo da velha' }).click();
  await expect(page.locator('.game-panel')).toBeInViewport();
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
  ).toBe(true);
  await page.screenshot({ path: 'test-results/mini-game-mobile.png' });
});

test('bot blocks a threat, wins and stops the match', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('/');

  const cells = page.locator('.game-board-mini button');

  await page.getByRole('button', { name: 'Abrir jogo da velha' }).click();

  await cells.nth(0).click();
  await expect(cells.nth(4)).toHaveAttribute('aria-label', /O$/);
  await cells.nth(1).click();
  await expect(cells.nth(2)).toHaveAttribute('aria-label', /O$/);
  await cells.nth(3).click();
  await expect(cells.nth(6)).toHaveAttribute('aria-label', /O$/);
  await expect(page.locator('.game-status')).toHaveText('Ganhei essa! Mais uma?');
  await expect(page.locator('.game-board-mini .is-winner')).toHaveCount(3);
  await cells.nth(8).evaluate((button) => button.click());
  await expect(page.locator('.game-mark')).toHaveCount(6);
});

test('expanding and moving focus never replay the opening animation', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');

  const game = page.locator('.mini-game');
  const panel = page.locator('.game-panel');

  for (let attempt = 0; attempt < 2; attempt++) {
    await page.getByRole('button', { name: 'Abrir jogo da velha' }).click();
    await expect(panel).toBeVisible({ timeout: 300 });
    expect(
      await game.evaluate((element) => getComputedStyle(element).animationName),
    ).toBe('none');
    await page.locator('.brand').first().focus();
    expect(await game.evaluate((element) => getComputedStyle(element).visibility)).toBe(
      'visible',
    );
    await page.getByRole('button', { name: 'Minimizar jogo' }).click();
    await expect(page.locator('.game-launcher')).toBeVisible({ timeout: 300 });
  }
});
