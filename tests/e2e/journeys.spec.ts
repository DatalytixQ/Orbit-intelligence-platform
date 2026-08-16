import { test, expect } from '@playwright/test';

test.describe('User Journey Validation', () => {

  test('User can login and view dashboard', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@vonderk.com');
    await page.fill('input[type="password"]', 'Admin1234!');
    await page.click('button:has-text("Entrar")');
    
    // Should navigate to dashboard
    await expect(page).toHaveURL('/');
    
    // Dashboard should load
    await expect(page.locator('h1').first()).toBeVisible();
    await expect(page.locator('text=DatalytixQ')).toBeVisible();
  });

  test('Navigation to Sales module', async ({ page }) => {
    // Inject auth token manually for direct navigation
    await page.addInitScript(() => {
      document.cookie = "datalytixq_token=fake_token_for_test; path=/; max-age=28800";
    });

    await page.goto('/sales');
    await expect(page.locator('text=Ventas Consolidadas')).toBeVisible();
  });

  test('Navigation to Finance module', async ({ page }) => {
    await page.addInitScript(() => {
      document.cookie = "datalytixq_token=fake_token_for_test; path=/; max-age=28800";
    });

    await page.goto('/finance');
    await expect(page.locator('text=Finanzas')).toBeVisible();
  });

  test('Navigation to Inventory module', async ({ page }) => {
    await page.addInitScript(() => {
      document.cookie = "datalytixq_token=fake_token_for_test; path=/; max-age=28800";
    });

    await page.goto('/inventory');
    await expect(page.locator('text=Inventario')).toBeVisible();
  });

  test('Middleware protects routes', async ({ page }) => {
    // Clear cookies
    await page.context().clearCookies();
    
    await page.goto('/sales');
    // Should be redirected to login
    await expect(page).toHaveURL(/\/login/);
  });
});
