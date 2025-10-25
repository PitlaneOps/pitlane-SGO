import { Geist, Geist_Mono } from 'next/font/google';

import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';

import { ThemeProvider } from 'next-themes';

import Link from 'next/link';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { AnimatedThemeToggler } from '@/components/magicui/animated-theme-toggler';
import { Toaster } from '@/components/ui/sonner';

import { LogoContainer } from './_components/layout/logo';
import { NavbarSearchButton } from './_components/layout/navbar/search';
import { NavbarAuthButton } from './_components/layout/navbar/auth-button';

import { BSCProvider } from './_contexts/bsc';
import { SearchProvider } from './_contexts/search/provider';
import { PostHogProvider } from './_contexts/posthog';
import { ChainProvider } from './_contexts/chain/provider';

import { TRPCReactProvider } from '@/trpc/client';

import { env } from '@/env';

import type { Metadata, Viewport } from 'next';

import { SessionProvider } from 'next-auth/react';
import { ChainSelector } from './_components/layout/navbar/chain-selector';

import { connection } from 'next/server';

import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'xgrain402-scan • BSC Payment Rail Explorer',
    template: '%s | xgrain402-scan',
  },
  description:
    'Explore the xgrain402 BSC ecosystem. View transactions, facilitators, programs and resources. Scaling microtransactions to machine economies.',
  keywords: [
    'xgrain402',
    'bsc',
    'binance smart chain',
    'blockchain',
    'ecosystem',
    'transactions',
    'microtransactions',
    'machine economies',
    'crypto',
    'web3',
    'bsc explorer',
    'analytics',
    'facilitators',
  ],
  authors: [{ name: 'xgrain402' }],
  creator: 'xgrain402',
  publisher: 'xgrain402',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: env.NEXT_PUBLIC_APP_URL,
    title: 'xgrain402-scan • BSC Payment Rail Explorer',
    description:
      'Explore the xgrain402 BSC ecosystem. View transactions, facilitators, programs and resources. Scaling microtransactions to machine economies.',
    siteName: 'xgrain402-scan',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'xgrain402-scan • BSC Payment Rail Explorer',
    description:
      'Explore the xgrain402 BSC ecosystem. View transactions, facilitators, programs and resources. Scaling microtransactions to machine economies.',
    creator: '@xgrain402',
  },
  appleWebApp: {
    title: 'xgrain402-scan',
    statusBarStyle: 'black-translucent',
  },
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
};

export const viewport: Viewport = {
  width: 'device-width',
  height: 'device-height',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#090909' },
    { media: '(prefers-color-scheme: light)', color: 'white' },
  ],
};

export default async function RootLayout({
  children,
  breadcrumbs,
}: LayoutProps<'/'>) {
  await connection();
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster />
        <SpeedInsights />
        <Analytics />
        <SessionProvider>
          <ChainProvider>
            <TRPCReactProvider>
              <SearchProvider>
                <BSCProvider>
                  <PostHogProvider>
                      <ThemeProvider
                        attribute="class"
                        defaultTheme="light"
                        storageKey="xgrain402-scan-theme"
                        enableSystem={true}
                      >
                        <div className="min-h-screen flex flex-col relative">
                          <LogoContainer>
                            <Link href="/" prefetch={false}>
                              <Logo className="size-full aspect-square" />
                            </Link>
                          </LogoContainer>
                          <header className="w-full flex flex-col pt-4 justify-center bg-card">
                            <div className="flex items-center justify-between w-full px-2 md:px-6 pb-0 md:pb-0 h-10">
                              <div className="pl-8 md:pl-8 flex items-center gap-2 md:gap-3">
                                {breadcrumbs}
                              </div>
                              <div className="flex items-center gap-1 md:gap-2">
                                <ChainSelector />
                                <NavbarSearchButton />
                                <NavbarAuthButton />
                                <a
                                  href="https://github.com/xgrain402/xgrain402-scan"
                                  target="_blank"
                                >
                                  <Button variant="outline" size={'navbar'}>
                                    <Image
                                      src="/github.png"
                                      alt="GitHub"
                                      width={16}
                                      height={16}
                                      className="size-4"
                                    />
                                    <span className="hidden md:block">
                                      Contribute
                                    </span>
                                  </Button>
                                </a>
                                <AnimatedThemeToggler />
                              </div>
                            </div>
                          </header>
                          <div className="bg-background flex-1 flex flex-col">
                            {children}
                          </div>
                        </div>
                      </ThemeProvider>
                  </PostHogProvider>
                </BSCProvider>
              </SearchProvider>
            </TRPCReactProvider>
          </ChainProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
