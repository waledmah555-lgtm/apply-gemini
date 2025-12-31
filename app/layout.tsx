import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GCC Job Companion",
  description: "Check your job readiness for the GCC market.",
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
