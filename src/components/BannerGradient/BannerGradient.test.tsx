import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { BannerGradient } from './BannerGradient';

describe('BannerGradient', () => {
  // ── text prop ──────────────────────────────────────────────

  it('renders the text', () => {
    render(<BannerGradient text="Special Offer" />);
    expect(screen.getByText('Special Offer')).toBeInTheDocument();
  });

  // ── variant classes ────────────────────────────────────────

  it('applies big-rounded variant class by default', () => {
    const { container } = render(<BannerGradient text="Promo" />);
    expect(container.firstChild).toHaveClass('fq-banner-gradient--big-rounded');
  });

  it('applies small variant class', () => {
    const { container } = render(
      <BannerGradient text="Promo" variant="small" />,
    );
    expect(container.firstChild).toHaveClass('fq-banner-gradient--small');
  });

  it('applies big-rectangle variant class', () => {
    const { container } = render(
      <BannerGradient text="Promo" variant="big-rectangle" />,
    );
    expect(container.firstChild).toHaveClass(
      'fq-banner-gradient--big-rectangle',
    );
  });

  // ── gradient class ─────────────────────────────────────────

  it('applies violet gradient class by default', () => {
    const { container } = render(<BannerGradient text="Promo" />);
    expect(container.firstChild).toHaveClass('fq-banner-gradient--violet');
  });

  it('applies the specified gradient class', () => {
    const { container } = render(
      <BannerGradient text="Promo" gradient="orange" />,
    );
    expect(container.firstChild).toHaveClass('fq-banner-gradient--orange');
  });

  // ── icon slot ──────────────────────────────────────────────

  it('renders icon when provided', () => {
    render(<BannerGradient text="Promo" icon={<img alt="plane" src="" />} />);
    expect(screen.getByAltText('plane')).toBeInTheDocument();
  });

  // ── bold modifier ──────────────────────────────────────────

  it('applies bold class when bold prop is true', () => {
    const { container } = render(<BannerGradient text="Promo" bold />);
    expect(
      container.querySelector('.fq-banner-gradient__text--bold'),
    ).toBeInTheDocument();
  });

  it('does not apply bold class by default', () => {
    const { container } = render(<BannerGradient text="Promo" />);
    expect(
      container.querySelector('.fq-banner-gradient__text--bold'),
    ).not.toBeInTheDocument();
  });

  // ── chevron ────────────────────────────────────────────────

  it('shows chevron by default for small variant', () => {
    const { container } = render(
      <BannerGradient text="Promo" variant="small" />,
    );
    expect(
      container.querySelector('.fq-banner-gradient__chevron'),
    ).toBeInTheDocument();
  });

  it('hides chevron by default for big-rounded variant', () => {
    const { container } = render(
      <BannerGradient text="Promo" variant="big-rounded" />,
    );
    expect(
      container.querySelector('.fq-banner-gradient__chevron'),
    ).not.toBeInTheDocument();
  });

  it('shows chevron when showChevron=true on big variant', () => {
    const { container } = render(
      <BannerGradient text="Promo" variant="big-rounded" showChevron />,
    );
    expect(
      container.querySelector('.fq-banner-gradient__chevron'),
    ).toBeInTheDocument();
  });

  it('hides chevron when showChevron=false on small variant', () => {
    const { container } = render(
      <BannerGradient text="Promo" variant="small" showChevron={false} />,
    );
    expect(
      container.querySelector('.fq-banner-gradient__chevron'),
    ).not.toBeInTheDocument();
  });

  // ── countdown (small only) ─────────────────────────────────

  it('renders countdown slot in small variant', () => {
    render(
      <BannerGradient
        text="Promo"
        variant="small"
        countdown={<span>01:00:00</span>}
      />,
    );
    expect(screen.getByText('01:00:00')).toBeInTheDocument();
  });

  it('does not render countdown slot in big variant', () => {
    render(
      <BannerGradient
        text="Promo"
        variant="big-rounded"
        countdown={<span>01:00:00</span>}
      />,
    );
    expect(screen.queryByText('01:00:00')).not.toBeInTheDocument();
  });

  // ── page control ───────────────────────────────────────────

  it('renders page control dots for big-rounded variant', () => {
    const { container } = render(
      <BannerGradient
        text="Promo"
        variant="big-rounded"
        pageControl={{ count: 3, current: 0 }}
      />,
    );
    expect(container.querySelectorAll('.fq-banner-gradient__dot')).toHaveLength(
      3,
    );
  });

  it('marks the current dot as active', () => {
    const { container } = render(
      <BannerGradient
        text="Promo"
        variant="big-rounded"
        pageControl={{ count: 3, current: 1 }}
      />,
    );
    const dots = container.querySelectorAll('.fq-banner-gradient__dot');
    expect(dots[1]).toHaveClass('fq-banner-gradient__dot--active');
    expect(dots[0]).not.toHaveClass('fq-banner-gradient__dot--active');
  });

  it('applies blue page control class when variant is blue', () => {
    const { container } = render(
      <BannerGradient
        text="Promo"
        variant="big-rounded"
        pageControl={{ count: 3, current: 0, variant: 'blue' }}
      />,
    );
    expect(
      container.querySelector('.fq-banner-gradient__page-control--blue'),
    ).toBeInTheDocument();
  });

  it('does not render page control for small variant', () => {
    const { container } = render(
      <BannerGradient
        text="Promo"
        variant="small"
        pageControl={{ count: 3, current: 0 }}
      />,
    );
    expect(
      container.querySelector('.fq-banner-gradient__page-control'),
    ).not.toBeInTheDocument();
  });

  // ── misc ───────────────────────────────────────────────────

  it('applies extra className', () => {
    const { container } = render(
      <BannerGradient text="Promo" className="custom" />,
    );
    expect(container.firstChild).toHaveClass('fq-banner-gradient', 'custom');
  });

  it('forwards ref', () => {
    const ref = { current: null } as { current: HTMLDivElement | null };
    render(<BannerGradient text="Promo" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
