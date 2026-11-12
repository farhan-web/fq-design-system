import type { Meta, StoryObj } from '@storybook/react-vite';
import { Form } from './Form';
import { Field } from '../Field/Field';
import { Input } from '../Input/Input';
import { Button } from '../Button/Button';

const meta = {
  title: 'Components/Form',
  component: Form,
  args: {
    'aria-label': 'Registration',
    onSubmit: (event) => event.preventDefault(),
  },
} satisfies Meta<typeof Form>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Form {...args}>
      <Field label="Email" required description="Use your work email.">
        <Input name="email" type="email" />
      </Field>
      <Button type="submit">Register</Button>
    </Form>
  ),
};
