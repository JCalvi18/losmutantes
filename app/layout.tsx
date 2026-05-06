
import type { Metadata } from "next";
import { Geist, Geist_Mono, Russo_One, Antonio, Bebas_Neue } from "next/font/google";
import SiteHeader from "./site-header";
import SiteFooter from "./site-footer";
import "./globals.css";
import Providers from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const russoOne = Russo_One({
  variable: "--font-russo-one",
  subsets: ["latin"],
  weight: "400",
});

const antonio = Antonio({
  variable: "--font-antonio",
  subsets: ["latin"],
});


const bebasNeue = Antonio({
  variable: "--font-bebas-neue",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Los Mutantes",
  description: "Teatro en Español",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${russoOne.variable} ${antonio.variable} ${bebasNeue.variable} antialiased`}
      >
        <Providers>
          <SiteHeader />

          {children}

          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}
