import type { Meta, StoryObj } from '@storybook/react-vite';
import { Field } from './Field';
import { Input } from '../Input/Input';

const meta = { title: 'Components/Field', component: Field } satisfies Meta<
  typeof Field
>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Email',
    description: 'Use your work email.',
    children: <Input name="email" />,
  },
};

export const LongContent: Story = {
  args: {
    label:
      'Additional delivery instructions for your international shipping address',
    description:
      'Provide the complete building name, floor, unit number, and any additional delivery instructions.',
    children: (
      <Input
        name="instructions"
        defaultValue="A long address entered by the consumer"
      />
    ),
  },
};
