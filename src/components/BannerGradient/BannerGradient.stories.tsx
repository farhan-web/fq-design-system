import type { Meta, StoryObj } from '@storybook/react-vite';
import { Plane, Hotel, MapPin, Zap, Tag, Star } from 'lucide-react';

import { BannerGradient } from './BannerGradient';
import { Countdown } from '../Countdown/Countdown';

const meta = {
  title: 'Components/BannerGradient',
  component: BannerGradient,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Gradient promotional banner. Three variants: **small** (48px strip), ' +
          '**big-rounded** (card with 16px top radius), **big-rectangle** (card with no radius). ' +
          'Supports 8 gradient color options and optional page-control dots.',
      },
    },
  },
  args: {
    text: 'Beli tiket pesawat, cashback 50%!',
    variant: 'big-rounded',
    gradient: 'violet',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['small', 'big-rounded', 'big-rectangle'],
    },
    gradient: {
      control: 'select',
      options: [
        'violet',
        'green',
        'orange',
        'red',
        'tosca',
        'blue',
        'purple',
        'light-blue',
      ],
    },
    bold: { control: 'boolean' },
    showChevron: { control: 'boolean' },
    text: { control: 'text' },
  },
} satisfies Meta<typeof BannerGradient>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ================================
   Small Single
   ================================ */

export const SmallDefault: Story = {
  name: 'Small / Default',
  args: {
    variant: 'small',
    gradient: 'violet',
    icon: <Plane />,
    text: (
      <>
        <strong>Beli tiket pesawat,</strong> cashback 50% untuk semua rute
        domestik!
      </>
    ),
  },
};

export const SmallBold: Story = {
  name: 'Small / Bold text (all)',
  args: {
    variant: 'small',
    gradient: 'orange',
    icon: <Zap />,
    text: 'Flash Sale — semua rute diskon hingga 50%',
    bold: true,
  },
};

export const SmallWithCountdown: Story = {
  name: 'Small / With Countdown',
  args: {
    variant: 'small',
    gradient: 'red',
    icon: <Tag />,
    text: (
      <>
        <strong>Flash Sale habis dalam</strong>
      </>
    ),
    countdown: (
      <Countdown targetDate={new Date(Date.now() + 2 * 60 * 60 * 1000)} />
    ),
  },
};

export const SmallNoChevron: Story = {
  name: 'Small / No chevron',
  args: {
    variant: 'small',
    gradient: 'tosca',
    icon: <MapPin />,
    text: (
      <>
        <strong>Destinasi wisata terbaik</strong> minggu ini — jelajahi sekarang
      </>
    ),
    showChevron: false,
  },
};

/* ================================
   Big Rounded Single
   ================================ */

export const BigRoundedDefault: Story = {
  name: 'Big Rounded / Default',
  args: {
    variant: 'big-rounded',
    gradient: 'violet',
    icon: <Plane />,
    text: 'Terbang ke mana saja dengan harga terbaik. Cashback hingga 50% untuk semua rute domestik.',
  },
};

export const BigRoundedWithChevron: Story = {
  name: 'Big Rounded / With chevron',
  args: {
    variant: 'big-rounded',
    gradient: 'blue',
    icon: <Hotel />,
    text: 'Hotel bintang 5 mulai dari Rp 200.000/malam',
    showChevron: true,
  },
};

export const BigRoundedWithPageControl: Story = {
  name: 'Big Rounded / With page control (white)',
  args: {
    variant: 'big-rounded',
    gradient: 'green',
    icon: <Star />,
    text: 'Promo spesial akhir tahun — up to 70% off',
    pageControl: { count: 3, current: 0, variant: 'white' },
  },
};

export const BigRoundedPageControlBlue: Story = {
  name: 'Big Rounded / With page control (blue)',
  args: {
    variant: 'big-rounded',
    gradient: 'light-blue',
    icon: <MapPin />,
    text: 'Jelajahi destinasi impianmu sekarang',
    pageControl: { count: 4, current: 1, variant: 'blue' },
  },
};

/* ================================
   Big Rectangle Single
   ================================ */

export const BigRectangleDefault: Story = {
  name: 'Big Rectangle / Default',
  args: {
    variant: 'big-rectangle',
    gradient: 'purple',
    icon: <Zap />,
    text: 'Flash Sale: Tiket kereta api semua rute diskon hingga 40%',
  },
};

export const BigRectangleWithPageControl: Story = {
  name: 'Big Rectangle / With page control',
  args: {
    variant: 'big-rectangle',
    gradient: 'tosca',
    icon: <Tag />,
    text: 'Promo terbatas — gunakan kode TIKET50 untuk ekstra diskon',
    pageControl: { count: 3, current: 2, variant: 'white' },
  },
};

/* ================================
   Gradient Showcase
   ================================ */

const GRADIENTS = [
  'violet',
  'green',
  'orange',
  'red',
  'tosca',
  'blue',
  'purple',
  'light-blue',
] as const;

export const GradientShowcase: Story = {
  name: 'Gradient / All colors',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {GRADIENTS.map((g) => (
        <BannerGradient
          key={g}
          variant="small"
          gradient={g}
          icon={<Plane />}
          text={`Gradient: ${g}`}
        />
      ))}
    </div>
  ),
};
