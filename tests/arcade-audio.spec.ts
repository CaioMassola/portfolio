import { expect, test } from '@playwright/test';

test('arcade sound follows mute in dialogs, survives reload and stays silent in classic', async ({
  page,
}) => {
  await page.addInitScript(() => {
    localStorage.setItem('cm-language', 'en');

    const stats = { starts: 0 };

    Object.assign(window, { audioStats: stats });

    const NativeAudioContext = window.AudioContext;

    window.AudioContext = class extends NativeAudioContext {
      createOscillator() {
        const oscillator = super.createOscillator();
        const start = oscillator.start.bind(oscillator);

        oscillator.start = (when = 0) => {
          stats.starts++;
          start(when);
        };

        return oscillator;
      }
    };
  });

  const starts = () =>
    page.evaluate(
      () => (window as unknown as { audioStats: { starts: number } }).audioStats.starts,
    );

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('.arcade-sound-toggle')).toHaveCount(0);
  await page.getByRole('switch').click();
  await page.locator('.card-runner button').click();
  await page
    .getByRole('dialog')
    .getByRole('button', { name: 'Start', exact: true })
    .click();
  await expect.poll(starts).toBeGreaterThan(0);
  await page.getByRole('dialog').getByRole('button', { name: 'Mute sound' }).click();

  const mutedAt = await starts();

  await page.keyboard.press(' ');
  await page.waitForTimeout(400);
  expect(await starts()).toBe(mutedAt);
  await page.keyboard.press('Escape');
  await expect(page.locator('.header .arcade-sound-toggle')).toHaveAttribute(
    'aria-pressed',
    'false',
  );
  await page.reload();
  await expect(page.locator('.header .arcade-sound-toggle')).toHaveAttribute(
    'aria-pressed',
    'false',
  );
  await page.locator('.header .arcade-sound-toggle').click();
  await page.locator('.card-tic button').click();
  await expect.poll(starts).toBeGreaterThan(0);
  await page.keyboard.press('Escape');
  await page.getByRole('switch').click();

  const classicAt = await starts();

  await page.locator('.theme-toggle').click();
  expect(await starts()).toBe(classicAt);
});
