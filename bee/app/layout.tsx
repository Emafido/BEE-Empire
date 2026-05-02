import type { Metadata, Viewport } from 'next';
import { Inter, Bebas_Neue, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider'; 

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

// The "Energetic & Space-Efficient" Branding Font
const bebas = Bebas_Neue({
  subsets: ['latin'],
  variable: '--font-bebas',
  weight: '400', // Bebas Neue only has 400, but it is naturally bold
});

// The "Stylish & Modern" UI Font
const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  weight: ['400', '500', '600', '700', '800'],
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
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${bebas.variable} ${jakarta.variable}`}>
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}