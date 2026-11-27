import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BorderBooks Matcher",
  description:
    "Deterministic invoice and transaction reconciliation with an explainable audit trail.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
