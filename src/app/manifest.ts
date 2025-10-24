import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'xgrain402-scan',
    short_name: 'xgrain402-scan',
    description:
      'Explore the xgrain402 Solana ecosystem. View transactions, facilitators, programs and resources. Scaling microtransactions to machine economies.',
    start_url: '/',
    display: 'standalone',
    theme_color: '#ffffff',
    background_color: '#ffffff',
    categories: ['solana', 'blockchain', 'payments', 'microtransactions', 'developers'],
    icons: [
      {
        src: '/manifest/192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/manifest/192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/manifest/512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/manifest/512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
