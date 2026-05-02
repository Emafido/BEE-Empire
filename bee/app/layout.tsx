import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

const storeName = "BEE Empire's Boutique";
const storeDescription = "Curated premium fashion drops for the modern, unapologetic woman. Highly limited collections.";

export const viewport: Viewport = {
  themeColor: "#000000",
};

export const metadata: Metadata = {
  // THE FIX: Telling Next.js exactly where your live site lives for accurate link sharing
  metadataBase: new URL("https://thebee-empire.vercel.app"),
  
  title: {
    default: storeName,
    template: `%s | ${storeName}`, 
  },
  description: storeDescription,
  keywords: ["fashion store", "boutique clothing", "limited drops", "women's fashion", "premium aesthetic"],
  authors: [{ name: storeName }],
  creator: storeName,
  
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: storeName,
    title: storeName,
    description: storeDescription,
  },
  twitter: {
    card: 'summary_large_image', 
    title: storeName,
    description: storeDescription,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}