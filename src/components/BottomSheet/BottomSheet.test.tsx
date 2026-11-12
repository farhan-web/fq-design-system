import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Dialog } from '../Dialog/Dialog';
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
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
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

    act(() => last.focus());
    fireEvent.keyDown(last, { key: 'Tab', shiftKey: false });
    // jsdom has no native Tab movement; move to MUI's end sentinel.
    act(() =>
      (
        document.querySelector('[data-testid="sentinelEnd"]') as HTMLElement
      ).focus(),
    );
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

    act(() => first.focus());
    fireEvent.keyDown(first, { key: 'Tab', shiftKey: true });
    act(() =>
      (
        document.querySelector('[data-testid="sentinelStart"]') as HTMLElement
      ).focus(),
    );
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
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(document.body.style.overflow).toBe('hidden');
  });
  it('focuses the close button after mount and restores the trigger after exit', async () => {
    const trigger = document.createElement('button');
    document.body.append(trigger);
    trigger.focus();
    const { rerender } = render(
      <BottomSheet open onClose={vi.fn()} title="Filter" />,
    );
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus(),
    );
    rerender(<BottomSheet open={false} onClose={vi.fn()} title="Filter" />);
    await waitFor(() => expect(trigger).toHaveFocus());
    trigger.remove();
  });

  it('focuses titleless content or the empty sheet fallback', async () => {
    const { rerender } = render(
      <BottomSheet open onClose={vi.fn()} aria-label="Options">
        <button>Choose</button>
      </BottomSheet>,
    );
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Choose' })).toHaveFocus(),
    );
    rerender(
      <BottomSheet open={false} onClose={vi.fn()} aria-label="Options" />,
    );
  });

  it('contains focus when there are no focusable children', () => {
    render(
      <BottomSheet open onClose={vi.fn()} aria-label="Notice">
        Read this
      </BottomSheet>,
    );
    expect(screen.getByRole('dialog', { name: 'Notice' })).toHaveFocus();
    const outside = document.createElement('button');
    document.body.append(outside);
    act(() => outside.focus());
    expect(screen.getByRole('dialog')).toHaveFocus();
    outside.remove();
  });

  it('shares Escape ownership and scroll lock with Dialog', () => {
    const sheetClose = vi.fn();
    const dialogClose = vi.fn();
    const initialOverflow = document.body.style.overflow;
    const { rerender, unmount } = render(
      <BottomSheet open onClose={sheetClose} title="Sheet" />,
    );
    rerender(
      <>
        <BottomSheet open onClose={sheetClose} title="Sheet" />
        <Dialog open onClose={dialogClose} title="Top dialog" />
      </>,
    );
    fireEvent.keyDown(screen.getByRole('dialog', { name: 'Top dialog' }), {
      key: 'Escape',
    });
    expect(dialogClose).toHaveBeenCalledTimes(1);
    expect(sheetClose).not.toHaveBeenCalled();
    expect(document.body.style.overflow).toBe('hidden');
    unmount();
    expect(document.body.style.overflow).toBe(initialOverflow);
  });

  it('cancels pending animation frames on rapid close and unmount', () => {
    const cancel = vi.spyOn(window, 'cancelAnimationFrame');
    const { rerender, unmount } = render(
      <BottomSheet open onClose={vi.fn()} />,
    );
    rerender(<BottomSheet open={false} onClose={vi.fn()} />);
    expect(cancel).toHaveBeenCalled();
    rerender(<BottomSheet open onClose={vi.fn()} />);
    unmount();
    expect(document.querySelector('.fq-bottom-sheet')).toBeNull();
    cancel.mockRestore();
  });
  it('skips hidden, disabled and negative-tabindex initial focus targets', async () => {
    render(
      <BottomSheet open onClose={vi.fn()} aria-label="Options">
        <button hidden>Hidden</button>
        <div style={{ display: 'none' }}>
          <button>Hidden ancestor</button>
        </div>
        <button disabled>Disabled</button>
        <button tabIndex={-1}>Not tabbable</button>
        <button>Available</button>
      </BottomSheet>,
    );
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Available' })).toHaveFocus(),
    );
  });

  it('keeps a rapidly reopened sheet mounted past its previous exit timeout', async () => {
    const { rerender } = render(
      <BottomSheet open title="Options" onClose={vi.fn()} />,
    );
    rerender(<BottomSheet open={false} title="Options" onClose={vi.fn()} />);
    rerender(<BottomSheet open title="Options" onClose={vi.fn()} />);
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 320));
    });
    expect(screen.getByRole('dialog', { name: 'Options' })).toBeInTheDocument();
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('keeps scroll locked when a lower sheet exits beneath a Dialog', async () => {
    const { rerender, unmount } = render(
      <>
        <BottomSheet open title="Lower sheet" onClose={vi.fn()} />
        <Dialog open title="Upper dialog" />
      </>,
    );
    rerender(
      <>
        <BottomSheet open={false} title="Lower sheet" onClose={vi.fn()} />
        <Dialog open title="Upper dialog" />
      </>,
    );
    await waitFor(() =>
      expect(document.querySelector('.fq-bottom-sheet')).toBeNull(),
    );
    expect(
      screen.getByRole('dialog', { name: 'Upper dialog' }),
    ).toBeInTheDocument();
    expect(document.body.style.overflow).toBe('hidden');
    unmount();
  });
});
