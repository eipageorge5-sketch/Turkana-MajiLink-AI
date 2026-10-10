import { OfflineSyncActivator } from '@/components/layout/OfflineSyncActivator';
import { OfflineBanner } from '@/components/layout/OfflineBanner'; // <-- Added import here
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Turkana MajiLink AI",
  description: "Smart Water Infrastructure Monitoring & Incident Response Platform",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#1d4ed8",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  // Await the asynchronous route parameters 
  const { locale } = await params;

  // Validate locale fallback
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Fetch the matching translation dictionary
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${inter.className} antialiased bg-background text-foreground`}>
        <NextIntlClientProvider messages={messages}>
          {/* NEW: Global Offline Banner - Shows instantly when internet drops */}
          <OfflineBanner />
          
          {/* Activate global offline sync */}
          <OfflineSyncActivator />
          
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}