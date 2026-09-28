import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Coachmark } from './Coachmark';

describe('Coachmark', () => {
  it('does not render popover when closed', () => {
    render(
      <Coachmark open={false} title="Step 1" body="Do this first.">
        <button>Target</button>
      </Coachmark>,
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders popover when open', () => {
    render(
      <Coachmark open title="Step 1" body="Do this first.">
        <button>Target</button>
      </Coachmark>,
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('renders title and body', () => {
    render(
      <Coachmark open title="Step 1" body="Do this first.">
        <button>T</button>
      </Coachmark>,
    );
    expect(screen.getByText('Step 1')).toBeInTheDocument();
    expect(screen.getByText('Do this first.')).toBeInTheDocument();
  });

  it('shows step indicator when step and totalSteps provided', () => {
    render(
      <Coachmark open title="Step" body="Body" step={2} totalSteps={4}>
        <button>T</button>
      </Coachmark>,
    );
    expect(screen.getByText('2 / 4')).toBeInTheDocument();
  });

  it('hides step indicator when step props omitted', () => {
    render(
      <Coachmark open title="Step" body="Body">
        <button>T</button>
      </Coachmark>,
    );
    expect(screen.queryByText(/\//)).not.toBeInTheDocument();
  });

  it('calls onNext when Next clicked', () => {
    const onNext = vi.fn();
    render(
      <Coachmark
        open
        title="S"
        body="B"
        step={1}
        totalSteps={3}
        onNext={onNext}
        onSkip={vi.fn()}
      >
        <button>T</button>
      </Coachmark>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(onNext).toHaveBeenCalledTimes(1);
  });

  it('calls onSkip when Skip clicked', () => {
    const onSkip = vi.fn();
    render(
      <Coachmark
        open
        title="S"
        body="B"
        step={1}
        totalSteps={3}
        onNext={vi.fn()}
        onSkip={onSkip}
      >
        <button>T</button>
      </Coachmark>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Skip' }));
    expect(onSkip).toHaveBeenCalledTimes(1);
  });

  it('shows Done button on last step', () => {
    render(
      <Coachmark
        open
        title="S"
        body="B"
        step={3}
        totalSteps={3}
        onDone={vi.fn()}
      >
        <button>T</button>
      </Coachmark>,
    );
    expect(screen.getByRole('button', { name: 'Done' })).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Next' }),
    ).not.toBeInTheDocument();
  });

  it('calls onDone when Done clicked', () => {
    const onDone = vi.fn();
    render(
      <Coachmark
        open
        title="S"
        body="B"
        step={2}
        totalSteps={2}
        onDone={onDone}
      >
        <button>T</button>
      </Coachmark>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Done' }));
    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it('applies placement class', () => {
    render(
      <Coachmark open title="S" body="B" placement="top">
        <button>T</button>
      </Coachmark>,
    );
    expect(screen.getByRole('dialog')).toHaveClass('fq-coachmark--top');
  });

  it('renders children (anchor element)', () => {
    render(
      <Coachmark open title="S" body="B">
        <button>Target button</button>
      </Coachmark>,
    );
    expect(
      screen.getByRole('button', { name: 'Target button' }),
    ).toBeInTheDocument();
  });

  it('forwards ref to the dialog element', () => {
    const ref = { current: null } as { current: HTMLDivElement | null };
    render(
      <Coachmark open title="S" body="B" ref={ref}>
        <button>T</button>
      </Coachmark>,
    );
    expect(ref.current).toBe(screen.getByRole('dialog'));
  });

  // ── B4: 12 placement classes ─────────────────────────────────

  it('applies bottom-start placement class', () => {
    render(
      <Coachmark open title="S" body="B" placement="bottom-start">
        <button>T</button>
      </Coachmark>,
    );
    expect(screen.getByRole('dialog')).toHaveClass(
      'fq-coachmark--bottom-start',
    );
  });

  it('applies top-end placement class', () => {
    render(
      <Coachmark open title="S" body="B" placement="top-end">
        <button>T</button>
      </Coachmark>,
    );
    expect(screen.getByRole('dialog')).toHaveClass('fq-coachmark--top-end');
  });

  it('applies right-start placement class', () => {
    render(
      <Coachmark open title="S" body="B" placement="right-start">
        <button>T</button>
      </Coachmark>,
    );
    expect(screen.getByRole('dialog')).toHaveClass('fq-coachmark--right-start');
  });

  // ── A4: Focus management ─────────────────────────────────────

  it('auto-focuses first button when opened', () => {
    render(
      <Coachmark open title="S" body="B" onNext={vi.fn()}>
        <button>Target</button>
      </Coachmark>,
    );
    // The first button inside the dialog (Next) should have focus
    const nextBtn = screen.getByRole('button', { name: 'Next' });
    expect(nextBtn).toHaveFocus();
  });

  it('Escape key calls onSkip when provided', () => {
    const onSkip = vi.fn();
    render(
      <Coachmark
        open
        title="S"
        body="B"
        step={1}
        totalSteps={3}
        onSkip={onSkip}
      >
        <button>T</button>
      </Coachmark>,
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onSkip).toHaveBeenCalledTimes(1);
  });
});
