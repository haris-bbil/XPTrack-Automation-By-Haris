import { test, expect } from '@playwright/test';

test('should login and search for a user', async ({ page }) => {
  // Navigate to login page
  await page.goto('https://telaeris.xptrackstaging.com/login');
  
  // Login flow with explicit waits
  await page.getByPlaceholder('User Name or Email').waitFor({ state: 'visible' });
  await page.getByPlaceholder('User Name or Email').fill('haris');
  await page.getByPlaceholder('Password').fill('Kazi#12');
  await page.getByRole('button', { name: 'Login' }).click();
  
  // Wait for 2FA prompt and verify it's visible
  const twoFactorPrompt = page.getByText('Your two-factor');
  await expect(twoFactorPrompt).toBeVisible({ timeout: 10000 });

  // Navigate to Users page and wait for navigation
  await Promise.all([
    page.waitForLoadState('networkidle'),
    page.getByRole('link', { name: 'Users Users' }).click()
  ]);  
  // Search for user with proper waits
  const searchBox = page.getByPlaceholder('Search...', { exact: true });
  await searchBox.waitFor({ state: 'visible' });
  await searchBox.click();
  await searchBox.fill('mifta');
  //await searchBox.press('Enter');
  await page.getByRole('button', { name: '', exact: true }).click();
  const userLink = page.getByRole('link', { name: 'QA Mifta' });
  await userLink.waitFor({ state: 'visible' });
  await userLink.click();
  await expect(page.getByText('QA Mifta', { exact: true })).toBeVisible({ timeout: 10000 });  
});