import { test, expect } from '@playwright/test';

test.skip('test', async ({ page }) => {
  await page.goto('https://stage.xptracklocal.test/login');
  await page.getByRole('textbox', { name: 'User Name or Email' }).click();
  await page.getByRole('textbox', { name: 'User Name or Email' }).fill('haris');
  await page.getByRole('textbox', { name: 'User Name or Email' }).press('Tab');
  await page.getByRole('textbox', { name: 'Password' }).fill('Kazi#12');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.goto('https://stage.xptracklocal.test/profile');
  await page.getByRole('link', { name: 'Doors Doors' }).click();
  await page.getByRole('link', { name: 'Doors Doors' }).click();
  await page.getByRole('button', { name: 'Add New' }).click();
  await page.getByRole('textbox', { name: 'Group Name *' }).click();
  await page.getByRole('textbox', { name: 'Group Name *' }).fill('Door 001');
  await page.getByRole('textbox', { name: 'Group Name *' }).press('Tab');
  await page.locator('#select2-zone_1_id-container').click();
  await page.locator('#select2-zone_1_id-container').click();
  await page.getByRole('treeitem', { name: 'Building' }).click();
  await page.getByText('×Building').click();
  await page.getByRole('treeitem', { name: 'Outside' }).click();
  await page.getByText('Please Select End Zone').click();
  await page.getByRole('combobox', { name: 'Please Select End Zone' }).click();
  await page.getByRole('treeitem', { name: 'Building' }).click();
  await page.getByRole('button', { name: 'Save' }).click();
  await page.goto('https://stage.xptracklocal.test/doors/2/view');
  await page.getByText('Successfully Saved').click();
});