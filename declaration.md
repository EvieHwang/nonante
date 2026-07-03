# Declaration

## What
Nonante is a French verb drill app — a PWA that teaches the ten highest-frequency French verbs across five tenses. Its core move is compression: of the nominal 300 surface forms, only ~90 primitives are memorized (60 present-tense forms, 10 past participles, 10 future stems, plus each verb's auxiliary choice); the other three tenses are derived by formula, and the app teaches the machine rather than the machine's output.

## Why
Verbs are the load-bearing structure of French — with correct verb forms in place, sentences mostly assemble themselves. The 90-vs-300 compression is the curriculum itself: a learner who knows the derivation machine can generate forms they've never drilled. And friction determines whether practice happens: two taps per card, one thumb, no login, offline — the app must fit inside a daily walk.

## For whom
A single learner (Evie) whose near-term priority is reading and listening comprehension, not speaking. She holds mental models spatially — the per-verb grid exists to be imprinted as a visual memory object — and practices one-handed (right thumb, portrait) on walks. The app trusts her: self-graded drills, no anti-cheating scaffolding, no retention mechanics.

## Out of scope
- **Persistence of any kind** — no accounts, streaks, history, or long-term tracking; the session tally resets every session (deliberate v1 constraint, not an omission)
- **Adaptive scheduling** — no SRS algorithm; static weights with weighted random sampling only
- **Gamification and retention mechanics** of any kind
- **Audio playback** — the phonetic inner voice is trained through text respellings, not recordings
- **IPA** — phonetics are pseudo-phonetic English respellings (*nous prenons* → "noo pruh-NOHN")
- **Typed or spoken answer input** — grading is mental production plus self-judgment
- **Tenses beyond the five** (passé composé, venir de, present, aller +, futur simple) and **verbs beyond the data-driven list** — though the verb list is data, not a hardcoded ten, so adding *manger* later is a data change

## Platform
Web — a PWA installed to an iPhone home screen, which is the sole target experience. Optimized for one-handed portrait use (right thumb; drill controls in the lower-right corner). Works offline once installed. Deployed on Fly.io; all verb data is static and ships with the app — no backend state. (Not an Apple-native platform, so the HIG-native lens in `/ship`'s adversarial gate does not apply, but iOS PWA constraints — installability, standalone display, offline caching — are first-class.)

## Shape (revisable)
- **Verb data** — static dataset of the ten verbs: English meanings, present-tense forms, past participles, future stems, auxiliary choice (avoir/être), and pseudo-phonetic respellings for every French surface. The verb list is data, not code.
- **Derivation engine** — pure functions that expand the primitives into all surface forms via the three formulas (aller + infinitive, venir de + infinitive, auxiliary + participle) and the universal futur-simple endings.
- **Drill sampler** — weighted random card selection (present 3×, primitives boosted, derived 1×) with a ~10-card no-repeat buffer; serves both Read and Produce directions.
- **Index screen** — entry point; the ten verbs at a glance, each opening its grid.
- **Grid view** — per-verb 6-persons × 5-tenses table; derived columns visually lighter and annotated with their formula; swipe left/right between verbs; the imprintable memory object.
- **Drill view** — two-tap flip cards with self-grading (*missed it* / *got it*), lower-right thumb controls, session tally, Read/Produce toggle, and the card → grid link that highlights the form's cell and returns state-intact.
- **PWA shell** — service worker, manifest, offline caching, home-screen installability; static hosting on Fly.io.

## Roadmap (revisable)
1. **Walking skeleton** — deployed Fly.io PWA shell with a first slice of verb data and a minimal index screen; proves install, offline, and deploy end to end. *(PWA shell, Verb data, Index screen)*
2. **Complete dataset + derivation engine** — all ten verbs with meanings and phonetics; all 300 surface forms generated and verified. *(Verb data, Derivation engine)*
3. **Grid view** — the per-verb grid with primitive/derived visual distinction, formula annotations, and swipe navigation between verbs. *(Grid view, Index screen)*
4. **Drill loop, Read mode** — flip cards with weighting, no-repeat buffer, self-grading, session tally, one-thumb controls. *(Drill view, Drill sampler)*
5. **Produce mode** — the direction toggle; English cue → French form. *(Drill view, Drill sampler)*
6. **Card → grid reference link** — from any card to its verb's grid with the specific cell highlighted; one back action returns to the same card mid-session. *(Drill view, Grid view)*
7. **Offline and install hardening** — polish the installed-PWA experience (icons, splash, cache strategy, update flow) to fully disappear on a walk. *(PWA shell)*
