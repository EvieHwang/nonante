import { defineConfig } from '@playwright/test'

// PWA seam tests run against the production build (`vite preview`) because the
// service worker only exists in a built app, never in the dev server.
export default defineConfig({
  testDir: 'features',
  testMatch: '**/tests/playwright/**/*.spec.ts',
  fullyParallel: false,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'list' : [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'on-first-retry',
  },
  projects: [
    {
      // iPhone-sized viewport on Chromium: the target device is an iPhone, but
      // service-worker automation in Playwright needs Chromium.
      name: 'iphone-viewport',
      use: {
        browserName: 'chromium',
        viewport: { width: 390, height: 844 },
        hasTouch: true,
      },
    },
  ],
  webServer: {
    command: 'pnpm build && pnpm preview --port 4173 --strictPort',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
})
