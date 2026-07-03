// @frozen — the PWA seams from spec requirements 3 and 4: a valid standalone
// manifest, and the service worker rendering the data-driven index with the
// network gone. These run against the production build (see playwright.config).
import { expect, test } from '@playwright/test'

test.describe('installable PWA (requirement 3)', () => {
  test('serves a valid manifest: name, icons, standalone display', async ({
    page,
    request,
  }) => {
    await page.goto('/')
    const href = await page
      .locator('link[rel="manifest"]')
      .getAttribute('href')
    expect(href).toBeTruthy()

    const response = await request.get(new URL(href!, page.url()).toString())
    expect(response.ok()).toBe(true)

    const manifest = await response.json()
    expect(manifest.name).toBeTruthy()
    expect(manifest.display).toBe('standalone')
    const sizes = (manifest.icons ?? []).map((i: { sizes: string }) => i.sizes)
    expect(sizes).toContain('192x192')
    expect(sizes).toContain('512x512')
  })
})

test.describe('offline (requirement 4)', () => {
  test('after one online load, relaunching offline renders the index with data', async ({
    page,
    context,
  }) => {
    // First visit, online: let the service worker install and precache.
    await page.goto('/')
    await expect(page.getByText('être')).toBeVisible()
    await page.evaluate(async () => {
      const registration = await navigator.serviceWorker.ready
      if (!registration.active) throw new Error('no active service worker')
    })

    // Network gone; a full reload must come from the cache.
    await context.setOffline(true)
    await page.reload()

    await expect(page.getByText('être')).toBeVisible()
    await expect(page.getByText('to be')).toBeVisible()
    await expect(page.getByText('EH-truh')).toBeVisible()
  })

  test('offline, navigation to the placeholders still works', async ({
    page,
    context,
  }) => {
    await page.goto('/')
    await page.evaluate(async () => {
      await navigator.serviceWorker.ready
    })

    await context.setOffline(true)
    await page.reload()

    await page.getByRole('link', { name: /drill/i }).click()
    await expect(
      page.getByRole('heading', { name: /drill/i }),
    ).toBeVisible()
  })
})
