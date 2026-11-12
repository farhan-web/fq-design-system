import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores([
    'dist',
    'storybook-static',
    'coverage',
    'verification/reports',
  ]),

  {
    files: [
      'scripts/steering.mjs',
      'scripts/bundle-types.mjs',
      'scripts/verification-*.mjs',
      'scripts/verify-browser.mjs',
      'scripts/verify-package.mjs',
      'scripts/inventory-contracts.mjs',
      'scripts/tests/**/*.mjs',
    ],
    extends: [js.configs.recommended],
    languageOptions: { globals: globals.node },
  },

  {
    files: ['**/*.{ts,tsx}'],

    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],

    languageOptions: {
      globals: globals.browser,
    },
  },
]);
