import { Page, Locator, expect } from '@playwright/test';

const DEFAULT_TIMEOUT = 2000;
const DEFAULT_BASE_URL = '';

export default class LoginPage {
  private readonly page: Page;
  
  // Locators
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  public  readonly loginButton: Locator;
  private readonly errorMessage: Locator;
  public readonly  registerButton: Locator;
  public readonly successMessage: Locator;

// In the constructor
 // Adjust the selector as needed

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByRole('textbox', { name: 'User Name or Email' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.registerButton = page.getByRole('link', { name: 'Register Here'});
    this.errorMessage = page.locator('#login-form >> text=Invalid Username/Email or Password');
    this.successMessage = page.locator('#login-form >> text=User successfully registered');
  }

  async navigateToLogin(baseUrl: string = process.env.BASE_URL || DEFAULT_BASE_URL): Promise<void> {
    await this.page.goto(`${baseUrl}/login`, { 
      waitUntil: 'networkidle', 
      timeout: 10000
    
    });
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForTimeout(3000); // Wait for 3 seconds
  }

  async verifyErrorMessage(): Promise<void> {
    await expect(this.errorMessage).toBeVisible({ timeout: DEFAULT_TIMEOUT });
    await this.page.waitForTimeout(3000); // Wait for 3 seconds
  }

  async registerUser(firstName: string = 'QAE', lastName: string = 'Hasan', email: string = 'qa_hasan92@yopmail.com'): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    
    const firstNameInput = this.page.getByRole('textbox', { name: 'Enter First Name' });
    await firstNameInput.fill(firstName);
    
    const lastNameInput = this.page.getByRole('textbox', { name: 'Enter Last Name' });
    await lastNameInput.fill(lastName);
    
    const emailInput = this.page.getByRole('textbox', { name: 'Email' });
    await emailInput.fill(email);
    
    await this.page.getByRole('button', { name: 'Submit' }).click();
  
  }

  async verifySuccessMessage(): Promise<void> {
    await expect(this.successMessage).toBeVisible({ timeout: DEFAULT_TIMEOUT });
    await this.page.waitForTimeout(3000); // Wait for 3 seconds
  }
}
