import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#ff00ff",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://ceobars.shop"),
  title: {
    default: "CEO Bars - Spit Bars Like a Boss",
    template: "%s | CEO Bars",
  },
  description:
    "CEO Bars - Where executive excellence meets lyrical mastery. Learn to spit bars like a CEO and lead like a legend. Made on Apple MacBook Pro M3 with a $5.5B global impact.",
  keywords: [
    "CEO Bars",
    "rap",
    "hip hop",
    "music",
    "executive",
    "leadership",
    "lyrics",
    "bars",
    "Apple",
    "MacBook Pro",
    "GarageBand",
    "music production",
    "mindfulness",
    "healthy listening",
  ],
  authors: [{ name: "CEO Bars" }],
  creator: "CEO Bars",
  publisher: "CEO Bars",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ceobars.shop",
    siteName: "CEO Bars",
    title: "CEO Bars - Spit Bars Like a Boss",
    description:
      "Where executive excellence meets lyrical mastery. Learn to spit bars like a CEO and lead like a legend.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CEO Bars - Spit Bars Like a Boss",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CEO Bars - Spit Bars Like a Boss",
    description:
      "Where executive excellence meets lyrical mastery. Learn to spit bars like a CEO and lead like a legend.",
    images: ["/og-image.png"],
    creator: "@ceobars",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://ceobars.shop",
  },
  category: "music",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
