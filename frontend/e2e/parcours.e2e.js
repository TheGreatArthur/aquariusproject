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
