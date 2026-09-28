# Audit: Colors.stories.tsx — vs tiket.design/system/foundation/color-solid

---

## 1. Page structure

| Section | tiket.design | Ours | Match? |
|---------|-------------|------|--------|
| Hero illustration | 3D icon (color palette) | None | ❌ |
| "Foundations" label | ✅ | ✅ | ✅ |
| "Color" heading (display size) | ✅ | ✅ | ✅ |
| Description text | ✅ | ✅ | ✅ |
| Tabs: Solid color / Gradient color | ✅ | ✅ | ✅ |

---

## 2. SwatchCard layout — MAJOR DIFFERENCE

### tiket.design card:
```
┌─────────────────────────────────────┐
│                                     │  ← full-width swatch (~120px tall)
│          color block                │
│                                     │
├─────────────────────────────────────┤
│ N800                                │  ← large bold code label (~16px, 700)
│                                     │
│ HEX                       #303135   │  ← label left, value right
│ RGB                    48, 49, 53   │  ← label left, value right
└─────────────────────────────────────┘
  ← half viewport width (~480px)
```

### Our SwatchCard:
```
┌──────────────┐
│              │  ← 120px wide swatch, 80px tall
│   N800 label │  ← label inside swatch at bottom
│ (in color)   │
├──────────────┤
│ HEX          │  ← stacked vertically
│ #303135      │
│ RGB          │
│ 48, 49, 53   │
│ --color-...  │  ← CSS token (tiket.design doesn't show this)
└──────────────┘
  ← fixed 120px
```

### Gaps to fix:
| Gap | Change needed |
|-----|--------------|
| Card width | 120px → full width in 2-col grid (remove `width: 120`) |
| Code label position | Inside swatch → below swatch, large bold text |
| HEX/RGB layout | Stacked → `display: flex; justify-content: space-between` |
| Swatch height | 80px → ~110–120px |
| CSS token in card | Shown prominently → move to small secondary or remove |
| Color card label inside swatch | Remove from inside swatch |

---

## 3. Color palette sections

| Item | tiket.design | Ours | Match? |
|------|-------------|------|--------|
| Neutral palette | ✅ N800→N0 | ✅ same | ✅ |
| Brand Blue | ✅ B400→B100 | ✅ same | ✅ |
| Green | ✅ G500, G100 | ✅ same | ✅ |
| Yellow | ✅ Y100 | ✅ same | ✅ |
| Red | ✅ R400, R100 | ✅ same | ✅ |
| Orange | Not visible (tiket page scroll) | ✅ shown | - |
| Teal | Not visible | ✅ shown | - |

---

## 4. Semantic alias tables

| Section | tiket.design | Ours |
|---------|-------------|------|
| Icon color alias table | ✅ Visual \| Token \| Values (3 cols, dark header) | Check if present |
| Text color alias table | ✅ Token \| Token \| Values (3 cols) | Check if present |
| Table style | Dark header (#171918), white rows, no alternating bg, generous row padding | Likely different |

---

## 5. Gradient color tab

Not screenshotted in detail — need separate pass.

---

## Priority fixes (ranked)

1. **HIGH** SwatchCard: full-width layout, code below swatch, HEX/RGB space-between
2. **MEDIUM** Alias tables: ensure 3-col structure with dark header matches
3. **LOW** Swatch height increase
