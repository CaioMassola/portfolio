import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('cm-language', 'pt'));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.getByRole('switch').click();
});

test('arcade switches, persists and returns to classic without changing the theme', async ({
  page,
}) => {
  await expect(page.getByRole('heading', { name: 'Escolha o jogo' })).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('data-arcade', 'true');

  const theme = await page.locator('html').getAttribute('data-theme');

  await page.reload();
  await expect(page.getByRole('heading', { name: 'Escolha o jogo' })).toBeVisible();
  await page.getByRole('switch').click();
  await expect(page.locator('.hero-code')).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('data-theme', theme!);
  await expect(page.locator('html')).toHaveAttribute('data-arcade', 'false');
});

for (const name of ['Capivara Run', 'Cobrinha', 'Blocos']) {
  test(`${name}: start, pause, restart, escape and focus`, async ({ page }) => {
    const launch = page.getByRole('button', { name: `Jogar: ${name}`, exact: true });

    await launch.click();

    const modal = page.getByRole('dialog');

    await expect(modal).toBeVisible();
    await modal.getByRole('button', { name: 'Começar', exact: true }).click();
    await page.keyboard.press('p');
    await expect(modal.getByRole('status')).toHaveText('Jogo pausado');

    const before = await modal.locator('.arcade-score').innerText();

    await page.waitForTimeout(400);
    expect(await modal.locator('.arcade-score').innerText()).toBe(before);
    await modal.getByRole('button', { name: 'Continuar', exact: true }).first().click();
    await page.keyboard.press('ArrowUp');
    await modal.getByRole('button', { name: 'Recomeçar', exact: true }).click();
    await expect(modal.getByRole('status')).toHaveText('Tudo pronto?');
    await page.keyboard.press('Escape');
    await expect(modal).toHaveCount(0);
    await expect(launch).toBeFocused();
  });
}

test('mobile layout and touch controls, existing games, language', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
  ).toBeTruthy();
  await page.getByRole('button', { name: 'Jogar: Capivara Run', exact: true }).click();
  await page.getByRole('button', { name: 'Começar', exact: true }).click();
  await page.getByRole('button', { name: 'Pular', exact: true }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: 'Sair do jogo' }).click();
  await page.getByRole('button', { name: 'Jogar: Jogo da velha', exact: true }).click();
  await page.getByRole('button', { name: 'Começar', exact: true }).click();
  await expect(page.getByRole('dialog').locator('.game-board-mini')).toBeVisible();
  await page.getByRole('button', { name: 'Sair do jogo' }).click();
  await page.getByRole('button', { name: 'Jogar: Memória', exact: true }).click();
  await page.getByRole('button', { name: 'Começar', exact: true }).click();
  await expect(page.getByRole('dialog').locator('.memory-board')).toBeVisible();
  await page.getByRole('button', { name: 'Sair do jogo' }).click();
  await page.locator('select').selectOption('en');
  await expect(page.getByRole('heading', { name: 'Choose your game' })).toBeVisible();
  await page.locator('select').selectOption('es');
  await expect(page.getByRole('heading', { name: 'Elige tu juego' })).toBeVisible();
});
test('runner ends, persists record and can be replayed', async ({ page }) => {
  await page.getByRole('button', { name: 'Jogar: Capivara Run', exact: true }).click();
  await page.getByRole('button', { name: 'Começar', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('Fim de jogo', { timeout: 8000 });
  expect(
    await page.evaluate(() => Number(localStorage.getItem('cm-arcade-runner'))),
  ).toBeGreaterThan(0);
  await page
    .getByRole('dialog')
    .getByRole('button', { name: 'Recomeçar', exact: true })
    .first()
    .click();
  await expect(page.getByRole('dialog').getByRole('status')).toHaveCount(0);
});

test('five cards and expanded memory fit desktop and mobile; classic stays compact', async ({
  page,
}) => {
  await expect(page.locator('.arcade-cards .arcade-card')).toHaveCount(5);

  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await page.locator('.card-memory button').click();
    await page.getByRole('button', { name: 'Começar', exact: true }).click();
    await expect(page.locator('.memory-card')).toHaveCount(24);

    const panel = page.getByRole('dialog');

    await expect(panel).toBeVisible();

    const rect = await panel.boundingBox();

    expect(rect!.x).toBeGreaterThanOrEqual(0);
    expect(rect!.x + rect!.width).toBeLessThanOrEqual(width);

    const columns = await page
      .locator('.memory-board')
      .evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(' ').length);

    expect(columns).toBe(width > 760 ? 6 : 4);
    await page.getByRole('button', { name: 'Sair do jogo' }).click();
    await expect(page.locator('.card-memory button')).toBeFocused();
  }

  await page.getByRole('switch').click();
  await page.locator('.memory-launcher').click();
  await expect(page.locator('.memory-card')).toHaveCount(12);
});

