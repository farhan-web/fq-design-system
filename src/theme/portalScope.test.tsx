import { createRef } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { FqThemeProvider } from './FqThemeProvider';
import { Dialog } from '../components/Dialog/Dialog';
import { BottomSheet } from '../components/BottomSheet/BottomSheet';
import { Snackbar } from '../components/Snackbar/Snackbar';

const tokens = (color: string) => ({
  schemaVersion: 1 as const,
  semantic: {
    light: { '--color-primary': color },
    dark: { '--color-primary': color },
  },
});
const modalRoot = (testId: string) =>
  screen.getByTestId(testId).closest('.MuiModal-root') as HTMLElement;

describe('portal theme scope', () => {
  it('isolates brands, updates live portals, preserves paper refs and removes portal nodes', () => {
    const ref = createRef<HTMLDivElement>();
    const bodyStyle = document.body.getAttribute('style');
    const view = (color: string) => (
      <>
        <FqThemeProvider tokens={tokens(color)} mode="dark">
          <Dialog
            open
            title="A"
            ref={ref}
            slotProps={{ paper: { 'data-testid': 'a' } }}
          />
        </FqThemeProvider>
        <FqThemeProvider tokens={tokens('#112233')} mode="light">
          <Dialog
            open
            title="B"
            slotProps={{ paper: { 'data-testid': 'b' } }}
          />
        </FqThemeProvider>
      </>
    );
    const { rerender, unmount } = render(view('#663399'));
    const a = modalRoot('a');
    const b = modalRoot('b');
    expect(a.style.getPropertyValue('--color-primary')).toBe('#663399');
    expect(a).toHaveAttribute('data-theme', 'dark');
    expect(ref.current).toBe(screen.getByTestId('a'));
    expect(b.style.getPropertyValue('--color-primary')).toBe('#112233');
    rerender(view('#884422'));
    expect(a.style.getPropertyValue('--color-primary')).toBe('#884422');
    expect(b.style.getPropertyValue('--color-primary')).toBe('#112233');
    expect(document.body.style.getPropertyValue('--color-primary')).toBe('');
    unmount();
    expect(a).not.toBeInTheDocument();
    expect(b).not.toBeInTheDocument();
    expect(ref.current).toBeNull();
    expect(document.body.getAttribute('style') ?? '').toBe(bodyStyle ?? '');
  });

  it('uses custom Dialog containers and keeps nested portal scopes', () => {
    const host = document.createElement('div');
    document.body.append(host);
    const { unmount } = render(
      <FqThemeProvider tokens={tokens('#663399')}>
        <Dialog
          open
          title="Parent"
          container={() => host}
          slotProps={{ paper: { 'data-testid': 'parent' } }}
        >
          <FqThemeProvider mode="dark" tokens={tokens('#334455')}>
            <Dialog
              open
              title="Nested"
              container={() => host}
              slotProps={{ paper: { 'data-testid': 'nested' } }}
            />
          </FqThemeProvider>
        </Dialog>
      </FqThemeProvider>,
    );
    expect(host).toContainElement(modalRoot('parent'));
    expect(host).toContainElement(modalRoot('nested'));
    expect(modalRoot('nested').style.getPropertyValue('--color-primary')).toBe(
      '#334455',
    );
    expect(modalRoot('parent')).toHaveAttribute('data-theme', 'light');
    unmount();
    expect(host).toBeEmptyDOMElement();
    host.remove();
  });

  it('supports custom BottomSheet and Snackbar portals and cleans up on unmount', async () => {
    const host = document.createElement('div');
    document.body.append(host);
    const ref = createRef<HTMLDivElement>();
    const { unmount } = render(
      <FqThemeProvider tokens={tokens('#663399')}>
        <BottomSheet
          open
          title="Sheet"
          onClose={vi.fn()}
          container={() => host}
          slotProps={{ root: { 'data-testid': 'sheet' } }}
        />
        <Snackbar
          open
          message="Saved"
          autoHideDuration={null}
          disablePortal={false}
          container={() => host}
          ref={ref}
          slotProps={{ root: { 'data-testid': 'snack' } }}
        />
      </FqThemeProvider>,
    );
    await waitFor(() =>
      expect(screen.getByTestId('sheet')).toBeInTheDocument(),
    );
    expect(host).toContainElement(modalRoot('sheet'));
    expect(host).toContainElement(ref.current);
    expect(ref.current!.style.getPropertyValue('--color-primary')).toBe(
      '#663399',
    );
    unmount();
    expect(host).toBeEmptyDOMElement();
    host.remove();
  });

  it('retains inline support and carries inherited scope through a legacy nested provider', () => {
    const { container } = render(
      <FqThemeProvider tokens={tokens('#663399')}>
        <FqThemeProvider>
          <Dialog
            open
            title="Inline"
            disablePortal
            slotProps={{ paper: { 'data-testid': 'inline' } }}
          />
          <Snackbar
            open
            message="Inline status"
            autoHideDuration={null}
            slotProps={{ root: { 'data-testid': 'status' } }}
          />
        </FqThemeProvider>
      </FqThemeProvider>,
    );
    expect(screen.getByRole('dialog', { name: 'Inline' })).toBe(
      screen.getByTestId('inline'),
    );
    expect(container).toContainElement(modalRoot('inline'));
    expect(modalRoot('inline').style.getPropertyValue('--color-primary')).toBe(
      '#663399',
    );
    expect(container).toContainElement(screen.getByTestId('status'));
  });

  it('does not evaluate container callbacks or access document during server rendering', () => {
    const host = vi.fn(() => document.body);
    const html = renderToString(
      <FqThemeProvider tokens={tokens('#663399')} mode="dark">
        <Dialog open title="Server" container={host} />
        <BottomSheet open title="Sheet" onClose={() => {}} container={host} />
        <Snackbar
          open
          message="Portal"
          disablePortal={false}
          container={host}
        />
        <Snackbar open message="Inline" />
      </FqThemeProvider>,
    );
    expect(host).not.toHaveBeenCalled();
    expect(html).toContain('Inline');
    expect(html).toContain('data-theme="dark"');
    expect(html).not.toContain('role="dialog"');
  });
});
