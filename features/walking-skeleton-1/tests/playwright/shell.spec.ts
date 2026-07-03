// @frozen — requirement 2's physical constraint: persistent navigation
// anchored at the bottom of the viewport in a portrait iPhone-sized window,
// with thumb-sized targets. Asserted as rendered geometry, not CSS shape.
import { expect, test } from '@playwright/test'

test('persistent navigation is anchored at the bottom of the viewport', async ({
  page,
}) => {
  await page.goto('/')
  const nav = page.getByRole('navigation')
  await expect(nav).toBeVisible()

  const viewport = page.viewportSize()!
  const box = (await nav.boundingBox())!

  // Bottom edge sits at (or within a hairline of) the viewport bottom, and
  // the bar itself lives in the bottom quarter of the screen.
  expect(box.y + box.height).toBeGreaterThanOrEqual(viewport.height - 2)
  expect(box.y).toBeGreaterThan(viewport.height * 0.75)
})

test('navigation targets are at least 44px tall', async ({ page }) => {
  await page.goto('/')
  const nav = page.getByRole('navigation')
  for (const name of [/verbs/i, /drill/i]) {
    const box = (await nav.getByRole('link', { name }).boundingBox())!
    expect(box.height).toBeGreaterThanOrEqual(44)
  }
})

test('navigation stays anchored on the placeholder screens', async ({
  page,
}) => {
  await page.goto('/drill')
  const nav = page.getByRole('navigation')
  const viewport = page.viewportSize()!
  const box = (await nav.boundingBox())!
  expect(box.y + box.height).toBeGreaterThanOrEqual(viewport.height - 2)
})
