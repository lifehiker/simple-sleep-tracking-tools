import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://sleep-log.local"),
  title: {
    default: "Sleep Log for Apple Watch",
    template: "%s | Sleep Log for Apple Watch",
  },
  description:
    "Simple sleep tracking for Apple Watch users: sleep debt, naps, shift schedules, and snore check fallbacks in one focused utility.",
  openGraph: {
    title: "Sleep Log for Apple Watch",
    description:
      "Track sleep debt, naps, shift schedules, and snore checks without a bloated wellness platform.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sleep Log for Apple Watch",
    description:
      "Practical sleep tracking with Apple Health import fallbacks, nap timers, and shift-friendly trends.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
