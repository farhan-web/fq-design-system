# Audit: Elevation.stories.tsx — vs tiket.design/system/foundation/elevation

---

## 1. Page structure

| Section | tiket.design | Ours | Match? |
|---------|-------------|------|--------|
| Hero illustration | 3D stacked layers icon | None | ❌ |
| "Foundations" + "Elevation" heading | ✅ | ✅ | ✅ |
| Description text | ✅ | ✅ | ✅ |
| Layers section | ✅ | ✅ | ✅ |
| Shadow scale (X/Y/Blur/Alpha) | ✅ technical format | ✅ semantic cards | ❌ (different format) |
| Overlaps diagram | ✅ | ✅ | ❌ (different visual) |
| Stacks diagram | ✅ | ✅ | ❌ (different visual) |
| Z-Index Tokens table | ❌ | ✅ our addition | (our addition) |

---

## 2. Layers section (3 cards: 00 / 01 / 02)

### tiket.design:
- Light gray outer container (no shadow on container itself)
- 3 equal-width cards side by side
- Each card: white background, subtle border, NO individual elevation shown
- Large index number (00/01/02) — gray/muted (~28px, light weight)
- "Usage :" label below
- Bullet list of usage items
- **No elevation token label shown**

### Ours:
- Light gray outer container (--color-neutral-100) ✅
- 3 equal-width cards ✅
- Each card: actual elevation shadow applied (level 01 has elevation-01, level 02 has elevation-02)
- Large index number (28px, bold, --color-text-high) — heavier/darker than tiket.design
- "Raised" / "Overlay" badge chip in blue
- "Usage :" label + usage items ✅
- z-index token shown at bottom of each card

### Gaps:
| Gap | tiket.design | Ours | Fix |
|-----|-------------|------|-----|
| Index number weight | Light/muted gray | Bold, dark | Change `fontWeight: 700` → lighter, color → `--color-text-low` |
| Elevation badge | ❌ not present | Blue badge chip | Remove or make optional |
| Card shadow | None (flat) | Shows actual elevation | Remove shadow from layer 00/01/02 cards? |
| z-index token | ❌ not shown | Shown at bottom | Keep as developer addition |

---

## 3. Shadow scale display — DIFFERENT FORMAT

### tiket.design format:
```
[color swatch] [X] [Y] [Blur] [Alpha]
   #303135       0    0    0    100     ← level 00 (no shadow)
   #303135       0    2    8    16      ← level 01
   #303135       0    4   12    20      ← level 02 (IOS/Web)
   #000000       0    4   12    18      ← level 02 (Android — exception)
```
Shows raw CSS shadow parameters in boxed input-like fields.

### Our format:
4 semantic cards (elevation-01 → elevation-04) each showing:
- shadow applied as card shadow
- Token name
- Usage description

### Verdict:
Our format is more useful for web developers. tiket.design's format is more useful for designers (matches Figma shadow parameters). **Keep ours** — it's an improvement.

---

## 4. Overlaps diagram — DIFFERENT VISUAL

### tiket.design:
- 3-column side-by-side layout (00 | 01 | 02)
- Large gray index numbers (00, 01, 02) at top of each column
- White rectangular cards floating above light-blue surface
- Dashed vertical lines from number to card
- Monochromatic — no color coding, no text labels on cards
- Clean, minimal

### Ours:
- Sequential left→right comparison: "Layer 00" → (arrow) → "Card overlaps" → (arrow) → "Dropdown overlaps"
- Text labels inside each card/element
- Arrow (→) separators between states
- Shows step-by-step progression

### Fix:
Change Overlaps to 3-column side-by-side layout matching tiket.design:
```
00          01          02
[flat bg]   [card ↑]    [dropdown ↑↑]
  0px         +4px         +8px
```
Remove arrow separators. Use large muted index numbers above each column. Keep cards white/monochromatic.

---

## 5. Stacks diagram — DIFFERENT VISUAL

### tiket.design:
- Horizontal line diagram: each level shown as a horizontal line
- Level index (00/01/02) on far left
- Line extends right with label at end: "Cards default", "Button & Card Raised (On Hover)", "Background Level"
- Line length indicates relative z-order
- Clean, minimal, no color coding

### Ours:
- Stacked overlapping cards (physical z-stack visual)
- Each card has colored border (blue, purple, green, red, gray)
- Legend on the right with label + z-index token + value
- Much more complex

### Verdict:
Our stacked card visual is actually more intuitive for showing what "elevation" means physically. tiket.design's line diagram is simpler but less visceral. **Consider keeping ours** — it better demonstrates the concept.

---

## 6. Remaining token gaps in story code

| Location | Current | Proposed |
|----------|---------|----------|
| LayerCard index number | `fontSize: '28px', fontWeight: 700` | `var(--font-size-3xl)`, `var(--font-weight-bold)` |
| LayerCard badge label | `fontSize: '12px', fontWeight: 600` | `var(--font-size-sm)`, `var(--font-weight-semibold)` |
| LayerCard "Usage:" label | `fontSize: '12px'` | `var(--font-size-sm)` |
| LayerCard code element | `fontSize: '11px'` | `var(--font-size-xs)` |
| ShadowCard token code | `fontSize: '11px'` | `var(--font-size-xs)` |
| ZIndexTable `<th>` | `fontWeight: 600` | `var(--font-weight-semibold)` |
| ZIndexTable token `<td>` | `fontSize: '12px'` | `var(--font-size-sm)` |
| OverlapsDiagram card labels | `fontSize: '12px'` | `var(--font-size-sm)` |
| OverlapsDiagram z-index labels | `fontSize: '11px'` | `var(--font-size-xs)` |

---

## Priority fixes (ranked)

1. **HIGH** Overlaps diagram: change to 3-column side-by-side (matching tiket.design)
2. **MEDIUM** LayerCard: make index number lighter (muted, not bold dark)
3. **LOW** Font size token cleanups
4. **KEEP** Shadow Scale cards, Z-Index table (useful additions not in tiket.design)
5. **KEEP** Stacks colored diagram (more expressive than tiket.design's line version)
