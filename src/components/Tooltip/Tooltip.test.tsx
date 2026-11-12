import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Dialog } from '../Dialog/Dialog';
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

describe('Tooltip lifecycle regressions', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('preserves existing description IDs before, during and after disclosure', () => {
    render(
      <>
        <p id="existing">Existing help</p>
        <Tooltip content="Extra help" enterDelay={0}>
          <button aria-describedby="existing">Help</button>
        </Tooltip>
      </>,
    );
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-describedby', 'existing');
    fireEvent.mouseEnter(button);
    act(() => vi.runAllTimers());
    const tooltip = screen.getByRole('tooltip');
    expect(button).toHaveAttribute(
      'aria-describedby',
      `existing ${tooltip.id}`,
    );
    expect(button).toHaveAccessibleDescription('Existing help Extra help');
    fireEvent.mouseLeave(button);
    act(() => vi.runAllTimers());
    expect(button).toHaveAttribute('aria-describedby', 'existing');
  });

  it('clears delayed enter callbacks on unmount', () => {
    const onOpen = vi.fn();
    const { unmount } = render(
      <Tooltip content="Help" enterDelay={100} onOpen={onOpen}>
        <button>Help</button>
      </Tooltip>,
    );
    fireEvent.mouseEnter(screen.getByRole('button'));
    unmount();
    act(() => vi.runAllTimers());
    expect(onOpen).not.toHaveBeenCalled();
  });

  it('clears delayed leave callbacks on unmount', () => {
    const onClose = vi.fn();
    const { unmount } = render(
      <Tooltip content="Help" enterDelay={0} leaveDelay={100} onClose={onClose}>
        <button>Help</button>
      </Tooltip>,
    );
    fireEvent.mouseEnter(screen.getByRole('button'));
    act(() => vi.runAllTimers());
    fireEvent.mouseLeave(screen.getByRole('button'));
    unmount();
    act(() => vi.runAllTimers());
    expect(onClose).not.toHaveBeenCalled();
  });

  it('retains disclosure while focus remains after the pointer leaves', () => {
    render(
      <Tooltip content="Help" enterDelay={0}>
        <button>Help</button>
      </Tooltip>,
    );
    const button = screen.getByRole('button');
    fireEvent.focus(button);
    fireEvent.mouseEnter(button);
    act(() => vi.runAllTimers());
    fireEvent.mouseLeave(button);
    act(() => vi.runAllTimers());
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    fireEvent.blur(button);
    act(() => vi.runAllTimers());
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('dismisses Escape immediately and preserves child key handlers', () => {
    const onKeyDown = vi.fn();
    const onClose = vi.fn();
    render(
      <Tooltip
        content="Help"
        enterDelay={0}
        leaveDelay={1000}
        onClose={onClose}
      >
        <button onKeyDown={onKeyDown}>Help</button>
      </Tooltip>,
    );
    const button = screen.getByRole('button');
    fireEvent.focus(button);
    act(() => vi.runAllTimers());
    fireEvent.keyDown(button, { key: 'Escape' });
    expect(onKeyDown).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    fireEvent.mouseEnter(button);
    act(() => vi.runAllTimers());
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    fireEvent.mouseLeave(button);
    fireEvent.blur(button);
    act(() => vi.runAllTimers());
    fireEvent.focus(button);
    act(() => vi.runAllTimers());
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
  });

  it('cancels a pending open when Escape is pressed outside the trigger', () => {
    const onOpen = vi.fn();
    render(
      <Tooltip content="Help" enterDelay={100} onOpen={onOpen}>
        <button>Help</button>
      </Tooltip>,
    );
    fireEvent.mouseEnter(screen.getByRole('button'));
    fireEvent.keyDown(document.body, { key: 'Escape' });
    act(() => vi.runAllTimers());
    expect(onOpen).not.toHaveBeenCalled();
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('requests controlled dismissal without overriding parent visibility', () => {
    const onClose = vi.fn();
    const { rerender } = render(
      <Tooltip content="Help" open onClose={onClose}>
        <button>Help</button>
      </Tooltip>,
    );
    fireEvent.keyDown(screen.getByRole('button'), { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    rerender(
      <Tooltip content="Help" open={false} onClose={onClose}>
        <button>Help</button>
      </Tooltip>,
    );
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('coalesces pending hover and focus and cancels stale controlled transitions', () => {
    const onOpen = vi.fn();
    const { rerender } = render(
      <Tooltip content="Help" enterDelay={100} onOpen={onOpen}>
        <button>Help</button>
      </Tooltip>,
    );
    fireEvent.mouseEnter(screen.getByRole('button'));
    fireEvent.focus(screen.getByRole('button'));
    act(() => vi.runAllTimers());
    expect(onOpen).toHaveBeenCalledTimes(1);
    fireEvent.blur(screen.getByRole('button'));
    fireEvent.mouseLeave(screen.getByRole('button'));
    act(() => vi.runAllTimers());
    fireEvent.mouseEnter(screen.getByRole('button'));
    rerender(
      <Tooltip content="Help" open={false} enterDelay={100} onOpen={onOpen}>
        <button>Help</button>
      </Tooltip>,
    );
    act(() => vi.runAllTimers());
    expect(onOpen).toHaveBeenCalledTimes(1);
  });

  it('composes wrapper and child handlers and clears cancelled touch activity', () => {
    const childEnter = vi.fn();
    const rootEnter = vi.fn();
    const touchCancel = vi.fn();
    render(
      <Tooltip
        content="Help"
        enterDelay={0}
        onMouseEnter={rootEnter}
        onTouchCancel={touchCancel}
      >
        <button onMouseEnter={childEnter}>Help</button>
      </Tooltip>,
    );
    const button = screen.getByRole('button');
    fireEvent.mouseEnter(button);
    act(() => vi.runAllTimers());
    expect(childEnter).toHaveBeenCalledTimes(1);
    expect(rootEnter).toHaveBeenCalledTimes(1);
    fireEvent.mouseLeave(button);
    fireEvent.touchStart(button);
    act(() => vi.runAllTimers());
    fireEvent.touchCancel(button);
    act(() => vi.runAllTimers());
    expect(touchCancel).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });
  it('uses the latest callback without restarting an existing delay', () => {
    const first = vi.fn();
    const second = vi.fn();
    const { rerender } = render(
      <Tooltip content="Help" enterDelay={100} onOpen={first}>
        <button>Help</button>
      </Tooltip>,
    );
    fireEvent.mouseEnter(screen.getByRole('button'));
    act(() => vi.advanceTimersByTime(50));
    rerender(
      <Tooltip content="Help" enterDelay={100} onOpen={second}>
        <button>Help</button>
      </Tooltip>,
    );
    act(() => vi.advanceTimersByTime(50));
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
  });

  it('dismisses a tooltip before the containing Dialog receives Escape', () => {
    const close = vi.fn();
    render(
      <Dialog open title="Review" onClose={close}>
        <Tooltip content="Extra help" enterDelay={0}>
          <button>Help</button>
        </Tooltip>
      </Dialog>,
    );
    const trigger = screen.getByRole('button', { name: 'Help' });
    fireEvent.focus(trigger);
    act(() => vi.advanceTimersByTime(0));
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    fireEvent.keyDown(trigger, { key: 'Escape' });
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    expect(close).not.toHaveBeenCalled();
    fireEvent.keyDown(trigger, { key: 'Escape' });
    expect(close).toHaveBeenCalledTimes(1);
  });
});
