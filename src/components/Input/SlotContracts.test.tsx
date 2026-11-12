import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Checkbox } from '../Checkbox/Checkbox';
import { Radio } from '../Radio/Radio';
import { Switch } from '../Switch/Switch';
import { CheckboxGroup } from '../CheckboxGroup/CheckboxGroup';
import { Input } from './Input';
import { Button } from '../Button/Button';
import { Field } from '../Field/Field';
import { Dialog } from '../Dialog/Dialog';
import { Select } from '../Select/Select';
import { Textarea } from '../Textarea/Textarea';
import { Tooltip } from '../Tooltip/Tooltip';
import { Snackbar } from '../Snackbar/Snackbar';
import { getSlotProps, type FqSlotProps } from '../../types/slots';

describe('style slot contracts', () => {
  it('merges decoration without admitting behavior from untyped callers', () => {
    const unsafe = {
      className: 'instance',
      style: { color: 'red' },
      'data-probe': 3,
      'aria-label': 'spoof',
      id: 'spoof',
      onClick: vi.fn(),
      disabled: false,
      'data-invalid': {},
      'data-bad key': 'bad',
    } as unknown as FqSlotProps;
    expect(
      getSlotProps(
        { classNames: { root: 'component' }, slotProps: { root: unsafe } },
        'root',
        'internal',
        { color: 'blue' },
      ),
    ).toEqual({
      className: 'internal component instance',
      style: { color: 'blue' },
      'data-probe': 3,
    });
    expect(getSlotProps({}, 'root')).toEqual({ className: undefined });
  });

  it('keeps Input native props/ref, contextual IDs and consumer callbacks', () => {
    const ref = createRef<HTMLInputElement>();
    const onChange = vi.fn();
    const onFocus = vi.fn();
    const onBlur = vi.fn();
    const onClear = vi.fn();
    render(
      <Field
        id="mail"
        label="Email"
        required
        description="Description"
        error="Error"
        slotProps={{
          label: { className: 'field-label' },
          error: { style: { color: 'red' } },
        }}
      >
        <Input
          ref={ref}
          name="email"
          helperText="Helper"
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          onClear={onClear}
          className="legacy"
          style={{ color: 'blue' }}
          classNames={{ input: 'custom-input', container: 'custom-container' }}
          slotProps={{
            input: {
              className: 'instance',
              style: { color: 'red', '--local': '3px' },
              'data-testid': 'control',
            },
            root: { 'data-testid': 'wrapper', style: { padding: 9 } },
            helperText: { className: 'helper' },
          }}
        />
      </Field>,
    );
    const input = screen.getByRole('textbox', { name: /Email/ });
    expect(ref.current).toBe(input);
    expect(input).toHaveAttribute('name', 'email');
    expect(input).toHaveClass('fq-input', 'legacy', 'custom-input', 'instance');
    expect(input).toHaveStyle({ color: 'rgb(0, 0, 255)' });
    expect(input.style.getPropertyValue('--local')).toBe('3px');
    expect(input).toBeRequired();
    expect(input).toHaveAttribute('aria-invalid', 'true');
    for (const id of input.getAttribute('aria-describedby')!.split(' '))
      expect(document.getElementById(id)).not.toBeNull();
    expect(screen.getByTestId('wrapper')).toHaveStyle({ padding: '9px' });
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'abc' } });
    expect(input.closest('.fq-input-container')).toHaveClass(
      'fq-input-container--focused',
      'fq-input-container--filled',
    );
    fireEvent.click(screen.getByRole('button', { name: 'Clear' }));
    fireEvent.blur(input);
    for (const callback of [onFocus, onChange, onBlur, onClear])
      expect(callback).toHaveBeenCalledTimes(1);
  });

  it('keeps loading Button disabled and refs on the button after customization', () => {
    const ref = createRef<HTMLButtonElement>();
    const onClick = vi.fn();
    render(
      <Button
        ref={ref}
        loading
        onClick={onClick}
        classNames={{ root: 'styled' }}
        slotProps={{
          content: { 'data-testid': 'content' },
          root: { disabled: false, onClick } as FqSlotProps,
        }}
      >
        Save
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'Save' });
    expect(ref.current).toBe(button);
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByTestId('content')).toHaveClass('fq-button__content');
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('keeps Dialog paper ref, title relation and close handling', () => {
    const ref = createRef<HTMLDivElement>();
    const onClose = vi.fn();
    render(
      <Dialog
        open
        title="Confirm"
        ref={ref}
        onClose={onClose}
        className="legacy"
        style={{ padding: 7 }}
        slotProps={{
          paper: { className: 'paper', style: { padding: 2 } },
          backdrop: {
            'data-testid': 'backdrop',
            style: { backgroundColor: 'red' },
          },
          heading: { id: 'spoof' } as FqSlotProps,
          content: { 'data-testid': 'content' },
        }}
      >
        Body
      </Dialog>,
    );
    const dialog = screen.getByRole('dialog', { name: 'Confirm' });
    expect(ref.current).toBe(dialog);
    expect(dialog).toHaveClass('fq-dialog', 'legacy', 'paper');
    expect(dialog).toHaveStyle({ padding: '7px' });
    expect(
      document.getElementById(dialog.getAttribute('aria-labelledby')!),
    ).toHaveTextContent('Confirm');
    expect(screen.getByTestId('backdrop')).toHaveStyle({
      backgroundColor: 'rgb(255, 0, 0)',
    });
    fireEvent.click(screen.getByRole('button', { name: 'Close dialog' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('keeps Select/Textarea refs and state callbacks on native controls', () => {
    const selectRef = createRef<HTMLSelectElement>();
    const textRef = createRef<HTMLTextAreaElement>();
    const onChange = vi.fn();
    render(
      <>
        <Select
          ref={selectRef}
          label="Choice"
          disabled
          slotProps={{ select: { className: 'select' } }}
        >
          <option>A</option>
        </Select>
        <Textarea
          ref={textRef}
          label="Comment"
          showCount
          maxLength={20}
          onChange={onChange}
          slotProps={{
            count: { 'data-testid': 'count' },
            textarea: { className: 'text' },
          }}
        />
      </>,
    );
    expect(selectRef.current).toBe(screen.getByRole('combobox'));
    expect(selectRef.current).toBeDisabled();
    expect(textRef.current).toBe(screen.getByRole('textbox'));
    fireEvent.change(textRef.current!, { target: { value: 'hello' } });
    expect(screen.getByTestId('count')).toHaveTextContent('5/20');
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it.each([
    ['checkbox', Checkbox],
    ['radio', Radio],
    ['switch', Switch],
  ] as const)(
    'preserves %s native refs, changes and disabled state',
    (role, Control) => {
      const ref = createRef<HTMLInputElement>();
      const onChange = vi.fn();
      const { rerender } = render(
        <Control
          ref={ref}
          label="Toggle"
          name="toggle"
          onChange={onChange}
          slotProps={{
            root: { 'data-testid': 'outer' },
            input: { className: 'native' },
            label: { className: 'label' },
          }}
        />,
      );
      const input = screen.getByRole(role);
      expect(ref.current).toBe(input);
      expect(input).toHaveClass('native');
      fireEvent.click(input);
      expect(onChange).toHaveBeenCalledTimes(1);
      rerender(
        <Control
          ref={ref}
          label="Toggle"
          disabled
          slotProps={{ input: { disabled: false } as FqSlotProps }}
        />,
      );
      expect(input).toBeDisabled();
    },
  );

  it('merges CheckboxGroup root classes without serializing slot objects', () => {
    const ref = createRef<HTMLFieldSetElement>();
    render(
      <CheckboxGroup
        ref={ref}
        label="Group"
        className="legacy"
        style={{ padding: 4 }}
        classNames={{ root: 'group' }}
        slotProps={{ root: { className: 'instance', style: { padding: 2 } } }}
        disabled
      >
        <Checkbox label="Child" />
      </CheckboxGroup>,
    );
    expect(ref.current).toBe(screen.getByRole('group', { name: 'Group' }));
    expect(ref.current).toHaveAttribute(
      'class',
      'fq-checkbox-group legacy group instance',
    );
    expect(ref.current).toHaveStyle({ padding: '4px' });
    expect(screen.getByRole('checkbox')).toBeDisabled();
  });

  it('keeps Tooltip relationship and Snackbar ref separate from content styling', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <>
        <Tooltip
          open
          content="Hint"
          slotProps={{ content: { className: 'hint' } }}
        >
          <button>Trigger</button>
        </Tooltip>
        <Snackbar
          ref={ref}
          open
          autoHideDuration={null}
          message="Saved"
          className="message"
          slotProps={{
            root: { 'data-testid': 'snackbar-root' },
            content: { 'data-testid': 'snackbar-content' },
          }}
        />
      </>,
    );
    expect(screen.getByRole('tooltip')).toHaveClass('hint');
    expect(screen.getByRole('button', { name: 'Trigger' })).toHaveAttribute(
      'aria-describedby',
      screen.getByRole('tooltip').id,
    );
    expect(ref.current).toBe(screen.getByTestId('snackbar-root'));
    expect(screen.getByTestId('snackbar-content')).toHaveClass('message');
    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
  });
});
