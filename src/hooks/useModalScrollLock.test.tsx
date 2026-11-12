import { StrictMode } from 'react';
import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useModalScrollLock } from './useModalScrollLock';

describe('useModalScrollLock', () => {
  it('shares ownership and restores pre-existing overflow declarations', () => {
    const previous = document.body.style.cssText;
    document.body.style.setProperty('overflow', 'auto', 'important');
    document.body.style.setProperty('overflow-x', 'scroll');
    const before = document.body.style.cssText;
    const first = renderHook(() => useModalScrollLock(true));
    const second = renderHook(() => useModalScrollLock(true));
    expect(document.body.style.overflow).toBe('hidden');
    first.unmount();
    expect(document.body.style.overflow).toBe('hidden');
    second.unmount();
    expect(document.body.style.cssText).toBe(before);
    document.body.style.cssText = previous;
  });

  it('retains a deferred lock until the transition ends or unmounts', () => {
    const previous = document.body.style.overflow;
    const { result, rerender, unmount } = renderHook(
      ({ open }) => useModalScrollLock(open, true),
      { initialProps: { open: true } },
    );
    rerender({ open: false });
    expect(document.body.style.overflow).toBe('hidden');
    result.current();
    result.current();
    expect(document.body.style.overflow).toBe(previous);
    unmount();
  });

  it('reacquires safely during StrictMode effect replay', () => {
    const previous = document.body.style.overflow;
    const { unmount } = renderHook(() => useModalScrollLock(true), {
      wrapper: StrictMode,
    });
    expect(document.body.style.overflow).toBe('hidden');
    unmount();
    expect(document.body.style.overflow).toBe(previous);
  });
  it('compensates a scrollbar without changing fixed element overflow', () => {
    const before = document.body.style.cssText;
    const fixed = document.createElement('div');
    fixed.className = 'mui-fixed';
    fixed.style.paddingRight = '3px';
    fixed.style.overflow = 'clip';
    document.body.style.paddingRight = '7px';
    document.body.append(fixed);
    const width = vi
      .spyOn(document.documentElement, 'clientWidth', 'get')
      .mockReturnValue(window.innerWidth - 15);
    const height = vi
      .spyOn(document.documentElement, 'clientHeight', 'get')
      .mockReturnValue(600);
    const scrollHeight = vi
      .spyOn(document.body, 'scrollHeight', 'get')
      .mockReturnValue(900);
    const { unmount } = renderHook(() => useModalScrollLock(true));
    expect(document.body.style.paddingRight).toBe('22px');
    expect(fixed.style.paddingRight).toBe('18px');
    expect(fixed.style.overflow).toBe('clip');
    unmount();
    expect(document.body.style.paddingRight).toBe('7px');
    expect(fixed.style.paddingRight).toBe('3px');
    width.mockRestore();
    height.mockRestore();
    scrollHeight.mockRestore();
    fixed.remove();
    document.body.style.cssText = before;
  });
});
