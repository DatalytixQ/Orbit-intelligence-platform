import { test } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

const VIEWPORTS = [
  { name: 'Mobile', width: 390, height: 844 },
  { name: 'Tablet', width: 768, height: 1024 },
  { name: 'Notebook_Small', width: 1024, height: 768 },
  { name: 'Notebook_Medium', width: 1280, height: 800 },
  { name: 'Notebook_Large', width: 1440, height: 900 },
  { name: 'Desktop', width: 1920, height: 1080 }
];

const ROUTES = [
  { name: 'dashboard', path: '/' },
  { name: 'sales', path: '/sales' },
  { name: 'finance', path: '/finance' },
  { name: 'inventory', path: '/inventory' },
  { name: 'supply', path: '/supply' },
  { name: 'maturity', path: '/admin/product-maturity' }
];

test.describe('Capture Baseline Screenshots', () => {
  for (const viewport of VIEWPORTS) {
    test.describe(`Viewport: ${viewport.name}`, () => {
      test.use({ viewport: { width: viewport.width, height: viewport.height } });

      for (const route of ROUTES) {
        test(`Capture ${route.name}`, async ({ page }) => {
          // Add a dummy token to bypass login redirect in AppShell
          await page.addInitScript(() => {
            localStorage.setItem('datalytixq_token', 'dummy-token');
          });

          await page.goto(route.path);
          // Wait for content to load or at least network idle
          await page.waitForTimeout(1000); 

          const dir = path.join(process.cwd(), '..', 'artifacts', 'screenshots', 'after', viewport.name);
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }

          const filename = path.join(dir, `${route.name}.png`);
          await page.screenshot({ path: filename, fullPage: true });
        });
      }
    });
  }
});