test('arcade has its own colored sections, tools and project selector in every language', async ({
  page,
}) => {
  await expect(page.locator('.ap-section')).toHaveCount(5);
  await expect(page.locator('.about-introduction')).toHaveCount(0);

  const colors = await page
    .locator('.ap-section')
    .evaluateAll((sections) =>
      sections.map((section) => getComputedStyle(section).backgroundColor),
    );

  expect(new Set(colors).size).toBe(5);

  for (const language of ['pt', 'en', 'es']) {
    await page.locator('select').selectOption(language);

    for (let i = 0; i < 3; i++) {
      await page.locator('.ap-kit-picker button').nth(i).click();
      await expect(page.locator('.ap-kit-content li')).toHaveCount([5, 3, 6][i]);
    }

    for (let i = 0; i < 5; i++) {
      await page.locator('.ap-project-picker button').nth(i).click();
      await expect(page.locator('.ap-project-detail h3')).toHaveText(
        [
          'Tic Tac Toe',
          'Tic Tac Toe API',
          'LoL Quiz',
          'Block Boost Arena',
          'Price Alert Bot',
        ][i],
      );
    }

    await expect(page.locator('.ap-project-image')).toHaveAttribute(
      'href',
      'https://github.com/CaioMassola/price-alert-bot',
    );
    await expect(page.locator('.ap-contact-options a').first()).toHaveAttribute(
      'href',
      /wa.me/,
    );
  }

  await page.locator('.ap-stages summary').first().click();
  await expect(page.locator('.ap-stages details').first()).toHaveAttribute('open', '');
  await page.getByRole('switch').click();
  await expect(page.locator('.about-introduction')).toBeVisible();
  await expect(page.locator('.ap-section')).toHaveCount(0);
  await page.locator('.projects-section').scrollIntoViewIfNeeded();
  await expect(page.locator('.projects-section')).toBeVisible();
});

test('arcade section layouts fit narrow screens and section links still work', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });

  for (const selector of [
    '.ap-about',
    '.ap-skills',
    '.ap-career',
    '.ap-projects',
    '.ap-contact',
    '.ap-footer',
  ]) {
    await page.locator(selector).scrollIntoViewIfNeeded();
    expect(
      await page.locator(selector).evaluate((el) => el.scrollWidth <= innerWidth),
    ).toBeTruthy();
  }

  await page.locator('.menu-toggle').click();
  await page.locator('.navigation a').nth(2).click();
  await expect(page).toHaveURL(/#projetos$/);
  await expect(page.locator('.ap-projects')).toBeInViewport();
});

for (const game of ['tic', 'memory'] as const) {
  test(`${game} plays in the shared modal, resets and restores focus on Escape`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });

    const launcher = page.locator(`.card-${game} button`);

    await launcher.click();

    const dialog = page.getByRole('dialog');

    await expect(dialog).toBeVisible();
    expect((await dialog.boundingBox())!.width).toBeGreaterThan(1000);
    expect(await page.evaluate(() => document.body.style.overflow)).toBe('hidden');
    await expect(page.locator('aside.mini-game, aside.memory-game')).toHaveCount(0);
    await dialog.getByRole('button', { name: 'Começar', exact: true }).click();

    if (game === 'tic') {
      await dialog.locator('.game-board-mini button').first().click();
      await expect(dialog.locator('.mark-X')).toHaveCount(1);
      await expect(dialog.locator('.mark-O')).toHaveCount(1);
      await dialog.getByRole('button', { name: 'Recomeçar', exact: true }).click();
      await expect(dialog.locator('.game-mark')).toHaveCount(0);
    } else {
      await dialog.locator('.memory-card').first().click();
      await expect(dialog.locator('.memory-card.is-flipped')).toHaveCount(1);
      await dialog.getByRole('button', { name: 'Recomeçar', exact: true }).click();
      await expect(dialog.locator('.memory-card.is-flipped')).toHaveCount(0);
    }

    await page.keyboard.press('Escape');
    await expect(dialog).toHaveCount(0);
    await expect(launcher).toBeFocused();
    expect(await page.evaluate(() => document.body.style.overflow)).not.toBe('hidden');
  });
}

for (const width of [390, 1440]) {
  test(`section arrows advance through arcade at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });

    const next = page.locator('.section-navigation button').last();

    for (const id of ['sobre', 'technologies', 'experiencia', 'projetos', 'contato']) {
      await next.click();
      await page.waitForTimeout(900);
      if (id === 'contato') continue;
      await expect
        .poll(async () =>
          page
            .locator(`#${id}`)
            .evaluate((e) => Math.round(e.getBoundingClientRect().top)),
        )
        .toBeLessThanOrEqual(127);
      await page.waitForTimeout(100);
    }

    await expect(next).toBeDisabled();

    for (let i = 0; i < 5; i++) {
      await page.locator('.section-navigation button').first().click();
      await page.waitForTimeout(900);
    }

    await expect(page.locator('.section-navigation button').first()).toBeDisabled();
    await expect(page.locator('.prank-button')).toHaveCount(1);
    await page.getByRole('switch').click();
    await expect(page.locator('.prank-button')).toHaveCount(0);
  });
}

test('game buttons fill cards and snake hover changes from green to red', async ({
  page,
}) => {
  const button = page.locator('.card-snake .arcade-button');

  await button.scrollIntoViewIfNeeded();
  await expect(button).toHaveCSS('background-color', 'rgb(114, 245, 44)');
  await button.hover();
  await expect(button).toHaveCSS('background-color', 'rgb(255, 101, 71)');

  for (const control of await page.locator('.arcade-card .arcade-button').all()) {
    expect(
      await control.evaluate((e) =>
        Math.abs(
          e.getBoundingClientRect().width -
            e.parentElement!.getBoundingClientRect().width,
        ),
      ),
    ).toBeLessThan(1);
  }

  await expect(page.locator('.arcade-intro-actions button')).toHaveCount(0);
  await expect(
    page.locator('a .lucide-arrow-right, a .lucide-arrow-up-right'),
  ).toHaveCount(0);
  await page.getByRole('switch').click();
  await expect(
    page.locator('a .lucide-arrow-right, a .lucide-arrow-up-right'),
  ).toHaveCount(0);
});
