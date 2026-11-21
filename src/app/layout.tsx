import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { JsonLd } from '@/components/seo/JsonLd';
import { siteConfig } from '@/data/siteConfig';

export const viewport: Viewport = {
  themeColor: '#08090B',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: 'SilverLine Studio | Product Development & Digital Innovation',
    template: '%s | SilverLine Studio'
  },
  description:
    'SilverLine Studio designs and develops modern digital products, web applications, mobile apps and innovative software solutions.',
  keywords: [
    'product development',
    'digital engineering',
    'MVP development',
    'Next.js',
    'TypeScript',
    'software studio',
    'UI/UX design',
    'AI integration'
  ],
  authors: [{ name: 'SilverLine Studio' }],
  creator: 'SilverLine Studio',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: 'SilverLine Studio | Product Development & Digital Innovation',
    description: siteConfig.supportingStatement,
    siteName: 'SilverLine Studio',
    images: [
      {
        url: '/images/og-image.svg',
        width: 1200,
        height: 630,
        alt: "SilverLine Studio — We don't just build products. We build what comes next."
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SilverLine Studio | Product Development & Digital Innovation',
    description: siteConfig.supportingStatement,
    images: ['/images/og-image.svg'],
    creator: '@silverlinestudio'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background-primary text-white font-sans antialiased min-h-screen flex flex-col selection:bg-surface-elevated selection:text-silver">
        <JsonLd />
        <Navbar />
        <main className="flex-1 pt-20">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
