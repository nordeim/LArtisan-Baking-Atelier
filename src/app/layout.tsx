import type { Metadata } from 'next';
import { Playfair_Display, DM_Sans } from 'next/font/google';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  preload: true,
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  title: "L'Artisan Baking Atelier | Premium Artisan Boulangerie",
  description:
    "Singapore's premier artisan bakery. Handcrafted sourdough, pâtisserie, and viennoiserie. Master the art of baking with our world-class instructors.",
  keywords: [
    'bakery',
    'sourdough',
    'artisan bread',
    'Singapore',
    'pastry',
    'croissant',
    'baking courses',
    'patisserie',
    'viennoiserie',
  ],
  authors: [{ name: "L'Artisan Baking Atelier" }],
  creator: "L'Artisan Baking Atelier",
  publisher: "L'Artisan Baking Atelier",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://artisan-baking-atelier.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "L'Artisan Baking Atelier",
    description: "Singapore's premier artisan bakery",
    url: 'https://artisan-baking-atelier.com',
    siteName: "L'Artisan Baking Atelier",
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: "L'Artisan Baking Atelier - Premium Artisan Boulangerie",
      },
    ],
    locale: 'en_SG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "L'Artisan Baking Atelier",
    description: "Singapore's premier artisan bakery",
    images: ['/images/twitter-image.jpg'],
    creator: '@artisanbaking',
  },
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
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en-SG"
      className={`${playfair.variable} ${dmSans.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-crust-50 text-crust-900 font-body antialiased">
        {children}
      </body>
    </html>
  );
}
