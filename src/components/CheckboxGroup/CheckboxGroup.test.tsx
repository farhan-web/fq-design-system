import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Checkbox } from '../Checkbox/Checkbox';
import { CheckboxGroup } from './CheckboxGroup';

const items = (
  <>
    <Checkbox label="Option A" />
    <Checkbox label="Option B" />
  </>
);

describe('CheckboxGroup', () => {
  // ── legend ──────────────────────────────────────────────────

  it('renders legend when label is provided', () => {
    render(<CheckboxGroup label="Pick options">{items}</CheckboxGroup>);
    expect(screen.getByText('Pick options')).toBeInTheDocument();
  });

  it('does not render legend when label is omitted', () => {
    const { container } = render(<CheckboxGroup>{items}</CheckboxGroup>);
    expect(container.querySelector('legend')).not.toBeInTheDocument();
  });

  // ── required ────────────────────────────────────────────────

  it('renders required asterisk when required is true', () => {
    const { container } = render(
      <CheckboxGroup label="Pick options" required>
        {items}
      </CheckboxGroup>,
    );
    expect(
      container.querySelector('.fq-checkbox-group__required'),
    ).toBeInTheDocument();
  });

  it('does not render required asterisk when required is false', () => {
    const { container } = render(
      <CheckboxGroup label="Pick options">{items}</CheckboxGroup>,
    );
    expect(
      container.querySelector('.fq-checkbox-group__required'),
    ).not.toBeInTheDocument();
  });

  // ── children ────────────────────────────────────────────────

  it('renders children inside items slot', () => {
    render(<CheckboxGroup label="Pick options">{items}</CheckboxGroup>);
    expect(
      screen.getByRole('checkbox', { name: 'Option A' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', { name: 'Option B' }),
    ).toBeInTheDocument();
  });

  // ── helperText ──────────────────────────────────────────────

  it('renders helper text', () => {
    render(
      <CheckboxGroup label="Pick options" helperText="Select any that apply.">
        {items}
      </CheckboxGroup>,
    );
    expect(screen.getByText('Select any that apply.')).toBeInTheDocument();
  });

  it('connects helper text via aria-describedby', () => {
    const { container } = render(
      <CheckboxGroup label="Pick options" helperText="Select any that apply.">
        {items}
      </CheckboxGroup>,
    );
    const fieldset = container.querySelector('fieldset')!;
    const message = container.querySelector('.fq-checkbox-group__message')!;
    expect(fieldset).toHaveAttribute('aria-describedby', message.id);
  });

  // ── error ───────────────────────────────────────────────────

  it('renders error message', () => {
    render(
      <CheckboxGroup label="Pick options" error="Select at least one option.">
        {items}
      </CheckboxGroup>,
    );
    expect(screen.getByText('Select at least one option.')).toBeInTheDocument();
  });

  it('sets aria-invalid when error is provided', () => {
    const { container } = render(
      <CheckboxGroup label="Pick options" error="Select at least one option.">
        {items}
      </CheckboxGroup>,
    );
    expect(container.querySelector('fieldset')).toHaveAttribute(
      'aria-invalid',
      'true',
    );
  });

  it('does not set aria-invalid when no error', () => {
    const { container } = render(
      <CheckboxGroup label="Pick options">{items}</CheckboxGroup>,
    );
    expect(container.querySelector('fieldset')).not.toHaveAttribute(
      'aria-invalid',
    );
  });

  it('applies error CSS class when error is provided', () => {
    const { container } = render(
      <CheckboxGroup label="Pick options" error="Required.">
        {items}
      </CheckboxGroup>,
    );
    expect(container.querySelector('fieldset')).toHaveClass(
      'fq-checkbox-group--error',
    );
  });

  it('does not apply error class when no error', () => {
    const { container } = render(
      <CheckboxGroup label="Pick options">{items}</CheckboxGroup>,
    );
    expect(container.querySelector('fieldset')).not.toHaveClass(
      'fq-checkbox-group--error',
    );
  });

  it('prioritizes error over helperText', () => {
    render(
      <CheckboxGroup
        label="Pick options"
        helperText="Select any that apply."
        error="Select at least one."
      >
        {items}
      </CheckboxGroup>,
    );
    expect(screen.getByText('Select at least one.')).toBeInTheDocument();
    expect(
      screen.queryByText('Select any that apply.'),
    ).not.toBeInTheDocument();
  });

  // ── disabled ────────────────────────────────────────────────

  it('disables all child checkboxes when disabled', () => {
    render(
      <CheckboxGroup label="Pick options" disabled>
        {items}
      </CheckboxGroup>,
    );
    expect(screen.getByRole('checkbox', { name: 'Option A' })).toBeDisabled();
    expect(screen.getByRole('checkbox', { name: 'Option B' })).toBeDisabled();
  });

  // ── misc ────────────────────────────────────────────────────

  it('applies extra className', () => {
    const { container } = render(
      <CheckboxGroup className="custom">{items}</CheckboxGroup>,
    );
    expect(container.querySelector('fieldset')).toHaveClass(
      'fq-checkbox-group',
      'custom',
    );
  });

  it('forwards ref to the fieldset element', () => {
    const ref = { current: null } as { current: HTMLFieldSetElement | null };
    render(<CheckboxGroup ref={ref}>{items}</CheckboxGroup>);
    expect(ref.current).toBeInstanceOf(HTMLFieldSetElement);
  });

  it('does not render message element when neither error nor helperText', () => {
    const { container } = render(
      <CheckboxGroup label="Pick options">{items}</CheckboxGroup>,
    );
    expect(
      container.querySelector('.fq-checkbox-group__message'),
    ).not.toBeInTheDocument();
  });

  it('does not set aria-describedby when no message', () => {
    const { container } = render(
      <CheckboxGroup label="Pick options">{items}</CheckboxGroup>,
    );
    expect(container.querySelector('fieldset')).not.toHaveAttribute(
      'aria-describedby',
    );
  });
});
