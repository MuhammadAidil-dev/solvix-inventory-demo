"use client";

import Link from "next/link";
import { PageHeading } from "../../../components/ui/PageHeading";
import { TransactionTable } from "../../../features/inventory/components/TransactionTable";
import { MovementForm } from "../../../features/inventory/components/MovementForm";
import { useInventoryStore } from "../../../features/inventory/store/inventory";

export default function TransactionsPage() {
  const transactions = useInventoryStore((state) => state.transactions);
  const items = useInventoryStore((state) => state.items);
  return (
    <>
      <PageHeading eyebrow="Pergerakan stok" title="Catat transaksi" description="Barang masuk, barang keluar, atau koreksi jumlah fisik." />
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(340px,0.8fr)_minmax(0,1.2fr)]">
        <MovementForm />
        <section className="overflow-hidden rounded-2xl border border-[#e0e5dd] bg-white shadow-[0_8px_30px_rgba(35,52,39,0.035)]">
          <div className="flex items-center justify-between border-b border-[#e8ece6] px-5 py-4"><div><h2 className="text-sm font-semibold text-[#344238]">Transaksi terbaru</h2><p className="mt-1 text-[11px] text-[#8a958b]">{transactions.length} pergerakan tercatat</p></div><Link href="/history" className="text-xs font-semibold text-[#47664d] hover:underline">Lihat semua →</Link></div>
          <TransactionTable transactions={transactions} items={items} compact />
        </section>
      </div>
    </>
  );
}
