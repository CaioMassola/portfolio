import { expect, test } from '@playwright/test';

for (const arcade of [false, true]) {
  test(`section entrances play once with stable navigation: arcade=${arcade}`, async ({
    page,
  }) => {
    await page.addInitScript((enabled) => {
      localStorage.setItem('cm-arcade', enabled ? 'on' : 'off');
      localStorage.setItem('cm-language', 'pt');
    }, arcade);
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/');
    await page.waitForTimeout(4000);

    const target = page.locator(arcade ? '.ap-projects h2' : '.project-card').first();

    await target.evaluate((e) => {
      e.setAttribute('data-entry-count', '0');
      e.addEventListener('animationstart', (event) => {
        if (event.target === e)
          e.setAttribute(
            'data-entry-count',
            String(Number(e.getAttribute('data-entry-count')) + 1),
          );
      });
    });
    await page
      .locator('#projetos')
      .evaluate((e) => e.scrollIntoView({ behavior: 'instant' }));
    await expect(target).toHaveAttribute('data-entry-count', '1');
    await page.waitForTimeout(1000);
    await expect(target).toHaveCSS('opacity', '1');

    const position = await page.evaluate(() => scrollY);

    await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
    await page.waitForTimeout(200);
    await page.evaluate((top) => scrollTo({ top, behavior: 'instant' }), position);
    await page.waitForTimeout(700);
    await expect(target).toHaveAttribute('data-entry-count', '1');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(target).toHaveCSS('animation-name', 'none');
  });
}
