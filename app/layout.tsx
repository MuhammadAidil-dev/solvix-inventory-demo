import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Solvix Inventory | Gudang",
  description: "Demo pengelolaan stok satu gudang.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-[#f4f5f1] text-[#202923] antialiased">{children}</body>
    </html>
  );
}
