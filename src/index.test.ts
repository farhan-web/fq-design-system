import {
  Button,
  Checkbox,
  Field,
  Form,
  Input,
  Radio,
  Select,
  Switch,
  Textarea,
  useFormField,
} from './index';

import type {
  ButtonProps,
  ButtonSize,
  ButtonVariant,
  CheckboxProps,
  FieldProps,
  FormFieldProps,
  FormProps,
  InputProps,
  RadioProps,
  SelectProps,
  SwitchProps,
  TextareaProps,
} from './index';

import { describe, expect, it } from 'vitest';

describe('public API', () => {
  it('exports all public components and hook', () => {
    expect(Button).toBeDefined();
    expect(Checkbox).toBeDefined();
    expect(Field).toBeDefined();
    expect(Form).toBeDefined();
    expect(Input).toBeDefined();
    expect(Radio).toBeDefined();
    expect(Select).toBeDefined();
    expect(Switch).toBeDefined();
    expect(Textarea).toBeDefined();
    expect(useFormField).toBeDefined();
  });

  it('exports public component types', () => {
    const values: [
      ButtonProps,
      ButtonSize,
      ButtonVariant,
      CheckboxProps,
      FieldProps,
      FormFieldProps,
      FormProps,
      InputProps,
      RadioProps,
      SelectProps,
      SwitchProps,
      TextareaProps,
    ] = [] as never;

    expect(values).toBeDefined();
  });
});
