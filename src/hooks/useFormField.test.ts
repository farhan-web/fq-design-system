import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useFormField } from './useFormField';

describe('useFormField', () => {
  it('generates an id when id is not provided', () => {
    const { result } = renderHook(() =>
      useFormField({}),
    );

    expect(result.current.id).not.toBe('');
  });

  it('uses the provided id', () => {
    const { result } = renderHook(() =>
      useFormField({
        id: 'email',
      }),
    );

    expect(result.current.id).toBe('email');
  });

  it('prefers error over helper text', () => {
    const { result } = renderHook(() =>
      useFormField({
        helperText: 'Helper',
        error: 'Error',
      }),
    );

    expect(result.current.message).toBe('Error');
    expect(result.current.invalid).toBe(true);
  });

  it('uses helper text when there is no error', () => {
    const { result } = renderHook(() =>
      useFormField({
        helperText: 'Helper',
      }),
    );

    expect(result.current.message).toBe('Helper');
    expect(result.current.invalid).toBe(false);
  });

  it('generates a message id', () => {
    const { result } = renderHook(() =>
      useFormField({
        id: 'email',
        helperText: 'Helper',
      }),
    );

    expect(result.current.messageId).toBe(
      'email-message',
    );
  });

  it('combines external and internal descriptions', () => {
    const { result } = renderHook(() =>
      useFormField({
        id: 'email',
        helperText: 'Helper',
        describedBy: 'external-description',
      }),
    );

    expect(result.current.describedBy).toBe(
      'external-description email-message',
    );
  });

  it('does not create a message id without a message', () => {
    const { result } = renderHook(() =>
      useFormField({
        id: 'email',
      }),
    );

    expect(result.current.messageId).toBeUndefined();
    expect(result.current.describedBy).toBeUndefined();
  });
});
