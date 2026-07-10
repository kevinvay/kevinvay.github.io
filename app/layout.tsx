import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kevin Wu — Portfolio",
  description: "Kevin Wu's portfolio for branding, product design, and design systems.",
  openGraph: {
    title: "Kevin Wu — Portfolio",
    description:
      "Branding, product design, and design systems by Kevin Wu.",
    images: ["/og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kevin Wu — Portfolio",
    description:
      "Branding, product design, and design systems by Kevin Wu.",
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
