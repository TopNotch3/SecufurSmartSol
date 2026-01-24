import type { Metadata, Viewport } from "next";
import { Oswald } from "next/font/google";
import "./globals.css";

const oswald = Oswald({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-oswald',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Secufur Smart Solutions",
  description: "Premium batteries and electronics for all your power needs",
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${oswald.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
