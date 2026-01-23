import { test, expect } from '@playwright/test';

test('First assertion test', async ({ page }) => {
  await page.goto('https://kitchen.applitools.com/');

  //page url and title assertions
  await expect(page).toHaveURL(/.*applitools.*/);
  await expect(page).toHaveTitle(/.*Kitchen.*/);
  expect(await page.title()).toContain('Kitchen');

  //Assertion
  //Check if element is present
  await expect(page.locator('text=The Kitchen')).toHaveCount(1);
  const element = await page.$('text=The Kitchen');
  element
    ? console.log('Element is present')
    : console.log('Element is not present');

  // Check if element is visible/hidden

  await expect(page.locator('text=The Kitchen')).toBeVisible();
  await expect(page.locator('text=Non Existing Element')).toBeHidden();

  //check if element is enabled/disabled

  await expect(page.locator('text=The Kitchen')).toBeEnabled();
  // await expect.soft(page.locator('text=Non Existing Element')).toBeDisabled();
  console.log('First assertion test executed');

  // Check if element contains specific text

  await expect(page.locator('h1')).toHaveText('The Kitchen');
  await expect(page.locator('h1')).not.toHaveText('Non Matching Text');

  await expect(
    page.locator("//div[@class='css-1fzcpt6']/a[1]"),
  ).toHaveAttribute('href', '/ingredients/alert');
  await expect(page.locator('h1')).toHaveClass(/.*css-dpmy2a/);

  //visual validation
  await expect(page).toHaveScreenshot();
});
