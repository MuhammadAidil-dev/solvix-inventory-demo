import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Solvix Inventory",
  description: "Demo pengelolaan stok satu gudang.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-[#f5f8fc] text-[#0d2340] antialiased">{children}</body>
    </html>
  );
}
