import type { Preview } from '@storybook/react-vite';
import '../src/index.css';

const preview: Preview = {
  decorators: [
    (Story) => {
      // Force light mode in Storybook — prevents @media prefers-color-scheme:dark
      // from activating when the OS is in dark mode.
      // Toggle to 'dark' to preview dark-mode styles.
      document.documentElement.setAttribute('data-theme', 'light');
      return <Story />;
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
      test: 'todo',
    },
  },
};

export default preview;
