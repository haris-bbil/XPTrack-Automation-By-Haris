import { test, expect } from '@playwright/test';
import LoginPage from '../pages/loginPage';

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

  test('Validation error for invalid credentials', async () => {
    const { username, password } = TEST_USERS.invalid;
    await loginPage.login(username, password);
    await loginPage.verifyErrorMessage();
  });


  test('Register a new user successfully', async ({ page }) => {
    // Generate unique email for each test run
    const timestamp = new Date().getTime();
    const testEmail = 'harismifta92@gmail.com'
    //`testuser_${timestamp}@example.com`;
    
    // Fill and submit registration form
    await loginPage.registerUser('Test', 'User', testEmail);
    
    // Verify success message is displayed
    await loginPage.verifySuccessMessage();
  });


  test('Login with valid credentials', async ({ page }) => {
    const { username, password } = TEST_USERS.valid;
    await loginPage.login(username, password);
    await page.waitForTimeout(3000); // Wait for 3 seconds
    await expect(page).not.toHaveURL(/\/login/i);
  });

});
