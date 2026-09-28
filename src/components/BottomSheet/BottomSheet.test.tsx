import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { BottomSheet } from './BottomSheet';

describe('BottomSheet', () => {
  it('does not render when closed', () => {
    render(
      <BottomSheet open={false} onClose={vi.fn()}>
        Content
      </BottomSheet>,
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders dialog when open', () => {
    render(
      <BottomSheet open onClose={vi.fn()}>
        Content
      </BottomSheet>,
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('renders children', () => {
    render(
      <BottomSheet open onClose={vi.fn()}>
        Sheet body
      </BottomSheet>,
    );
    expect(screen.getByText('Sheet body')).toBeInTheDocument();
  });

  it('renders title', () => {
    render(
      <BottomSheet open onClose={vi.fn()} title="Filter">
        Body
      </BottomSheet>,
    );
    expect(screen.getByText('Filter')).toBeInTheDocument();
  });

  it('shows close button when title is set', () => {
    render(
      <BottomSheet open onClose={vi.fn()} title="Filter">
        Body
      </BottomSheet>,
    );
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
  });

  it('calls onClose when close button clicked', () => {
    const onClose = vi.fn();
    render(
      <BottomSheet open onClose={onClose} title="Filter">
        Body
      </BottomSheet>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose on Escape key', () => {
    const onClose = vi.fn();
    render(
      <BottomSheet open onClose={onClose}>
        Body
      </BottomSheet>,
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('has aria-modal="true"', () => {
    render(
      <BottomSheet open onClose={vi.fn()}>
        Body
      </BottomSheet>,
    );
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
  });

  // ── B3: aria-labelledby ──────────────────────────────────────

  it('dialog is labelled by title via aria-labelledby', () => {
    render(
      <BottomSheet open onClose={vi.fn()} title="Filter">
        Body
      </BottomSheet>,
    );
    const dialog = screen.getByRole('dialog');
    const labelledById = dialog.getAttribute('aria-labelledby');
    expect(labelledById).toBeTruthy();
    const titleEl = document.getElementById(labelledById!);
    expect(titleEl).toHaveTextContent('Filter');
  });

  it('dialog has no aria-labelledby when title is absent', () => {
    render(
      <BottomSheet open onClose={vi.fn()}>
        Body
      </BottomSheet>,
    );
    expect(screen.getByRole('dialog')).not.toHaveAttribute('aria-labelledby');
  });

  // ── A2: Focus trap ───────────────────────────────────────────

  it('Tab key cycles focus forward within dialog', () => {
    render(
      <BottomSheet open onClose={vi.fn()} title="Filter">
        <button>First</button>
        <button>Second</button>
      </BottomSheet>,
    );
    const dialog = screen.getByRole('dialog');
    const buttons = dialog.querySelectorAll('button:not(:disabled)');
    const last = buttons[buttons.length - 1] as HTMLElement;

    last.focus();
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: false });
    // First button in dialog should receive focus (wraps from last)
    expect(document.activeElement).toBe(buttons[0]);
  });

  it('Shift+Tab cycles focus backward within dialog', () => {
    render(
      <BottomSheet open onClose={vi.fn()} title="Filter">
        <button>Inner</button>
      </BottomSheet>,
    );
    const dialog = screen.getByRole('dialog');
    const allButtons = Array.from(
      dialog.querySelectorAll<HTMLElement>('button:not(:disabled)'),
    );
    const first = allButtons[0];
    const last = allButtons[allButtons.length - 1];

    first.focus();
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
    // Focus wraps to last focusable element
    expect(document.activeElement).toBe(last);
  });

  it('forwards ref', () => {
    const ref = { current: null } as { current: HTMLDivElement | null };
    render(
      <BottomSheet open onClose={vi.fn()} ref={ref}>
        Body
      </BottomSheet>,
    );
    expect(ref.current).toBe(screen.getByRole('dialog'));
  });

  it('renders image slot when image prop is provided', () => {
    render(
      <BottomSheet
        open
        onClose={vi.fn()}
        image={<img src="test.jpg" alt="test" />}
      >
        Body
      </BottomSheet>,
    );
    expect(screen.getByAltText('test')).toBeInTheDocument();
  });

  it('renders icon actions when iconActions prop is provided', () => {
    const onShare = vi.fn();
    render(
      <BottomSheet
        open
        onClose={vi.fn()}
        title="Details"
        iconActions={[
          { label: 'Share', onClick: onShare, icon: <span>icon</span> },
        ]}
      >
        Body
      </BottomSheet>,
    );
    const shareBtn = screen.getByRole('button', { name: 'Share' });
    expect(shareBtn).toBeInTheDocument();
    fireEvent.click(shareBtn);
    expect(onShare).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when handle is swiped down past threshold', () => {
    const onClose = vi.fn();
    render(
      <BottomSheet open onClose={onClose}>
        Body
      </BottomSheet>,
    );
    const handle = document.querySelector('.fq-bottom-sheet__handle')!;
    fireEvent.touchStart(handle, { touches: [{ clientY: 0 }] });
    fireEvent.touchEnd(document, { changedTouches: [{ clientY: 100 }] });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when swipe delta is below threshold', () => {
    const onClose = vi.fn();
    render(
      <BottomSheet open onClose={onClose}>
        Body
      </BottomSheet>,
    );
    const handle = document.querySelector('.fq-bottom-sheet__handle')!;
    fireEvent.touchStart(handle, { touches: [{ clientY: 0 }] });
    fireEvent.touchEnd(document, { changedTouches: [{ clientY: 40 }] });
    expect(onClose).not.toHaveBeenCalled();
  });

  it('applies custom maxHeight via inline style', () => {
    render(
      <BottomSheet open onClose={vi.fn()} maxHeight="400px">
        Body
      </BottomSheet>,
    );
    expect(screen.getByRole('dialog')).toHaveStyle({ maxHeight: '400px' });
  });

  it('renders link action button when action prop is provided', () => {
    const onAction = vi.fn();
    render(
      <BottomSheet
        open
        onClose={vi.fn()}
        title="Filter"
        action={{ label: 'Reset', onClick: onAction }}
      >
        Body
      </BottomSheet>,
    );
    const actionBtn = screen.getByRole('button', { name: 'Reset' });
    expect(actionBtn).toBeInTheDocument();
    fireEvent.click(actionBtn);
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  // ── Portal rendering ─────────────────────────────────────────

  it('renders into document.body portal by default', () => {
    const { container } = render(
      <BottomSheet open onClose={vi.fn()}>
        Portal body
      </BottomSheet>,
    );
    // Dialog is NOT inside the render container (it's portalled to body)
    expect(container.querySelector('[role="dialog"]')).not.toBeInTheDocument();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('renders inline when disablePortal=true', () => {
    const { container } = render(
      <BottomSheet open onClose={vi.fn()} disablePortal>
        Inline body
      </BottomSheet>,
    );
    expect(container.querySelector('[role="dialog"]')).toBeInTheDocument();
  });
});
