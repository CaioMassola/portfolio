import { expect, test } from '@playwright/test';

test.use({ reducedMotion: 'reduce' });
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('cm-arcade', 'on'));
});

for (const width of [390, 1440]) {
  test(`prank mirrors text and restores without moving the page at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.addInitScript(() => {
      Math.random = () => 0;
    });
    await page.goto('/');
    await page.locator('.prank-button').scrollIntoViewIfNeeded();

    const before = await page.evaluate(() => scrollY);

    await page.locator('.prank-button').click();
    await expect(page.locator('.prank-message, .prank-clear')).toHaveCount(0);
    await expect(page.locator('.prank-cracks')).toBeVisible();
    expect(
      await page
        .locator('.prank-cracks')
        .evaluate((e) => getComputedStyle(e).pointerEvents),
    ).toBe('none');
    expect(
      await page.locator('.ap-contact h2').evaluate((e) => getComputedStyle(e).scale),
    ).toBe('-1 1');
    expect(await page.evaluate(() => scrollY)).toBe(before);
    await expect(page.locator('body')).not.toHaveClass(/prank-chaos/, { timeout: 12000 });
    await expect(page.locator('.prank-cracks')).toHaveCount(0);
    expect(
      await page.locator('.ap-contact h2').evaluate((e) => getComputedStyle(e).scale),
    ).toBe('none');
    expect(await page.evaluate(() => scrollY)).toBe(before);
    await expect(page.locator('.prank-button')).toHaveAttribute('aria-pressed', 'false');
  });
}

for (const [index, effect] of ['chaos', 'scribbles'].entries()) {
  test(`random effect ${effect} can be dismissed`, async ({ page }) => {
    await page.addInitScript(
      (value) => {
        Math.random = () => value;
      },
      (index + 0.1) / 2,
    );
    await page.goto('/');
    await page.locator('.prank-button').click();
    await expect(page.locator('body')).toHaveClass(new RegExp(`prank-${effect}`));

    if (effect === 'scribbles') {
      await expect(page.locator('.prank-button')).toBeFocused();
      await page.screenshot({ path: 'test-results/prank-scribbles.png' });
      await page.locator('.prank-button').click();
      await expect(page.locator('.prank-button')).toBeFocused();
    } else {
      await page.keyboard.press('Escape');
    }

    await expect(page.locator('body')).not.toHaveClass(/prank-/);
    await page.locator('.prank-button').click();
    await expect(page.locator('body')).not.toHaveClass(new RegExp(`prank-${effect}`));
    await page.keyboard.press('Escape');
    await expect(page.locator('body')).not.toHaveClass(/prank-/);
  });
}

test('earthquake animates only with motion enabled and restores after Escape', async ({
  page,
}) => {
  await page.addInitScript(() => {
    Math.random = () => 0.45;
  });
  await page.goto('/');
  await page.locator('.prank-button').click();

  const title = page.locator('.ap-contact h2');

  expect(await title.evaluate((e) => getComputedStyle(e).animationName)).toBe('none');
  expect(await title.evaluate((e) => getComputedStyle(e).rotate)).toBe('180deg');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  expect(await title.evaluate((e) => getComputedStyle(e).animationName)).toBe(
    'prank-chaos',
  );
  expect(
    await page
      .locator('.prank-button')
      .evaluate((e) => getComputedStyle(e).animationName),
  ).toBe('none');
  await page.keyboard.press('Escape');
  expect(await title.evaluate((e) => getComputedStyle(e).animationName)).toBe('none');
  expect(await title.evaluate((e) => getComputedStyle(e).rotate)).toBe('none');
});

test('question button cancels both effects immediately on second click', async ({
  page,
}) => {
  await page.addInitScript(() => {
    Math.random = () => 0;
  });
  await page.goto('/');

  const button = page.locator('.prank-button');

  for (const effect of ['chaos', 'scribbles']) {
    await button.click();
    await expect(page.locator('body')).toHaveClass(new RegExp(`prank-${effect}`));
    await expect(button).toHaveAttribute('aria-pressed', 'true');
    await button.click();
    await expect(page.locator('body')).not.toHaveClass(/prank-/);
    await expect(page.locator('.prank-cracks, .prank-scribble-overlay')).toHaveCount(0);
    await expect(button).toHaveAttribute('aria-pressed', 'false');
  }
});
