import type { Metadata } from 'next';
import { Oswald, Inter } from 'next/font/google';
import './globals.css';
import { Navbar, Footer } from '@/components/buyer/layout';
import { ToastContainer } from '@/components/buyer/common';
import { NetworkStatus } from '@/components/buyer/common/NetworkStatus';
import { SessionExpiredModal } from '@/components/buyer/common/SessionExpiredModal';

const oswald = Oswald({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: {
    default: 'LUVARTE - Premium Batteries & Electronics',
    template: '%s | LUVARTE',
  },
  description:
    'Shop premium batteries, electronics, and customized power solutions. Quality products for all your power needs.',
  keywords: [
    'batteries',
    'electronics',
    'custom batteries',
    'li-ion batteries',
    'lead-acid batteries',
    'chargers',
    'power supplies',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://luvarte.com',
    siteName: 'LUVARTE',
    title: 'LUVARTE - Premium Batteries & Electronics',
    description:
      'Shop premium batteries, electronics, and customized power solutions. Quality products for all your power needs.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LUVARTE - Premium Batteries & Electronics',
    description:
      'Shop premium batteries, electronics, and customized power solutions.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function BuyerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${oswald.variable} ${inter.variable} font-sans min-h-screen flex flex-col`}>
      <NetworkStatus />
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
      <ToastContainer />
      <SessionExpiredModal />
    </div>
  );
}
