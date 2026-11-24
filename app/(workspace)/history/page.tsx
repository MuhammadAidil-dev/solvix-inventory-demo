"use client";

import { useMemo, useState } from "react";
import { PageHeading } from "../../../components/ui/PageHeading";
import { TransactionTable } from "../../../features/inventory/components/TransactionTable";
import { useInventoryStore } from "../../../features/inventory/store/inventory";

export default function HistoryPage() {
  const items = useInventoryStore((state) => state.items);
  const transactions = useInventoryStore((state) => state.transactions);
  const [itemId, setItemId] = useState("all");
  const [kind, setKind] = useState("all");
  const [search, setSearch] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const filtered = useMemo(() => transactions.filter((transaction) => {
    const item = items.find((entry) => entry.id === transaction.itemId);
    const matchesItem = itemId === "all" || transaction.itemId === itemId;
    const matchesKind = kind === "all" || transaction.kind === kind;
    const matchesSearch = `${item?.name ?? ""} ${item?.code ?? ""} ${transaction.note}`.toLowerCase().includes(search.toLowerCase());
    const date = transaction.date.slice(0, 10);
    return matchesItem && matchesKind && matchesSearch && (!from || date >= from) && (!to || date <= to);
  }), [transactions, items, itemId, kind, search, from, to]);

  return (
    <>
      <PageHeading eyebrow="Jejak pergerakan" title="Riwayat transaksi" description="Telusuri seluruh barang masuk, keluar, stok awal, dan koreksi." />
      <section className="overflow-hidden rounded-xl border border-[#d8e3f1] bg-white shadow-none">
        <div className="grid gap-2 border-b border-[#d8e3f1] p-4 sm:grid-cols-2 lg:grid-cols-5 sm:px-5">
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cari barang atau catatan…" className="rounded-xl border border-[#d8e3f1] px-3 py-2.5 text-xs outline-none placeholder:text-[#7b8da5] focus:border-[#1767c2]" />
          <select value={itemId} onChange={(event) => setItemId(event.target.value)} className="rounded-xl border border-[#d8e3f1] bg-white px-3 py-2.5 text-xs text-[#38516f] outline-none focus:border-[#1767c2]"><option value="all">Semua barang</option>{items.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select>
          <select value={kind} onChange={(event) => setKind(event.target.value)} className="rounded-xl border border-[#d8e3f1] bg-white px-3 py-2.5 text-xs text-[#38516f] outline-none focus:border-[#1767c2]"><option value="all">Semua jenis</option><option value="initial">Stok awal</option><option value="in">Barang masuk</option><option value="out">Barang keluar</option><option value="adjustment">Koreksi</option></select>
          <label className="flex items-center gap-2 rounded-xl border border-[#d8e3f1] px-3 text-xs text-[#647892]">Dari<input aria-label="Tanggal mulai" type="date" value={from} onChange={(event) => setFrom(event.target.value)} className="min-w-0 flex-1 py-2 text-xs text-[#38516f] outline-none" /></label>
          <label className="flex items-center gap-2 rounded-xl border border-[#d8e3f1] px-3 text-xs text-[#647892]">Sampai<input aria-label="Tanggal akhir" type="date" value={to} onChange={(event) => setTo(event.target.value)} className="min-w-0 flex-1 py-2 text-xs text-[#38516f] outline-none" /></label>
        </div>
        <div className="flex items-center justify-between px-5 py-3"><p className="text-xs font-semibold text-[#193858]">{filtered.length} transaksi ditemukan</p><button type="button" onClick={() => { setItemId("all"); setKind("all"); setSearch(""); setFrom(""); setTo(""); }} className="text-xs font-semibold text-[#536985] hover:text-[#155eb5]">Bersihkan filter</button></div>
        <TransactionTable transactions={filtered} items={items} />
      </section>
    </>
  );
}
