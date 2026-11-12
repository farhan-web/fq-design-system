import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../components/Button/Button';
import { Input } from '../components/Input/Input';
import { Dialog } from '../components/Dialog/Dialog';
import { BottomSheet } from '../components/BottomSheet/BottomSheet';

const meta: Meta = {
  title: 'Foundations/Overrides',
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj;
export const Contracts: Story = {
  render: function OverrideContracts() {
    const [dialog, setDialog] = useState(false);
    const [sheet, setSheet] = useState(false);
    const [count, setCount] = useState(0);
    return (
      <>
        <div data-testid="override-scope">
          <Button
            data-testid="override-button"
            classNames={{ root: 'consumer-button' }}
            slotProps={{ content: { className: 'consumer-content' } }}
            onClick={() => setCount(count + 1)}
          >
            Count {count}
          </Button>
          <Button
            data-testid="override-instance"
            style={{
              padding: 13,
              gap: 9,
              borderRadius: 17,
              color: 'rgb(12, 34, 56)',
              fontFamily: 'monospace',
            }}
            slotProps={{ root: { style: { padding: 1 } } }}
          >
            Instance
          </Button>
          <Input
            label="Custom email"
            name="email"
            helperText="A helper"
            className="native-input"
            classNames={{
              root: 'consumer-field',
              container: 'consumer-container',
              label: 'consumer-label',
            }}
            slotProps={{
              root: { style: { padding: 6 } },
              label: { style: { fontFamily: 'monospace' } },
              helperText: { 'data-testid': 'override-helper' },
            }}
          />
        </div>
        <Button data-testid="override-sibling">Sibling</Button>
        <button onClick={() => setDialog(true)}>Open custom dialog</button>
        <button onClick={() => setSheet(true)}>Open custom sheet</button>
        <Dialog
          open={dialog}
          title="Custom dialog"
          onClose={() => setDialog(false)}
          slotProps={{
            paper: { style: { borderRadius: 19 } },
            content: {
              style: { padding: 23 },
              'data-testid': 'override-dialog-content',
            },
            backdrop: { 'data-testid': 'override-dialog-backdrop' },
          }}
        >
          <button>Dialog action</button>
        </Dialog>
        <BottomSheet
          open={sheet}
          title="Custom sheet"
          onClose={() => setSheet(false)}
          slotProps={{
            root: { style: { borderRadius: 21 } },
            body: {
              style: { padding: 25 },
              'data-testid': 'override-sheet-body',
            },
            backdrop: {
              style: { backgroundColor: 'rgba(1, 2, 3, 0.5)' },
              'data-testid': 'override-sheet-backdrop',
            },
          }}
        >
          <button>Sheet action</button>
        </BottomSheet>
      </>
    );
  },
};
