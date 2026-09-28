import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { BannerInfo } from './BannerInfo';

describe('BannerInfo', () => {
  // ── description ────────────────────────────────────────────

  it('renders string description', () => {
    render(<BannerInfo description="Book your trip now" />);
    expect(screen.getByText('Book your trip now')).toBeInTheDocument();
  });

  it('renders ReactNode description', () => {
    render(
      <BannerInfo
        description={
          <>
            <strong>Limited offer</strong> — only 3 seats left
          </>
        }
      />,
    );
    expect(screen.getByText('Limited offer')).toBeInTheDocument();
    expect(screen.getByText(/only 3 seats left/)).toBeInTheDocument();
  });

  // ── title ───────────────────────────────────────────────────

  it('renders title when provided', () => {
    render(<BannerInfo title="Special Promo" description="Details here" />);
    expect(screen.getByText('Special Promo')).toBeInTheDocument();
  });

  it('does not render title element when omitted', () => {
    const { container } = render(<BannerInfo description="Details here" />);
    expect(
      container.querySelector('.fq-banner-info__title'),
    ).not.toBeInTheDocument();
  });

  // ── action ──────────────────────────────────────────────────

  it('renders action button when provided', () => {
    const onClick = vi.fn();
    render(
      <BannerInfo
        description="Details"
        action={{ label: 'Learn more', onClick }}
      />,
    );
    const btn = screen.getByRole('button', { name: 'Learn more' });
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not render action when omitted', () => {
    const { container } = render(<BannerInfo description="Details" />);
    expect(
      container.querySelector('.fq-banner-info__action'),
    ).not.toBeInTheDocument();
  });

  // ── close button ────────────────────────────────────────────

  it('renders close button when onClose is provided', () => {
    render(<BannerInfo description="Details" onClose={() => {}} />);
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(<BannerInfo description="Details" onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not render close button when onClose is omitted', () => {
    render(<BannerInfo description="Details" />);
    expect(
      screen.queryByRole('button', { name: 'Close' }),
    ).not.toBeInTheDocument();
  });

  it('applies fq-banner-info--closable class when onClose is provided', () => {
    const { container } = render(
      <BannerInfo description="Details" onClose={() => {}} />,
    );
    expect(container.firstChild).toHaveClass('fq-banner-info--closable');
  });

  it('does not apply closable class when onClose is omitted', () => {
    const { container } = render(<BannerInfo description="Details" />);
    expect(container.firstChild).not.toHaveClass('fq-banner-info--closable');
  });

  // ── illustration ────────────────────────────────────────────

  it('renders illustration when provided', () => {
    render(
      <BannerInfo
        description="Details"
        illustration={<img alt="promo" src="" />}
      />,
    );
    // getByRole respects aria-hidden; passing means illustration is accessible to AT
    expect(screen.getByRole('img', { name: 'promo' })).toBeInTheDocument();
  });

  it('illustration is not aria-hidden (consumer controls accessibility)', () => {
    const { container } = render(
      <BannerInfo
        description="Details"
        illustration={<img alt="promo" src="" />}
      />,
    );
    const slot = container.querySelector('.fq-banner-info__illustration');
    expect(slot).not.toHaveAttribute('aria-hidden');
  });

  it('does not render illustration slot when omitted', () => {
    const { container } = render(<BannerInfo description="Details" />);
    expect(
      container.querySelector('.fq-banner-info__illustration'),
    ).not.toBeInTheDocument();
  });

  // ── super graphic ───────────────────────────────────────────

  it('renders super graphic when provided', () => {
    render(
      <BannerInfo
        description="Details"
        superGraphic={<img alt="decoration" src="" />}
      />,
    );
    expect(screen.getByAltText('decoration')).toBeInTheDocument();
  });

  it('does not render super graphic slot when omitted', () => {
    const { container } = render(<BannerInfo description="Details" />);
    expect(
      container.querySelector('.fq-banner-info__super-graphic'),
    ).not.toBeInTheDocument();
  });

  // ── misc ────────────────────────────────────────────────────

  it('applies extra className', () => {
    const { container } = render(
      <BannerInfo description="Details" className="custom" />,
    );
    expect(container.firstChild).toHaveClass('fq-banner-info', 'custom');
  });

  it('forwards ref', () => {
    const ref = { current: null } as { current: HTMLDivElement | null };
    render(<BannerInfo description="Details" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
