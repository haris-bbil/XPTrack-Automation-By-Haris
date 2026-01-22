import { test, expect } from '@playwright/test';
import LoginPage from '../pages/loginPage.js';

// Test data
const TEST_USERS = {
  valid: {
    username: process.env.USER_1 ?? 'haris',
    password: process.env.PASS ?? 'Kazi#12'
  },
  invalid: {
    username: process.env.USER_2 ?? 'invalid_user',
    password: process.env.PASS ?? 'wrong_pass'
  }
};

test.describe('Login Functionality Tests', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigateToLogin();
    await page.waitForLoadState('networkidle');
    await expect(loginPage.loginButton).toBeVisible();
  });

  test('Validation error for invalid credentials', async ({ page }) => {
    const { username, password } = TEST_USERS.invalid;
    await loginPage.login(username, password);
    await loginPage.verifyErrorMessage();
  });

  test('Register a new user successfully', async ({ page }) => {
    const timestamp = new Date().getTime();
    const testEmail = `testuser_${timestamp}@example.com`;
    
    // Click register button and wait for navigation
    await loginPage.registerButton.click();
    await page.waitForURL('**/register', { timeout: 10000 }); // Adjust URL pattern as needed
    await page.waitForLoadState('domcontentloaded');
    
    // Fill and submit registration form
    await loginPage.registerUser('Test', 'User', testEmail);
    
    // Verify successful registration
    await expect(loginPage.successMessage).toBeVisible({ timeout: 10000 });
    await loginPage.verifySuccessMessage();
});


  test('Login with valid credentials', async ({ page }) => {
    const { username, password } = TEST_USERS.valid;
    await loginPage.login(username, password);
    await page.waitForTimeout(3000); // Wait for 3 seconds
    await expect(page).not.toHaveURL(/\/login/i);
  });

});
