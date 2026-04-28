import type { Metadata } from "next";
import { Inter, Great_Vibes } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import CartDrawer from "@/components/shop/CartDrawer";
import Footer from "@/components/navigation/Footer"; // 1. Import Footer

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const greatVibes = Great_Vibes({ weight: "400", subsets: ["latin"], variable: "--font-script" });

export const metadata: Metadata = {
  title: "BEE Empire's | High Fashion",
  description: "Shop the latest trends directly via WhatsApp.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* Added flex and min-h-screen to the body to ensure the footer stays at the bottom even on short pages */}
      <body className={`${inter.variable} ${greatVibes.variable} font-sans bg-boutique-light dark:bg-boutique-dark text-neutral-900 dark:text-neutral-50 transition-colors duration-500 ease-in-out antialiased flex flex-col min-h-screen`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          
          <main className="flex-grow">
            {children}
          </main>
          
          {/* 2. Add the Footer here */}
          <Footer />
          
          <CartDrawer />
        </ThemeProvider>
      </body>
    </html>
  );
}