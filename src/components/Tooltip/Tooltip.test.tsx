import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Tooltip } from './Tooltip';

describe('Tooltip', () => {
  it('renders the trigger child', () => {
    render(
      <Tooltip content="Tooltip text">
        <button>Hover me</button>
      </Tooltip>,
    );
    expect(
      screen.getByRole('button', { name: 'Hover me' }),
    ).toBeInTheDocument();
  });

  it('tooltip content exists in DOM but is hidden initially', () => {
    render(
      <Tooltip content="Tooltip text">
        <button>Hover me</button>
      </Tooltip>,
    );
    expect(screen.getByRole('tooltip', { hidden: true })).toBeInTheDocument();
    expect(screen.getByRole('tooltip', { hidden: true })).toHaveAttribute(
      'aria-hidden',
      'true',
    );
  });

  it('shows tooltip on mouse enter (with enterDelay=0)', async () => {
    render(
      <Tooltip content="Tooltip text" enterDelay={0}>
        <button>Hover me</button>
      </Tooltip>,
    );
    fireEvent.mouseEnter(screen.getByRole('button', { name: 'Hover me' }));
    await waitFor(() =>
      expect(screen.getByRole('tooltip')).not.toHaveAttribute(
        'aria-hidden',
        'true',
      ),
    );
  });

  it('supports deprecated delayMs as alias for enterDelay', async () => {
    render(
      <Tooltip content="Tooltip text" delayMs={0}>
        <button>Hover me</button>
      </Tooltip>,
    );
    fireEvent.mouseEnter(screen.getByRole('button'));
    await waitFor(() =>
      expect(screen.getByRole('tooltip')).not.toHaveAttribute(
        'aria-hidden',
        'true',
      ),
    );
  });

  it('hides tooltip on mouse leave', async () => {
    render(
      <Tooltip content="Tooltip text" enterDelay={0}>
        <button>Hover me</button>
      </Tooltip>,
    );
    fireEvent.mouseEnter(screen.getByRole('button'));
    await new Promise((r) => setTimeout(r, 10));
    fireEvent.mouseLeave(screen.getByRole('button'));
    await waitFor(() =>
      expect(screen.getByRole('tooltip', { hidden: true })).toHaveAttribute(
        'aria-hidden',
        'true',
      ),
    );
  });

  it('applies placement class', () => {
    render(
      <Tooltip content="Text" placement="bottom">
        <button>B</button>
      </Tooltip>,
    );
    expect(screen.getByRole('tooltip', { hidden: true })).toHaveClass(
      'fq-tooltip__content--bottom',
    );
  });

  it('applies new placement classes (top-start, bottom-end)', () => {
    const { rerender } = render(
      <Tooltip content="Text" placement="top-start">
        <button>B</button>
      </Tooltip>,
    );
    expect(screen.getByRole('tooltip', { hidden: true })).toHaveClass(
      'fq-tooltip__content--top-start',
    );

    rerender(
      <Tooltip content="Text" placement="bottom-end">
        <button>B</button>
      </Tooltip>,
    );
    expect(screen.getByRole('tooltip', { hidden: true })).toHaveClass(
      'fq-tooltip__content--bottom-end',
    );
  });

  it('forwards ref', () => {
    const ref = { current: null } as { current: HTMLDivElement | null };
    render(
      <Tooltip content="Text" ref={ref}>
        <button>B</button>
      </Tooltip>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  // ── Controlled mode ──────────────────────────────────────────

  it('respects controlled open=true (visible immediately)', () => {
    render(
      <Tooltip content="Controlled" open={true}>
        <button>B</button>
      </Tooltip>,
    );
    expect(screen.getByRole('tooltip')).not.toHaveAttribute(
      'aria-hidden',
      'true',
    );
  });

  it('respects controlled open=false (stays hidden on hover)', () => {
    render(
      <Tooltip content="Controlled" open={false} enterDelay={0}>
        <button>B</button>
      </Tooltip>,
    );
    fireEvent.mouseEnter(screen.getByRole('button'));
    expect(screen.getByRole('tooltip', { hidden: true })).toHaveAttribute(
      'aria-hidden',
      'true',
    );
  });

  it('calls onOpen when tooltip shows (uncontrolled)', async () => {
    const onOpen = vi.fn();
    render(
      <Tooltip content="Text" enterDelay={0} onOpen={onOpen}>
        <button>B</button>
      </Tooltip>,
    );
    fireEvent.mouseEnter(screen.getByRole('button'));
    await waitFor(() => expect(onOpen).toHaveBeenCalledTimes(1));
  });

  it('calls onClose when tooltip hides (uncontrolled)', async () => {
    const onClose = vi.fn();
    render(
      <Tooltip content="Text" enterDelay={0} onClose={onClose}>
        <button>B</button>
      </Tooltip>,
    );
    fireEvent.mouseEnter(screen.getByRole('button'));
    await new Promise((r) => setTimeout(r, 10));
    fireEvent.mouseLeave(screen.getByRole('button'));
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
  });

  it('calls onOpen/onClose in controlled mode without changing visibility', async () => {
    const onOpen = vi.fn();
    const onClose = vi.fn();
    render(
      <Tooltip
        content="Text"
        open={false}
        enterDelay={0}
        onOpen={onOpen}
        onClose={onClose}
      >
        <button>B</button>
      </Tooltip>,
    );
    fireEvent.mouseEnter(screen.getByRole('button'));
    await waitFor(() => expect(onOpen).toHaveBeenCalledTimes(1));
    // tooltip stays hidden because open=false is controlled externally
    expect(screen.getByRole('tooltip', { hidden: true })).toHaveAttribute(
      'aria-hidden',
      'true',
    );
    fireEvent.mouseLeave(screen.getByRole('button'));
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
  });

  // ── Disable listeners ────────────────────────────────────────

  it('does not show on hover when disableHoverListener=true', async () => {
    render(
      <Tooltip content="Text" enterDelay={0} disableHoverListener>
        <button>B</button>
      </Tooltip>,
    );
    fireEvent.mouseEnter(screen.getByRole('button'));
    await new Promise((r) => setTimeout(r, 10));
    expect(screen.getByRole('tooltip', { hidden: true })).toHaveAttribute(
      'aria-hidden',
      'true',
    );
  });

  it('does not show on focus when disableFocusListener=true', async () => {
    render(
      <Tooltip content="Text" enterDelay={0} disableFocusListener>
        <button>B</button>
      </Tooltip>,
    );
    fireEvent.focus(screen.getByRole('button'));
    await new Promise((r) => setTimeout(r, 10));
    expect(screen.getByRole('tooltip', { hidden: true })).toHaveAttribute(
      'aria-hidden',
      'true',
    );
  });

  it('does not show on touch when disableTouchListener=true', async () => {
    render(
      <Tooltip content="Text" enterDelay={0} disableTouchListener>
        <button>B</button>
      </Tooltip>,
    );
    fireEvent.touchStart(screen.getByRole('button'));
    await new Promise((r) => setTimeout(r, 10));
    expect(screen.getByRole('tooltip', { hidden: true })).toHaveAttribute(
      'aria-hidden',
      'true',
    );
  });

  // ── Touch trigger ────────────────────────────────────────────

  it('shows tooltip on touchstart', async () => {
    render(
      <Tooltip content="Touch" enterDelay={0}>
        <button>B</button>
      </Tooltip>,
    );
    fireEvent.touchStart(screen.getByRole('button'));
    await waitFor(() =>
      expect(screen.getByRole('tooltip')).not.toHaveAttribute(
        'aria-hidden',
        'true',
      ),
    );
  });

  it('hides tooltip on touchend', async () => {
    render(
      <Tooltip content="Touch" enterDelay={0}>
        <button>B</button>
      </Tooltip>,
    );
    fireEvent.touchStart(screen.getByRole('button'));
    await new Promise((r) => setTimeout(r, 10));
    fireEvent.touchEnd(screen.getByRole('button'));
    await waitFor(() =>
      expect(screen.getByRole('tooltip', { hidden: true })).toHaveAttribute(
        'aria-hidden',
        'true',
      ),
    );
  });

  // ── Arrow ────────────────────────────────────────────────────

  it('renders arrow by default', () => {
    const { container } = render(
      <Tooltip content="Text">
        <button>B</button>
      </Tooltip>,
    );
    expect(container.querySelector('.fq-tooltip__arrow')).toBeInTheDocument();
  });

  it('hides arrow when arrow=false', () => {
    const { container } = render(
      <Tooltip content="Text" arrow={false}>
        <button>B</button>
      </Tooltip>,
    );
    expect(
      container.querySelector('.fq-tooltip__arrow'),
    ).not.toBeInTheDocument();
  });

  // ── maxWidth ─────────────────────────────────────────────────

  it('applies maxWidth as px when number', () => {
    render(
      <Tooltip content="Text" maxWidth={400}>
        <button>B</button>
      </Tooltip>,
    );
    const tooltip = screen.getByRole('tooltip', { hidden: true });
    expect(tooltip).toHaveStyle({ maxWidth: '400px' });
  });

  it('applies maxWidth as string value', () => {
    render(
      <Tooltip content="Text" maxWidth="50vw">
        <button>B</button>
      </Tooltip>,
    );
    const tooltip = screen.getByRole('tooltip', { hidden: true });
    expect(tooltip).toHaveStyle({ maxWidth: '50vw' });
  });
});
