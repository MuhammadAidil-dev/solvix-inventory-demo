"use client";

import { useState } from "react";
import Link from "next/link";
import { Modal } from "../../../components/ui/Modal";
import { PageHeading } from "../../../components/ui/PageHeading";
import { TransactionTable } from "../../../features/inventory/components/TransactionTable";
import { MovementForm } from "../../../features/inventory/components/MovementForm";
import { useInventoryStore } from "../../../features/inventory/store/inventory";

export default function TransactionsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");
  const transactions = useInventoryStore((state) => state.transactions);
  const items = useInventoryStore((state) => state.items);

  return (
    <>
      <PageHeading
        eyebrow="Pergerakan stok"
        title="Transaksi"
        description="Catat barang masuk, barang keluar, atau koreksi jumlah fisik."
        action={<button type="button" onClick={() => setIsFormOpen(true)} className="w-full rounded-md bg-[#155eb5] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#124f99] sm:w-auto">+ Catat transaksi</button>}
      />
      {savedMessage && <p role="status" className="mb-4 flex items-center justify-between gap-3 rounded-md border border-[#cdd9e8] bg-[#eaf2fc] px-4 py-3 text-sm text-[#0d2340]">{savedMessage}<button type="button" onClick={() => setSavedMessage("")} className="font-semibold text-[#155eb5]">Tutup</button></p>}
      <section className="overflow-hidden rounded-xl border border-[#d8e3f1] bg-white shadow-none">
        <div className="flex items-center justify-between border-b border-[#d8e3f1] px-4 py-4 sm:px-5"><div><h2 className="text-sm font-semibold text-[#193858]">Transaksi terbaru</h2><p className="mt-1 text-xs text-[#647892]">{transactions.length} pergerakan tercatat</p></div><Link href="/history" className="text-xs font-semibold text-[#155eb5] hover:underline">Lihat semua →</Link></div>
        <TransactionTable transactions={transactions} items={items} compact />
      </section>
      {isFormOpen && <Modal title="Catat transaksi" subtitle="Pilih jenis pergerakan stok yang ingin dicatat." onClose={() => setIsFormOpen(false)}><MovementForm onSaved={(message) => { setSavedMessage(message); setIsFormOpen(false); }} /></Modal>}
    </>
  );
}
