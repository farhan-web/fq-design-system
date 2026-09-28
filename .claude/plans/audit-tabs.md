# Audit: Tabs — vs tiket.design/system/component/tabs

---

## Variants comparison

| Variant | tiket.design | Ours | Match? |
|---------|-------------|------|--------|
| Default (light) | ✅ | ✅ | ✅ |
| **Invert (dark bg)** | ✅ dark surface variant | ❌ missing | **GAP** |

## States

| State | tiket.design | Ours | Match? |
|-------|-------------|------|--------|
| Default | ✅ | ✅ | ✅ |
| Active / Selected | ✅ (3px bottom indicator, B400) | ✅ | ✅ |
| Disabled tab | ✅ | ✅ | ✅ |

## Properties

| Property | tiket.design | Ours | Match? |
|----------|-------------|------|--------|
| Tab height | 52px | check CSS | ⚠️ check |
| Full-width | ✅ stretch to container | check `fullWidth` | ⚠️ check |
| Active indicator | 3px bottom border, B400 | check CSS | ⚠️ check |
| Tab icon | 20x20, removable | ❌ missing | **GAP** |
| Badge in tab | ✅ red / green badge, removable | ❌ missing | **GAP** |
| Typography | body3-bold (active) / body3-regular | check CSS | ⚠️ check |
| Controlled | ✅ | ✅ (value + onChange) | ✅ |
| Uncontrolled | ✅ | ✅ (defaultValue) | ✅ |

---

## Gaps to fix

| Priority | Gap | Fix needed |
|----------|-----|-----------|
| **HIGH** | Missing `invert` / dark variant | Add Tab/TabList invert prop: N800 bg surface, N0 active indicator |
| **MEDIUM** | Missing icon in Tab | Add `icon` prop to Tab sub-component (ReactNode, 20x20) |
| **MEDIUM** | Missing badge in Tab | Add `badge` prop to Tab sub-component (renders Badge inline) |

---

## No-action items

- Controlled/uncontrolled split — our API matches tiket.design pattern
- TabList / Tab / TabPanel sub-component split — kept as-is
