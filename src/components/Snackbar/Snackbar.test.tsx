import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Snackbar } from './Snackbar';

describe('Snackbar', () => {
  // ── Rendering ─────────────────────────────────────────────────────────

  it('renders message when open', () => {
    render(<Snackbar open message="Saved successfully" />);
    expect(screen.getByText('Saved successfully')).toBeInTheDocument();
  });

  it('does not render visible content when closed', () => {
    const { container } = render(
      <Snackbar open={false} message="Hidden message" />,
    );
    // MUI Snackbar unmounts content when closed
    expect(container.querySelector('.fq-snackbar')).not.toBeInTheDocument();
  });

  // ── Variant ───────────────────────────────────────────────────────────

  it('applies no extra class for default variant', () => {
    render(<Snackbar open message="msg" />);
    const el = document.querySelector('.fq-snackbar') as HTMLElement;
    expect(el).not.toHaveClass('fq-snackbar--info');
    expect(el).not.toHaveClass('fq-snackbar--success');
    expect(el).not.toHaveClass('fq-snackbar--warning');
    expect(el).not.toHaveClass('fq-snackbar--error');
  });

  it.each(['info', 'success', 'warning', 'error'] as const)(
    'applies variant class for variant="%s"',
    (variant) => {
      render(<Snackbar open message="msg" variant={variant} />);
      expect(document.querySelector('.fq-snackbar')).toHaveClass(
        `fq-snackbar--${variant}`,
      );
    },
  );

  // ── Action ────────────────────────────────────────────────────────────

  it('renders action when provided', () => {
    render(
      <Snackbar open message="Item deleted" action={<button>Undo</button>} />,
    );
    expect(screen.getByRole('button', { name: 'Undo' })).toBeInTheDocument();
  });

  it('does not render action slot when action is absent', () => {
    render(<Snackbar open message="msg" />);
    expect(
      document.querySelector('.fq-snackbar__action'),
    ).not.toBeInTheDocument();
  });

  // ── onClose ───────────────────────────────────────────────────────────

  it('calls onClose with reason "timeout" after autoHideDuration', async () => {
    vi.useFakeTimers();
    const onClose = vi.fn();
    render(
      <Snackbar open message="msg" autoHideDuration={1000} onClose={onClose} />,
    );
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(onClose).toHaveBeenCalledWith(null, 'timeout');
    vi.useRealTimers();
  });

  it('does not auto-hide when autoHideDuration=null', async () => {
    vi.useFakeTimers();
    const onClose = vi.fn();
    render(
      <Snackbar open message="msg" autoHideDuration={null} onClose={onClose} />,
    );
    act(() => {
      vi.advanceTimersByTime(10000);
    });
    expect(onClose).not.toHaveBeenCalled();
    vi.useRealTimers();
  });

  // ── Accessibility ─────────────────────────────────────────────────────

  it('has role="status" for polite announcements', () => {
    render(<Snackbar open message="msg" />);
    expect(document.querySelector('.fq-snackbar')).toHaveAttribute(
      'role',
      'status',
    );
  });

  it('has aria-live="polite"', () => {
    render(<Snackbar open message="msg" />);
    expect(document.querySelector('.fq-snackbar')).toHaveAttribute(
      'aria-live',
      'polite',
    );
  });

  // ── Custom className ──────────────────────────────────────────────────

  it('merges custom className', () => {
    render(<Snackbar open message="msg" className="my-toast" />);
    expect(document.querySelector('.fq-snackbar')).toHaveClass(
      'fq-snackbar',
      'my-toast',
    );
  });

  // ── clickaway ─────────────────────────────────────────────────────────

  it('calls onClose with reason "clickaway" on outside click', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<Snackbar open message="msg" onClose={onClose} />);
    await user.click(document.body);
    expect(onClose).toHaveBeenCalledWith(expect.anything(), 'clickaway');
  });
});
