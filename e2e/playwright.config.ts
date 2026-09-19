// Playwright config (BASE_CHECKLIST.md §D). Tests bind to data-test-id only and assert through the
// UI only. The app is already running (bin/e2e / the harness start it), so no webServer here.
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './specs', // the harness copies cpNN specs here (dest_subpath: e2e/specs)
  use: {
    baseURL: process.env.BASE_URL ?? `http://localhost:${process.env.PORT ?? 3000}`,
    // The contract attribute is data-test-id (Playwright defaults to data-testid) — DESIGN.md §3.
    testIdAttribute: 'data-test-id',
    // Strict awaiting on data-test-id presence is the flake guard (DESIGN.md §9).
  },
  // Serial + fresh reset+seed per spec (see support/seed.ts) keeps specs isolated.
  fullyParallel: false,
  reporter: [['list']],
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
