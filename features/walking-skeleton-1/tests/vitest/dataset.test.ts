// @frozen — asserts the shipped dataset's content contract from the spec:
// exactly être, fully populated per the declaration's Verb data fields, with a
// pseudo-phonetic respelling for every French surface.
import { describe, expect, it } from 'vitest'
import verbs from '@/data/verbs.json'

const SIX_PERSONS = 6

describe('shipped verb dataset', () => {
  it('contains exactly one verb: être', () => {
    expect(Array.isArray(verbs)).toBe(true)
    expect(verbs).toHaveLength(1)
    expect(verbs[0].infinitive).toBe('être')
  })

  it('fully populates être per the Verb data shape', () => {
    const etre = verbs[0]
    expect(etre.meaning.trim()).not.toBe('')
    expect(['avoir', 'être']).toContain(etre.auxiliary)
    expect(etre.present).toHaveLength(SIX_PERSONS)
    expect(etre.pastParticiple.form.trim()).not.toBe('')
    expect(etre.futureStem.form.trim()).not.toBe('')
  })

  it('carries the correct present-tense forms of être', () => {
    const forms = verbs[0].present.map((p) => p.form)
    expect(forms).toEqual(['suis', 'es', 'est', 'sommes', 'êtes', 'sont'])
  })

  it('has a pseudo-phonetic respelling for every French surface', () => {
    const etre = verbs[0]
    const surfaces = [
      etre.phonetic,
      ...etre.present.map((p) => p.phonetic),
      etre.pastParticiple.phonetic,
      etre.futureStem.phonetic,
    ]
    for (const phonetic of surfaces) {
      expect(typeof phonetic).toBe('string')
      expect(phonetic.trim()).not.toBe('')
    }
  })
})
