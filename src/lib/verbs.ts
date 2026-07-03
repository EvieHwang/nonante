export interface SurfaceForm {
  form: string
  phonetic: string
}

export interface PresentForm extends SurfaceForm {
  person: string
}

export interface Verb {
  infinitive: string
  meaning: string
  phonetic: string
  auxiliary: 'avoir' | 'être'
  present: PresentForm[]
  pastParticiple: SurfaceForm
  futureStem: SurfaceForm
}

export type ParseResult =
  | { ok: true; verbs: Verb[] }
  | { ok: false; error: string }

const PERSONS_PER_TENSE = 6

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim() !== ''
}

function surfaceError(
  label: string,
  value: unknown,
): string | null {
  if (typeof value !== 'object' || value === null) {
    return `missing its ${label}`
  }
  const { form, phonetic } = value as Record<string, unknown>
  if (!isNonEmptyString(form)) return `has no form for its ${label}`
  if (!isNonEmptyString(phonetic)) {
    return `has no phonetic respelling for its ${label}`
  }
  return null
}

function verbError(raw: unknown, index: number): string | null {
  if (typeof raw !== 'object' || raw === null) {
    return `entry ${index + 1} is not a verb record`
  }
  const verb = raw as Record<string, unknown>
  const name = isNonEmptyString(verb.infinitive)
    ? `“${verb.infinitive}”`
    : `entry ${index + 1}`

  if (!isNonEmptyString(verb.infinitive)) return `${name} has no infinitive`
  if (!isNonEmptyString(verb.meaning)) return `${name} has no English meaning`
  if (!isNonEmptyString(verb.phonetic)) {
    return `${name} has no phonetic respelling for its infinitive`
  }
  if (verb.auxiliary !== 'avoir' && verb.auxiliary !== 'être') {
    return `${name} has no auxiliary choice (avoir or être)`
  }

  if (!Array.isArray(verb.present)) {
    return `${name} is missing its present-tense forms`
  }
  if (verb.present.length !== PERSONS_PER_TENSE) {
    return `${name} has ${verb.present.length} present-tense forms, expected ${PERSONS_PER_TENSE}`
  }
  for (const entry of verb.present) {
    if (typeof entry !== 'object' || entry === null) {
      return `${name} has a malformed present-tense entry`
    }
    const { person, form, phonetic } = entry as Record<string, unknown>
    if (
      !isNonEmptyString(person) ||
      !isNonEmptyString(form) ||
      !isNonEmptyString(phonetic)
    ) {
      return `${name} has an incomplete present-tense entry (person, form, and phonetic are all required)`
    }
  }

  return (
    surfaceError('past participle', verb.pastParticiple) ??
    surfaceError('future stem', verb.futureStem)
  )?.replace(/^/, `${name} `) ?? null
}

export function parseVerbs(data: unknown): ParseResult {
  if (!Array.isArray(data)) {
    return { ok: false, error: 'The dataset is not a list of verbs.' }
  }
  if (data.length === 0) {
    return { ok: false, error: 'The dataset contains no verbs.' }
  }
  for (const [index, raw] of data.entries()) {
    const error = verbError(raw, index)
    if (error) return { ok: false, error: `${error}.` }
  }
  return { ok: true, verbs: data as Verb[] }
}
