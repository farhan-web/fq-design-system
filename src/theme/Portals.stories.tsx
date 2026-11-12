import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { FqThemeProvider } from './FqThemeProvider';
import type { FqThemeConfig } from './tokenConfig';
import { Dialog } from '../components/Dialog/Dialog';
import { BottomSheet } from '../components/BottomSheet/BottomSheet';
import { Snackbar } from '../components/Snackbar/Snackbar';

const meta: Meta = {
  title: 'Foundations/Portals',
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj;
function Brand({ name, dark }: { name: string; dark: boolean }) {
  const [changed, setChanged] = useState(false);
  const [mode, setMode] = useState(dark);
  const [open, setOpen] = useState('');
  const [nested, setNested] = useState(false);
  const [target, setTarget] = useState('default');
  const tokens: FqThemeConfig = {
    schemaVersion: 1,
    foundation: {
      spacing: {
        '--spacing-16': changed ? '24px' : name === 'A' ? '18px' : '22px',
      },
      radius: {
        '--radius-md': changed ? '15px' : name === 'A' ? '11px' : '13px',
      },
      typography: {
        '--font-family': name === 'A' ? 'Georgia, serif' : 'monospace',
      },
    },
    semantic: {
      light: {
        '--color-primary': changed
          ? '#884422'
          : name === 'A'
            ? '#663399'
            : '#225588',
      },
      dark: {
        '--color-primary': changed
          ? '#884422'
          : name === 'A'
            ? '#663399'
            : '#225588',
      },
    },
  };
  const container =
    target === 'custom'
      ? () => document.getElementById(`portal-host-${name}`)
      : undefined;
  const inline = target === 'inline';
  const probe = (id: string) => (
    <div
      data-testid={id}
      style={{
        backgroundColor: 'var(--color-primary)',
        color: 'var(--color-text-high)',
        padding: 'var(--spacing-md)',
        gap: 'var(--spacing-md)',
        borderRadius: 'var(--radius-md)',
        fontFamily: 'var(--font-family)',
      }}
    >
      Brand {name}
    </div>
  );
  const actions = (
    <>
      <button onClick={() => setChanged(!changed)}>Update {name}</button>
      <button onClick={() => setMode(!mode)}>Mode {name}</button>
      <button onClick={() => setOpen('')}>Dismiss {name}</button>
    </>
  );
  return (
    <FqThemeProvider tokens={tokens} mode={mode ? 'dark' : 'light'}>
      <section
        data-testid={`brand-${name}`}
        style={{
          overflow: 'hidden',
          transform: 'translateZ(0)',
          height: 170,
          position: 'relative',
        }}
      >
        {probe(`inline-${name}`)}
        <select
          aria-label={`Target ${name}`}
          value={target}
          onChange={(e) => setTarget(e.target.value)}
        >
          <option value="default">Default</option>
          <option value="custom">Custom</option>
          <option value="inline">Inline</option>
        </select>
        {['dialog', 'sheet', 'snack'].map((kind) => (
          <button key={kind} onClick={() => setOpen(kind)}>
            Open {kind} {name}
          </button>
        ))}
        <Dialog
          open={open === 'dialog'}
          title={`Dialog ${name}`}
          container={container}
          disablePortal={inline}
          onClose={() => setOpen('')}
        >
          {probe(`dialog-${name}`)}
          {actions}
          <button onClick={() => setNested(true)}>Nested {name}</button>
          <Dialog
            open={nested}
            title={`Nested ${name}`}
            container={container}
            onClose={() => setNested(false)}
          >
            {probe(`nested-${name}`)}
            <button onClick={() => setNested(false)}>
              Close nested {name}
            </button>
          </Dialog>
        </Dialog>
        <BottomSheet
          open={open === 'sheet'}
          title={`Sheet ${name}`}
          container={container}
          disablePortal={inline}
          onClose={() => setOpen('')}
        >
          {probe(`sheet-${name}`)}
          {actions}
        </BottomSheet>
        <Snackbar
          open={open === 'snack'}
          disablePortal={inline}
          container={container}
          autoHideDuration={null}
          message={probe(`snack-${name}`)}
          action={actions}
          onClose={() => setOpen('')}
        />
      </section>
    </FqThemeProvider>
  );
}
export const Contracts: Story = {
  render: () => (
    <>
      <Brand name="A" dark={false} />
      <Brand name="B" dark />
      <div id="portal-host-A" />
      <div id="portal-host-B" />
    </>
  ),
};
