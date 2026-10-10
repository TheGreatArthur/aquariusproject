import { expect, test } from '@playwright/test';

test('du catalogue des plantes à une fiche avec sa carte de répartition', async ({ page }) => {
  await page.goto('/plantes');
  await page.getByRole('searchbox', { name: 'Rechercher une plante' }).fill('anubias');
  await page.getByRole('link', { name: /Anubias nain/ }).click();

  await expect(page.getByRole('heading', { level: 1, name: 'Anubias nain' })).toBeVisible();
  await expect(page.getByRole('img', { name: /Carte de répartition/ })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'En aquarium', exact: true })).toBeVisible();
});

test('du catalogue des poissons à une fiche, filtrée par famille', async ({ page }) => {
  await page.goto('/poissons?famille=Cichlidae%20africain');
  await expect(page.getByText('Famille : Cichlidae africain')).toBeVisible();

  await page.getByRole('link', { name: /Cyprichromis/ }).first().click();

  await expect(page.getByRole('heading', { level: 1 })).toContainText('Cyprichromis');
  await expect(page.getByRole('heading', { name: 'Paramètres de l\'eau' })).toBeVisible();
});

test('le simulateur signale un conflit avant et après l’ajout', async ({ page }) => {
  await page.goto('/simulation');
  await page.getByLabel(/Volume/).fill('60');
  await page.getByRole('tab', { name: /Invertébrés/ }).click();
  const recherche = page.getByRole('searchbox', { name: 'Rechercher une espèce' });

  await recherche.fill('assassin');
  await page.getByRole('button', { name: 'Ajouter Escargot assassin au bac' }).click();
  await recherche.fill('nérite tachetée');
  // La carte annonce le risque avant l'ajout
  await expect(page.getByText(/mange les autres escargots/)).toBeVisible();
  await page.getByRole('button', { name: 'Ajouter Nérite tachetée au bac' }).click();

  const verdict = page.getByRole('status');
  await expect(verdict).toContainText('Population incompatible');
  await expect(verdict).toContainText('Escargot assassin mange les autres escargots : Nérite tachetée.');
});

test('l’ancienne adresse du simulateur y mène toujours', async ({ page }) => {
  await page.goto('/simulation/starting');

  await expect(page).toHaveURL(/\/simulation$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Composez votre aquarium' })).toBeVisible();
});

test('le site publie un sitemap avec les fiches', async ({ request }) => {
  const sitemap = await (await request.get('/sitemap.xml')).text();

  expect(sitemap).toContain('/simulation</loc>');
  expect(sitemap).toMatch(/\/plantes\/\d+<\/loc>/);
});

test('la version anglaise traduit l’interface et les espèces, et garde la langue dans les liens', async ({ page }) => {
  await page.goto('/en/simulation');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.getByRole('heading', { level: 1, name: 'Build your aquarium' })).toBeVisible();

  await page.getByLabel(/Volume/).fill('60');
  await page.getByRole('tab', { name: /Invertebrates/ }).click();
  const search = page.getByRole('searchbox', { name: 'Search for a species' });
  await search.fill('assassin');
  await page.getByRole('button', { name: 'Add Assassin snail to the tank' }).click();
  await search.fill('turrita');
  await page.getByRole('button', { name: 'Add Turrita nerite to the tank' }).click();
  await expect(page.getByRole('status')).toContainText('Assassin snail eats other snails: Turrita nerite.');

  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Fish' }).click();
  await expect(page).toHaveURL(/\/en\/poissons$/);
  const header = page.getByRole('banner');
  await header.getByRole('button', { name: 'Language' }).click();
  await header.getByRole('link', { name: 'Français' }).click();
  await expect(page).toHaveURL(/\/poissons$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Les poissons' })).toBeVisible();
});

test('la version japonaise traduit les fiches et le guide pratique', async ({ page }) => {
  await page.goto('/ja/plantes');
  await expect(page.locator('html')).toHaveAttribute('lang', 'ja');
  await page.getByRole('searchbox', { name: '水草を検索' }).fill('anubias');
  await page.getByRole('link', { name: /アヌビアス・ナナ/ }).click();

  await expect(page).toHaveURL(/\/ja\/plantes\/\d+$/);
  await expect(page.getByRole('heading', { level: 1, name: 'アヌビアス・ナナ' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '水槽での育て方', exact: true })).toBeVisible();

  await page.goto('/ja/cours/cycle-azote');
  await expect(page.getByRole('heading', { level: 1, name: '窒素循環' })).toBeVisible();
  await expect(page.getByRole('link', { name: '水質', exact: true })).toHaveAttribute('href', '/ja/cours/parametres-eau#durete');
});

test('le thème clair se choisit et reste enregistré', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/');
  const html = page.locator('html');
  await expect(html).toHaveAttribute('data-theme', 'dark');

  await page.getByRole('button', { name: 'Changer de thème' }).click();
  await expect(html).toHaveAttribute('data-theme', 'light');
  await page.reload();
  await expect(html).toHaveAttribute('data-theme', 'light');
});
