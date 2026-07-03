// @vitest-environment node
// @scaffolding — asserts the deploy workflow's contract (spec requirement 5)
// at the config level: push to main runs tests, build, flyctl deploy, and a
// post-deploy health probe that can fail the job. Step names and layout are
// free to vary; the trigger, the ordering (probe after deploy), and the
// presence of tests and a bounded-retry probe are the behavior. Actual
// execution is verified live after merge (see spec ## Coverage).
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { parse } from 'yaml'

const workflowPath = new URL(
  '../../../../.github/workflows/deploy.yml',
  import.meta.url,
)

type Step = { run?: string; uses?: string; name?: string }

function loadWorkflow() {
  return parse(readFileSync(workflowPath, 'utf8'))
}

function allSteps(workflow: Record<string, unknown>): Step[] {
  const jobs = workflow.jobs as Record<string, { steps?: Step[] }>
  return Object.values(jobs).flatMap((job) => job.steps ?? [])
}

function stepText(step: Step): string {
  return [step.run, step.uses, step.name].filter(Boolean).join(' ')
}

describe('deploy workflow', () => {
  it('triggers on push to main', () => {
    const wf = loadWorkflow()
    // YAML parses the `on:` key as boolean true unless quoted; accept either.
    const on = wf.on ?? wf[true as unknown as string]
    expect(on.push.branches).toContain('main')
  })

  it('runs both test suites and the production build', () => {
    const text = allSteps(loadWorkflow()).map(stepText).join('\n')
    expect(text).toMatch(/pnpm (run )?test\b/)
    expect(text).toMatch(/pnpm (run )?test:e2e\b/)
    expect(text).toMatch(/pnpm (run )?build\b/)
  })

  it('deploys with flyctl, then probes the live app before declaring success', () => {
    const steps = allSteps(loadWorkflow())
    const deployIndex = steps.findIndex((s) =>
      /flyctl deploy|fly deploy/.test(stepText(s)),
    )
    expect(deployIndex).toBeGreaterThanOrEqual(0)

    const probeIndex = steps.findIndex(
      (s, i) => i > deployIndex && /health|probe|curl/i.test(stepText(s)),
    )
    expect(probeIndex).toBeGreaterThan(deployIndex)

    // The probe retries within a bounded window rather than failing on the
    // first request or waiting forever.
    const probe = stepText(steps[probeIndex])
    expect(probe).toMatch(/retry|for\b|attempt/i)
  })
})
