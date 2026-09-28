---
"fq-design-system": patch
---

Enterprise readiness — Phase E, F, G

**TypeScript strict mode (Phase E)**
- Enabled `strict: true` and `strictNullChecks: true` in `tsconfig.app.json`
- Zero new errors — codebase was already strict-compatible

**Coverage enforcement (Phase F)**
- Configured `@vitest/coverage-v8` in `vitest.config.ts` with provider, reporters, and thresholds (lines ≥80%, functions ≥80%, branches ≥70%)
- Added `test:coverage` script to `package.json`
- Added Coverage step to `.github/workflows/ci.yml`

**Package quality (Phase G)**
- Removed `lucide-react` from `dependencies` (prevents duplicate in consumer bundles)
- Added `lucide-react` as optional `peerDependency` (≥0.400.0) + `devDependency`
- Added `sideEffects: ["**/*.css"]` for correct tree-shaking
- Added `engines: { "node": ">=18" }`
