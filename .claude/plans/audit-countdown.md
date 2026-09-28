# Audit: Countdown — vs tiket.design/system/component/countdown

---

## Variants comparison

| Variant | tiket.design | Ours | Match? |
|---------|-------------|------|--------|
| Danger | ✅ (red) | ✅ `variant="danger"` | ✅ |
| Warning | ✅ (yellow/orange) | ✅ `variant="warning"` | ✅ |
| Neutral | ✅ (grey) | ✅ `variant="neutral"` | ✅ |

## Properties

| Property | tiket.design | Ours | Match? |
|----------|-------------|------|--------|
| Height | 20px | check CSS | ⚠️ check |
| Border radius | 4px | check CSS | ⚠️ check |
| Typography | body3-bold | check CSS | ⚠️ check |
| seconds prop | ✅ countdown from N seconds | ✅ `seconds` prop | ✅ |
| targetDate prop | ✅ countdown to a date | ✅ `targetDate` prop | ✅ |
| showHours | ✅ HH:MM:SS format | ✅ `showHours` prop | ✅ |
| Milliseconds display | ✅ removable (MM:SS.ms) | ❌ missing | **GAP** |

---

## Gaps to fix

| Priority | Gap | Fix needed |
|----------|-----|-----------|
| **LOW** | Missing milliseconds display | Add `showMilliseconds` boolean prop — renders `.ms` suffix with 2-digit centiseconds |

---

## No-action items

- `variant` (danger/warning/neutral) — our naming matches tiket.design
- `seconds` + `targetDate` dual input — our API matches
- `showHours` — matches tiket.design HH:MM:SS toggle
