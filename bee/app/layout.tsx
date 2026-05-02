import type { Metadata, Viewport } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
// THE FIX: Added curly braces around ThemeProvider
import { ThemeProvider } from '@/components/ThemeProvider'; 

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  style: ['italic', 'normal'],
});

const storeName = "BEE Empire's Boutique";
const storeDescription = "Curated premium fashion drops for the modern, unapologetic woman. Highly limited collections.";

export const viewport: Viewport = {
  themeColor: "#000000",
};

export const metadata: Metadata = {
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
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}