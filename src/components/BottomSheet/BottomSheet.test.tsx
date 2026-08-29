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
});
