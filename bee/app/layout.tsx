import type { Metadata, Viewport } from 'next';
import { Inter, Syne, Montserrat } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider'; 

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

// The "Stylish/Energetic" Font
const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  weight: ['400', '500', '600', '700', '800'],
});

// The "Active" Font
const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  weight: ['700', '900'],
});

const storeName = "BEE Empire's Boutique";
const storeDescription = "Curated premium fashion drops for the modern, unapologetic woman.";

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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${syne.variable} ${montserrat.variable}`}>
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}