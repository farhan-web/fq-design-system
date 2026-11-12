import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../components/Button/Button';
import { FqThemeProvider } from './FqThemeProvider';
import type { FqDensity, FqThemeConfig } from './tokenConfig';
import { Dialog } from '../components/Dialog/Dialog';
import { BottomSheet } from '../components/BottomSheet/BottomSheet';
import { Snackbar } from '../components/Snackbar/Snackbar';
import { Tooltip } from '../components/Tooltip/Tooltip';
import { Coachmark } from '../components/Coachmark/Coachmark';

const meta: Meta = {
  title: 'Foundations/Overlay density',
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj;
export const Contracts: Story = {
  render: function OverlayDensity(_args, context) {
    const [kind, setKind] = useState('');
    const [density, setDensity] = useState<FqDensity>('comfortable');
    const [brand, setBrand] = useState(false);
    const dark = context.globals.theme === 'dark';
    const surface = dark ? '#443355' : '#f2eaff';
    const tokens: FqThemeConfig = {
      schemaVersion: 1,
      ...(brand
        ? {
            components: {
              dialog: {
                '--fq-dialog-surface-raised': surface,
                '--fq-dialog-font-family': 'Georgia, serif',
                '--fq-dialog-radius-lg': '13px',
              },
              bottomSheet: {
                '--fq-bottom-sheet-surface-raised': surface,
                '--fq-bottom-sheet-font-family': 'Georgia, serif',
                '--fq-bottom-sheet-radius-xl': '13px',
              },
              tooltip: {
                '--fq-tooltip-neutral-800': '#663399',
                '--fq-tooltip-font-family': 'Georgia, serif',
                '--fq-tooltip-radius-md': '13px',
              },
              coachmark: {
                '--fq-coachmark-surface-raised': surface,
                '--fq-coachmark-font-family': 'Georgia, serif',
                '--fq-coachmark-radius-md': '13px',
              },
              snackbar: {
                '--fq-snackbar-neutral-900': '#663399',
                '--fq-snackbar-font-family': 'Georgia, serif',
                '--fq-snackbar-radius-md': '13px',
              },
            },
          }
        : {}),
    };
    const panel = () => (
      <div style={{ display: 'grid', gap: 4 }}>
        <select
          aria-label="Overlay density"
          value={density}
          onChange={(e) => setDensity(e.target.value as FqDensity)}
        >
          {['compact', 'comfortable', 'spacious'].map((v) => (
            <option key={v}>{v}</option>
          ))}
        </select>
        <Button size="sm" onClick={() => setBrand(!brand)}>
          Brand
        </Button>
        <Button size="sm" onClick={() => setKind('')}>
          Dismiss dense
        </Button>
      </div>
    );
    return (
      <>
        <FqThemeProvider
          tokens={tokens}
          density={density}
          mode={dark ? 'dark' : 'light'}
        >
          <div>
            {['dialog', 'sheet', 'snack', 'tooltip', 'coachmark'].map((v) => (
              <button
                key={v}
                onClick={() => {
                  setBrand(false);
                  setKind(v);
                }}
              >
                Open dense {v}
              </button>
            ))}
          </div>
          {kind === 'tooltip' && panel()}
          <Dialog
            open={kind === 'dialog'}
            title="Dense dialog"
            onClose={() => setKind('')}
          >
            <p>Dialog description</p>
            {panel()}
          </Dialog>
          <BottomSheet
            open={kind === 'sheet'}
            title="Dense sheet"
            onClose={() => setKind('')}
          >
            <p>Sheet description</p>
            {panel()}
          </BottomSheet>
          <Snackbar
            open={kind === 'snack'}
            disablePortal={false}
            autoHideDuration={null}
            message="Status"
            action={panel()}
          />
          <div
            style={{ display: 'flex', justifyContent: 'center', marginTop: 48 }}
          >
            <Tooltip
              open={kind === 'tooltip'}
              onClose={() => setKind('')}
              content="Helpful information"
              placement="bottom"
            >
              <button>Tooltip trigger</button>
            </Tooltip>
            <Coachmark
              open={kind === 'coachmark'}
              title="Dense coachmark"
              body={
                <>
                  <p>Coachmark description</p>
                  {panel()}
                </>
              }
              onDone={() => setKind('')}
              onSkip={() => setKind('')}
              placement="bottom"
            >
              <button>Coachmark anchor</button>
            </Coachmark>
          </div>
        </FqThemeProvider>
        <output data-testid="overlay-density-outside">Outside scope</output>
      </>
    );
  },
};
