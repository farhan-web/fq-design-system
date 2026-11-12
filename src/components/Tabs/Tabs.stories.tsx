import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tab, TabList, TabPanel, Tabs } from './Tabs';

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: { component: 'Navigate between related content sections.' },
    },
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="flights">
      <TabList>
        <Tab value="flights">Flights</Tab>
        <Tab value="hotels">Hotels</Tab>
        <Tab value="trains">Trains</Tab>
        <Tab value="cars" disabled>
          Cars
        </Tab>
      </TabList>
      <TabPanel value="flights">Search for flights worldwide.</TabPanel>
      <TabPanel value="hotels">Find hotels near you.</TabPanel>
      <TabPanel value="trains">Book train tickets.</TabPanel>
      <TabPanel value="cars">Car rentals coming soon.</TabPanel>
    </Tabs>
  ),
};

export const Controlled: Story = {
  render: function ControlledDemo() {
    const [value, setValue] = React.useState<string | number>('a');
    return (
      <Tabs value={value} onValueChange={setValue}>
        <TabList>
          <Tab value="a">Tab A</Tab>
          <Tab value="b">Tab B</Tab>
          <Tab value="c">Tab C</Tab>
        </TabList>
        <TabPanel value="a">Panel A content</TabPanel>
        <TabPanel value="b">Panel B content</TabPanel>
        <TabPanel value="c">Panel C content</TabPanel>
      </Tabs>
    );
  },
};

export const ManualActivation: Story = {
  name: 'Manual Activation (keyboard)',
  parameters: {
    docs: {
      description: {
        story:
          'With `activationMode="manual"`, arrow keys move focus without changing the active panel. Press Enter or Space to activate the focused tab.',
      },
    },
  },
  render: () => (
    <Tabs defaultValue="flights" activationMode="manual">
      <TabList>
        <Tab value="flights">Flights</Tab>
        <Tab value="hotels">Hotels</Tab>
        <Tab value="trains">Trains</Tab>
      </TabList>
      <TabPanel value="flights">
        Arrow to Hotels or Trains, then press Enter to switch.
      </TabPanel>
      <TabPanel value="hotels">Hotel panel selected.</TabPanel>
      <TabPanel value="trains">Train panel selected.</TabPanel>
    </Tabs>
  ),
};

export const DensityBadgeContract: Story = {
  render: () => (
    <Tabs defaultValue="flights">
      <TabList>
        <Tab value="flights" badge="4">
          Flights
        </Tab>
        <Tab value="hotels">Hotels</Tab>
      </TabList>
      <TabPanel value="flights">Flights with a badge</TabPanel>
      <TabPanel value="hotels">Hotels</TabPanel>
    </Tabs>
  ),
};
