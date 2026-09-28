import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Dialog } from './Dialog';

describe('Dialog', () => {
  it('renders when open', () => {
    render(<Dialog open onClose={vi.fn()} title="Hello" />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(<Dialog open={false} onClose={vi.fn()} title="Hello" />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders title text', () => {
    render(<Dialog open onClose={vi.fn()} title="Confirm Delete" />);
    expect(screen.getByText('Confirm Delete')).toBeInTheDocument();
  });

  it('renders children', () => {
    render(
      <Dialog open onClose={vi.fn()}>
        Dialog body
      </Dialog>,
    );
    expect(screen.getByText('Dialog body')).toBeInTheDocument();
  });

  it('renders actions slot', () => {
    render(<Dialog open onClose={vi.fn()} actions={<button>OK</button>} />);
    expect(screen.getByRole('button', { name: 'OK' })).toBeInTheDocument();
  });

  it('shows close button when title + onClose provided', () => {
    render(<Dialog open onClose={vi.fn()} title="Title" />);
    expect(
      screen.getByRole('button', { name: 'Close dialog' }),
    ).toBeInTheDocument();
  });

  it('calls onClose when close button clicked', () => {
    const onClose = vi.fn();
    render(<Dialog open onClose={onClose} title="Title" />);
    fireEvent.click(screen.getByRole('button', { name: 'Close dialog' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose on Escape key', () => {
    const onClose = vi.fn();
    render(<Dialog open onClose={onClose} title="Title" />);
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('applies size class', () => {
    render(<Dialog open onClose={vi.fn()} size="lg" />);
    expect(document.querySelector('.fq-dialog--lg')).toBeInTheDocument();
  });

  it('defaults to size="md"', () => {
    render(<Dialog open onClose={vi.fn()} />);
    expect(document.querySelector('.fq-dialog--md')).toBeInTheDocument();
  });

  it('merges custom className', () => {
    render(<Dialog open onClose={vi.fn()} className="my-modal" />);
    expect(document.querySelector('.fq-dialog')).toHaveClass('my-modal');
  });

  it('forwards ref to dialog paper element', () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<Dialog open onClose={vi.fn()} ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveClass('fq-dialog');
  });

  it('does not show close button when onClose is absent', () => {
    render(<Dialog open title="Title" />);
    expect(
      screen.queryByRole('button', { name: 'Close dialog' }),
    ).not.toBeInTheDocument();
  });

  it('disableBackdropClick prevents backdrop close', () => {
    const onClose = vi.fn();
    render(<Dialog open onClose={onClose} disableBackdropClick />);
    // Simulate MUI backdrop click — fires onClose with reason 'backdropClick'
    // MUI renders a backdrop with presentation role
    const backdrop = document.querySelector('.MuiBackdrop-root') as HTMLElement;
    if (backdrop) fireEvent.click(backdrop);
    expect(onClose).not.toHaveBeenCalled();
  });
});
