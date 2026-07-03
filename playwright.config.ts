import { existsSync } from 'node:fs'
import { defineConfig } from '@playwright/test'

// Claude Code cloud sandboxes pre-install Chromium at a fixed path and block
// re-downloading; CI installs browsers matching the pinned @playwright/test
// version and takes the default resolution.
const sandboxChromium = '/opt/pw-browsers/chromium'
const useSandboxChromium = !process.env.CI && existsSync(sandboxChromium)

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
    launchOptions: {
      executablePath: useSandboxChromium ? sandboxChromium : undefined,
    },
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
