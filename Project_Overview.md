# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This repository is a Playwright-based end-to-end test suite for the XPTrack web application, focused primarily on login and registration flows against the staging environment at `https://stage.xptracklocal.test` (and related staging URLs).

## Code Structure and Architecture

- `playwright.config.ts`
  - Canonical Playwright configuration (TypeScript). `testDir` is set to `./test`, so only files under `test/` are executed by default.
  - Uses `BASE_URL` from the environment when set; otherwise defaults to `https://stage.xptracklocal.test`. Tests typically navigate via `page.goto()` inside page objects using this base URL.
  - Runs tests non-headless by default (`headless: false`), with HTML + console/list reporters and `trace: 'on'` for easier debugging.
  - CI-specific behavior: retries and workers are adjusted when `CI` is truthy.
- `playwright.config.js`
  - Older JavaScript configuration that also targets `./test`. The TypeScript config is the primary one; prefer updating `playwright.config.ts` when changing global test behavior.
- `pages/`
  - `loginPage.ts`
    - A page-object wrapper around the login and registration screens.
    - Encapsulates all locators for username/password inputs, login button, register link, and success/error messages.
    - Provides high-level methods:
      - `navigateToLogin(baseUrl?: string)` – navigates to `${baseUrl || BASE_URL || ''}/login` and waits for network idle.
      - `login(username, password)` – fills credentials and submits the form, then waits briefly.
      - `verifyErrorMessage()` – asserts that the invalid-credentials message is visible.
      - `registerUser(firstName, lastName, email)` – fills the registration form and submits it.
      - `verifySuccessMessage()` – asserts that the registration success message is visible.
    - Tests should prefer going through this page object instead of duplicating raw locators.
  - `LocatorsGet.ts`
    - A scratch file of exploratory Playwright scripts; currently commented out and not part of the main suite.
- `test/`
  - Primary Playwright specs executed by the TS config.
  - `loginTest.spec.ts`
    - Main suite for login/registration behavior, organized under `test.describe('Login Page Tests Cases', ...)`.
    - Uses the `LoginPage` page object and a `TEST_USERS` constant that pulls credentials from environment variables with hard-coded fallbacks.
    - Covers:
      - Validation of error message for invalid credentials.
      - Successful registration via the Register flow.
      - Successful login with valid credentials (asserts navigation away from `/login`).
  - `test-1.spec.ts` and `test-2.spec.ts`
    - Marked with `test.skip` and act as direct, inline UI flows for registration and door management.
    - These tests do not use the page-object layer and rely on specific staging URLs and detailed locators; treat them as prototypes or references rather than canonical tests.
- `tests-examples/`
  - `demo-todo-app.spec.ts` and `demo-todo-app.spec.js`
    - Copies of Playwright's TodoMVC example tests, targeting `https://demo.playwright.dev/todomvc`.
    - The TypeScript version is fully commented; the JavaScript version is partially active with some helper functions commented out.
    - These files live outside `test/`, so they are not run by default given `testDir: './test'`. Treat them as examples/reference material.

## Common Commands

All commands assume the current working directory is the repository root (`XPTrack-Automation-By-Haris`).

### Install dependencies

- Install Node dependencies:
  - `npm install`

### Run the full Playwright test suite

- Run all tests using the configured `playwright.config.ts`:
  - `npm test`
- Run in headed mode (browser UI visible):
  - `npm run test:headed`
- Run in Playwright UI mode for interactive debugging:
  - `npm run test:ui`
- Run with Playwright debug mode enabled:
  - `npm run test:debug`

### Run a subset of tests

Use Playwright's CLI arguments passed through `npm` to target specific files or tests.

- Run only the login tests in `test/loginTest.spec.ts`:
  - `npm test -- test/loginTest.spec.ts`
- Run a single test by its title (example for the valid login test):
  - `npm test -- test/loginTest.spec.ts -g "Login with valid credentials"`

### Reports and artifacts

- Run tests, generate an HTML report, and open it:
  - `npm run test:report`
- Open the most recent HTML report without rerunning tests:
  - `npm run report:show`
- Clear Playwright result and report directories (implementation uses `rm -rf` on `test-results/` and `playwright-report/`):
  - `npm run report:clear`

## Environment and Configuration

- Base URL
  - `playwright.config.ts` sets `use.baseURL` to `process.env.BASE_URL || 'https://stage.xptracklocal.test'`.
  - Tests that call `LoginPage.navigateToLogin()` will navigate to `${BASE_URL || default}/login`.
- Login credentials
  - `test/loginTest.spec.ts` defines `TEST_USERS` using environment variables with fallbacks:
    - `TEST_USERS.valid.username` from `USER_1` (default `'haris'`).
    - `TEST_USERS.valid.password` from `PASS` (default `'Kazi#12'`).
    - `TEST_USERS.invalid.username` from `USER_2` (default `'invalid_user'`).
    - `TEST_USERS.invalid.password` from `PASS` (default `'wrong_pass'`).
  - To avoid relying on the hard-coded defaults, set `USER_1`, `USER_2`, and `PASS` in the environment when running tests.
- `.env` loading
  - Both `playwright.config.js` and `playwright.config.ts` contain commented-out `dotenv` setup for reading a `.env` file.
  - Currently, environment variables must be provided by the shell/CI environment; enabling `.env` support requires uncommenting the relevant `dotenv` code in the chosen config.

## Notes for Future Agents

- Treat `playwright.config.ts` as the source of truth for Playwright configuration; keep it up to date if you add new projects, reporters, or change the test directory.
- When extending coverage for XPTrack flows, favor adding new methods and assertions to `pages/loginPage.ts` (or new page-object classes in `pages/`) and using them from specs under `test/`, rather than creating more ad hoc tests like `test-1.spec.ts` / `test-2.spec.ts`.
- Keep new, runnable specs under `test/` so they are automatically picked up by the configured `testDir`.
- If you need additional example patterns for advanced Playwright usage, refer to the TodoMVC specs in `tests-examples/`, but avoid moving them into `test/` unless you deliberately want them as part of the suite.
