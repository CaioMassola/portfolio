import { expect, test } from '@playwright/test';

for (const width of [390, 1440]) {
  test(`terminal commands, history, autocomplete and games at ${width}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.addInitScript(() => {
      localStorage.setItem('cm-arcade', 'on');
      localStorage.setItem('cm-language', 'en');
    });
    await page.goto('/');

    const expand = page.getByRole('button', { name: 'Expand terminal' });

    await expand.click();

    const modal = page.getByRole('dialog');
    const input = modal.getByRole('textbox', { name: 'Command' });

    await expect(input).toBeFocused();
    await input.fill('hel');
    await input.press('Tab');
    await expect(input).toHaveValue('help');
    await input.press('Enter');
    await expect(modal.getByRole('log')).toContainText('play snake');
    await input.fill('draft');
    await input.press('ArrowUp');
    await expect(input).toHaveValue('help');
    await input.press('ArrowDown');
    await expect(input).toHaveValue('draft');
    await input.fill('projects');
    await input.press('Enter');
    await expect(modal.getByRole('log')).toContainText('Tic Tac Toe');
    await input.fill('<script>alert(1)</script>');
    await input.press('Enter');
    await expect(modal.getByRole('log')).toContainText('Unknown command');
    await input.fill('clear');
    await input.press('Enter');
    await expect(modal.getByRole('log')).toBeEmpty();
    await input.fill('play snake');
    await input.press('Enter');
    await expect(page.getByRole('dialog')).toHaveCount(1);
    await expect(page.getByRole('dialog').getByRole('heading')).toHaveText('Snake');
    await page.keyboard.press('Escape');
    await expect(modal.getByRole('heading')).toHaveText('TERMINAL');
    await expect(modal.getByRole('log')).toContainText(
      'Game closed. Back to the terminal.',
    );
    await expect(modal.getByRole('log')).not.toContainText('Opening Snake');
    await expect(modal.getByRole('log')).toContainText('play snake');
    await expect(input).toBeFocused();
    await input.fill('contact');
    await input.press('Enter');
    await expect(modal.getByRole('link')).toHaveCount(0);
    await expect(modal).toBeVisible();

    const result = JSON.parse(await modal.locator('pre').last().innerText());

    expect(result.email).toBe('chmassola@gmail.com');
    await expect(input).toBeFocused();
    expect(new URL(page.url()).hash).toBe('');

    for (const command of ['about', 'projects', 'skills']) {
      await input.fill(command);
      await input.press('Enter');
      expect(JSON.parse(await modal.locator('pre').last().innerText())).toBeTruthy();
      await expect(modal).toBeVisible();
    }

    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    ).toBe(true);
  });
}
