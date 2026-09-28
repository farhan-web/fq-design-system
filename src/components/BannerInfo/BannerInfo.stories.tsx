import type { Meta, StoryObj } from '@storybook/react-vite';
import { BannerInfo } from './BannerInfo';

const meta = {
  title: 'Components/BannerInfo',
  component: BannerInfo,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'White info card with elevation shadow. Supports an optional illustration (left), ' +
          'title, description (ReactNode), action link, close button, and decorative super graphic (top-right).',
      },
    },
  },
  args: {
    description: 'Dapatkan penawaran terbaik untuk perjalanan impianmu.',
  },
} satisfies Meta<typeof BannerInfo>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ================================
   Minimal
   ================================ */

export const DescriptionOnly: Story = {
  name: 'Minimal / Description only',
  args: {
    description: 'Gunakan kode promo TIKET50 untuk diskon 50%.',
  },
};

export const WithTitle: Story = {
  name: 'Minimal / With title',
  args: {
    title: 'Promo Spesial',
    description: 'Dapatkan cashback hingga Rp 200.000 untuk pembelian pertama.',
  },
};

export const WithAction: Story = {
  name: 'Minimal / With action link',
  args: {
    title: 'Promo Akhir Tahun',
    description: 'Diskon hingga 70% untuk semua destinasi populer.',
    action: { label: 'Lihat semua promo', onClick: () => {} },
  },
};

/* ================================
   With close button
   ================================ */

export const Closable: Story = {
  name: 'Closable / Default',
  args: {
    title: 'Tips Perjalanan',
    description:
      'Pesan tiket 2 minggu sebelum keberangkatan untuk harga terbaik.',
    action: { label: 'Pelajari lebih lanjut', onClick: () => {} },
    onClose: () => {},
  },
};

/* ================================
   With illustration
   ================================ */

export const WithIllustration: Story = {
  name: 'Illustration / Left slot',
  args: {
    title: 'Promo Spesial',
    description: 'Terbang ke Bali mulai Rp 299.000. Penawaran terbatas!',
    action: { label: 'Pesan sekarang', onClick: () => {} },
    illustration: (
      <div
        style={{
          width: 80,
          height: 80,
          background: 'linear-gradient(135deg, #E7F2FF 0%, #A3CFFF 100%)',
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 32,
        }}
      >
        ✈️
      </div>
    ),
  },
};

export const IllustrationClosable: Story = {
  name: 'Illustration / With close',
  args: {
    title: 'Hotel Pilihan',
    description: 'Menginap lebih hemat dengan promo eksklusif member tiket.',
    action: { label: 'Lihat hotel', onClick: () => {} },
    onClose: () => {},
    illustration: (
      <div
        style={{
          width: 80,
          height: 80,
          background: 'linear-gradient(135deg, #E2FBED 0%, #0BAE54 100%)',
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 32,
        }}
      >
        🏨
      </div>
    ),
  },
};

/* ================================
   With super graphic
   ================================ */

export const WithSuperGraphic: Story = {
  name: 'Super Graphic / Decorative top-right',
  args: {
    title: 'Flash Sale',
    description:
      'Tiket kereta api semua rute diskon hingga 40% — hanya hari ini.',
    action: { label: 'Beli sekarang', onClick: () => {} },
    onClose: () => {},
    superGraphic: (
      <div
        style={{
          width: 96,
          height: 93,
          background: 'linear-gradient(135deg, #FEF8D0 0%, #F5A623 100%)',
          opacity: 0.6,
        }}
      />
    ),
  },
};

export const FullFeatured: Story = {
  name: 'Full Featured',
  args: {
    title: 'Promo Mega Sale',
    description:
      'Diskon besar-besaran untuk semua destinasi. Gunakan kode MEGA70.',
    action: { label: 'Klaim promo', onClick: () => {} },
    onClose: () => {},
    illustration: (
      <div
        style={{
          width: 80,
          height: 80,
          background: 'linear-gradient(135deg, #FFDFDF 0%, #F15C59 100%)',
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 32,
        }}
      >
        🎟️
      </div>
    ),
    superGraphic: (
      <div
        style={{
          width: 96,
          height: 93,
          background: 'linear-gradient(135deg, #FFDFDF 0%, #F15C59 40%)',
          opacity: 0.3,
        }}
      />
    ),
  },
};
