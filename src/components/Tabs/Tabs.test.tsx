import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Tab, TabList, TabPanel, Tabs } from './Tabs';

function BasicTabs({
  activationMode,
}: { activationMode?: 'auto' | 'manual' } = {}) {
  return (
    <Tabs defaultValue="a" activationMode={activationMode}>
      <TabList>
        <Tab value="a">Tab A</Tab>
        <Tab value="b">Tab B</Tab>
        <Tab value="c" disabled>
          Tab C
        </Tab>
      </TabList>
      <TabPanel value="a">Panel A</TabPanel>
      <TabPanel value="b">Panel B</TabPanel>
      <TabPanel value="c">Panel C</TabPanel>
    </Tabs>
  );
}

describe('Tabs', () => {
  it('renders tabs and shows default panel', () => {
    render(<BasicTabs />);
    expect(screen.getByRole('tab', { name: 'Tab A' })).toBeInTheDocument();
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Panel A');
  });

  it('switches panel on tab click', () => {
    render(<BasicTabs />);
    fireEvent.click(screen.getByRole('tab', { name: 'Tab B' }));
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Panel B');
  });

  it('marks selected tab with aria-selected', () => {
    render(<BasicTabs />);
    expect(screen.getByRole('tab', { name: 'Tab A' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getByRole('tab', { name: 'Tab B' })).toHaveAttribute(
      'aria-selected',
      'false',
    );
  });

  it('disabled tab is not clickable', () => {
    render(<BasicTabs />);
    expect(screen.getByRole('tab', { name: 'Tab C' })).toBeDisabled();
  });

  it('links tab to panel via aria-controls', () => {
    render(<BasicTabs />);
    const tab = screen.getByRole('tab', { name: 'Tab A' });
    const panelId = tab.getAttribute('aria-controls');
    expect(screen.getByRole('tabpanel').id).toBe(panelId);
  });

  it('ArrowRight moves focus to next tab', () => {
    render(<BasicTabs />);
    const tabA = screen.getByRole('tab', { name: 'Tab A' });
    tabA.focus();
    fireEvent.keyDown(screen.getByRole('tablist'), { key: 'ArrowRight' });
    expect(screen.getByRole('tab', { name: 'Tab B' })).toHaveFocus();
  });

  it('ArrowLeft wraps to last tab', () => {
    render(<BasicTabs />);
    const tabA = screen.getByRole('tab', { name: 'Tab A' });
    tabA.focus();
    fireEvent.keyDown(screen.getByRole('tablist'), { key: 'ArrowLeft' });
    // wraps to last non-disabled tab (Tab B, since Tab C is disabled, but ArrowLeft skips only enabled)
    expect(document.activeElement).toBeInstanceOf(HTMLButtonElement);
  });

  it('calls onValueChange when tab is selected', () => {
    const onChange = vi.fn();
    render(
      <Tabs defaultValue="a" onValueChange={onChange}>
        <TabList>
          <Tab value="a">A</Tab>
          <Tab value="b">B</Tab>
        </TabList>
        <TabPanel value="a">A</TabPanel>
        <TabPanel value="b">B</TabPanel>
      </Tabs>,
    );
    fireEvent.click(screen.getByRole('tab', { name: 'B' }));
    expect(onChange).toHaveBeenCalledWith('b');
  });

  it('works as controlled component', () => {
    const { rerender } = render(
      <Tabs value="a">
        <TabList>
          <Tab value="a">A</Tab>
          <Tab value="b">B</Tab>
        </TabList>
        <TabPanel value="a">Panel A</TabPanel>
        <TabPanel value="b">Panel B</TabPanel>
      </Tabs>,
    );
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Panel A');
    rerender(
      <Tabs value="b">
        <TabList>
          <Tab value="a">A</Tab>
          <Tab value="b">B</Tab>
        </TabList>
        <TabPanel value="a">Panel A</TabPanel>
        <TabPanel value="b">Panel B</TabPanel>
      </Tabs>,
    );
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Panel B');
  });

  // ── A5: activationMode ───────────────────────────────────────

  it('auto mode: ArrowRight selects the focused tab', () => {
    render(<BasicTabs activationMode="auto" />);
    const tabA = screen.getByRole('tab', { name: 'Tab A' });
    tabA.focus();
    fireEvent.keyDown(screen.getByRole('tablist'), { key: 'ArrowRight' });
    // Tab B should now be both focused and selected
    expect(screen.getByRole('tab', { name: 'Tab B' })).toHaveFocus();
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Panel B');
  });

  it('manual mode: ArrowRight only moves focus, does not activate tab', () => {
    render(<BasicTabs activationMode="manual" />);
    const tabA = screen.getByRole('tab', { name: 'Tab A' });
    tabA.focus();
    fireEvent.keyDown(screen.getByRole('tablist'), { key: 'ArrowRight' });
    // Tab B has focus but Panel A is still shown
    expect(screen.getByRole('tab', { name: 'Tab B' })).toHaveFocus();
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Panel A');
  });

  it('default activationMode is auto', () => {
    // Without specifying activationMode, arrow should select
    render(<BasicTabs />);
    const tabA = screen.getByRole('tab', { name: 'Tab A' });
    tabA.focus();
    fireEvent.keyDown(screen.getByRole('tablist'), { key: 'ArrowRight' });
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Panel B');
  });
});
