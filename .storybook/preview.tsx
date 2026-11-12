import axe from 'axe-core';
import accessibilityPolicy from './a11y-policy.json';
import type { Preview } from '@storybook/react-vite';
import { FqThemeProvider } from '../src/theme/FqThemeProvider';
import '../src/compat.css';

const preview: Preview = {
  initialGlobals: { theme: 'light' },
  globalTypes: {
    theme: {
      description: 'Component color theme',
      toolbar: {
        icon: 'circlehollow',
        items: ['light', 'dark'],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      document.documentElement.setAttribute(
        'data-theme',
        context.globals.theme === 'dark' ? 'dark' : 'light',
      );
      return (
        <FqThemeProvider>
          <Story />
        </FqThemeProvider>
      );
    },
  ],

  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      test: 'error',
      options: {
        runOnly: {
          type: 'rule',
          values: [
            ...new Set([
              ...axe
                .getRules(accessibilityPolicy.tags)
                .map((rule) => rule.ruleId),
              ...accessibilityPolicy.extraRules,
            ]),
          ],
        },
      },
    },
  },
};

export default preview;
