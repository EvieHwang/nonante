# Nonante — structural design spec

Scope: app shell and visual system only. Placeholder screens are deliberately plain. Screen-level design (grid, drill) belongs to features 3 and 4 and inherits these tokens.

## Direction

Nonante is a dictionary you carry on a walk. The visual system treats each verb as a **headword** — a dictionary entry set in a bookish serif with its pronunciation line beneath in mono — on a dark, quiet surface built for sidewalks and one thumb. The one structural opinion baked in now: the color system encodes the curriculum itself — memorized primitives vs. derived forms — so later screens inherit the distinction instead of decorating it on.

## Tokens

### Color

| Token | Hex | Role |
|---|---|---|
| `ink` | `#0F1216` | App background (dark, default) |
| `surface` | `#1A1F26` | Cards, nav bar, raised elements |
| `chalk` | `#E8E4DA` | Primary text |
| `muted` | `#8A9099` | Secondary text, captions, inactive nav |
| `brass` | `#C9A227` | **Primitives / memorized forms**; primary accent, active states |
| `slate` | `#7A93B8` | **Derived forms / formula output**; secondary accent |

Semantic rule: brass always means "you memorized this," slate always means "the formula produced this." No other element may use either hue for decoration.

Light mode derives from the same tokens (chalk ↔ ink inverted, brass/slate darkened for contrast); dark is first-class and default.

### Type

| Role | Face | Use |
|---|---|---|
| Display | Instrument Serif | Headwords (verb infinitives), screen titles. Used with restraint — never body text. |
| Body | Schibsted Grotesk | Everything else. 14px base, line-height 1.35, tight tracking. Information-dense per constitution. |
| Utility | Spline Sans Mono | Pseudo-phonetic respellings, formula annotations. Phonetics are a code you pronounce. |

Scale (px): 28 headword / 20 title / 14 body / 12 caption.

### Spacing & shape

- 4px base unit; screens padded 16px.
- Radius 10px on cards, 0 on the nav bar.
- Hit targets ≥ 44px.

## Signature: the headword

Every verb, everywhere it appears as an entry, renders as:

```
être                ← Instrument Serif, 28px, chalk
EH-truh             ← Spline Sans Mono, 12px, muted, small caps feel
to be               ← Schibsted Grotesk, 14px, muted
```

This is the app's one memorable element. Everything around it stays quiet.

## Shell

- **Portrait, one right thumb.** Persistent bottom navigation bar (surface, hairline top border): two items — **Verbs**, **Drill** — right-weighted within thumb arc. Active item in brass.
- Screen titles top-left in Instrument Serif; no actions live only at the top.
- Safe-area insets respected (home indicator, notch).

## Screens (structural placeholders)

1. **Verbs (index)** — title "Verbs"; a list of headword cards on `surface`. Tapping a card navigates to that verb's grid placeholder.
2. **Grid placeholder** — title is the verb's infinitive as a headword; stub body in muted: "Conjugation grid lives here — feature 3." Back returns to index.
3. **Drill placeholder** — title "Drill"; stub body in muted: "The drill loop lives here — feature 4."

Error state (malformed dataset): chalk heading "Verb data didn't load," muted body naming the failure. Never a blank screen.

## Quality floor

- Contrast ≥ 4.5:1 for body text on ink and surface.
- Visible keyboard focus; `prefers-reduced-motion` respected (skeleton ships no motion).
- No hover-dependent affordances — touch-first.

See `shell-mockup.html` for a static structural rendering of the three screens.
