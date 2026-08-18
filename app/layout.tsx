import type { Metadata } from "next";
import { ParallaxController } from "./components/parallax";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kevin Wu — Portfolio",
  description: "Kevin Wu's portfolio for branding, product design, and design systems.",
  openGraph: {
    title: "Kevin Wu — Portfolio",
    description:
      "Branding, product design, and design systems by Kevin Wu.",
    images: ["/og.webp"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kevin Wu — Portfolio",
    description:
      "Branding, product design, and design systems by Kevin Wu.",
    images: ["/og.webp"],
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/favicon-32.png",
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}<ParallaxController /></body>
    </html>
  );
}
