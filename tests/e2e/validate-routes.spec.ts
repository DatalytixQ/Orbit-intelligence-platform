import { test, expect } from '@playwright/test';

const ROUTES = [
  '/',
  '/sales',
  '/finance',
  '/finance/dso-analytics',
  '/inventory',
  '/supply',
  '/admin/product-maturity',
  '/insights'
];

test.describe('Validate Application Routes', () => {
  for (const route of ROUTES) {
    test(`Route ${route} should load without console errors and display content`, async ({ page }) => {
      const consoleErrors: string[] = [];
      
      page.on('console', msg => {
        if (msg.type() === 'error') {
          // Exclude expected 401s or minor warning logs
          const text = msg.text();
          if (!text.includes('favicon.ico') && !text.includes('401')) {
            consoleErrors.push(text);
          }
        }
      });

      page.on('pageerror', exception => {
        consoleErrors.push(`Uncaught exception: "${exception}"`);
      });

      await page.addInitScript(() => {
        localStorage.setItem('datalytixq_token', 'dummy-token');
      });

      const response = await page.goto(route);
      
      // Wait for network idle to ensure all API calls finish
      await page.waitForLoadState('networkidle');

      expect(response?.status()).toBe(200);
      if (consoleErrors.length > 0) {
        console.error(`Route ${route} has errors:`, consoleErrors);
      }
      expect(consoleErrors.length).toBe(0);
      
      // Basic check that page rendered something
      const bodyText = await page.textContent('body');
      expect(bodyText?.length).toBeGreaterThan(100);
    });
  }
});
