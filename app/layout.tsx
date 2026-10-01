import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { PublicSiteChrome } from "@/components/layout/PublicSiteChrome";
import { CartProvider } from "@/components/providers/CartProvider";
import { AppSessionProvider } from "@/components/providers/SessionProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Adi's Fashion | Le tissu africain, autrement",
  description: "Boutique de mode moderne et élégante dédiée à la femme contemporaine.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-white text-[#171719]">
        <AppSessionProvider>
          <CartProvider>
            <PublicSiteChrome />
            <main className="flex-1">{children}</main>
          </CartProvider>
        </AppSessionProvider>
      </body>
    </html>
  );
}
