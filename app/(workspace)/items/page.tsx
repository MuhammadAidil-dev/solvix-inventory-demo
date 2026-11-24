"use client";

import { useMemo, useState } from "react";
import { PageHeading } from "../../../components/ui/PageHeading";
import { StatusPill } from "../../../components/ui/StatusPill";
import { ItemFormDialog } from "../../../features/items/components/ItemFormDialog";
import { formatStock, getStock, isLowStock } from "../../../features/inventory/lib/stock";
import { useInventoryStore } from "../../../features/inventory/store/inventory";
import type { InventoryItem, NewItemInput } from "../../../features/inventory/types/inventory";

const categories = ["Semua kategori", "Komoditas", "Bahan bangunan", "Lainnya"];

export default function ItemsPage() {
  const items = useInventoryStore((state) => state.items);
  const transactions = useInventoryStore((state) => state.transactions);
  const addItem = useInventoryStore((state) => state.addItem);
  const updateItem = useInventoryStore((state) => state.updateItem);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Semua kategori");
  const [editing, setEditing] = useState<InventoryItem | undefined>();
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  const filtered = useMemo(() => items.filter((item) => {
    const matchesText = `${item.name} ${item.code}`.toLowerCase().includes(search.toLowerCase());
    return matchesText && (category === "Semua kategori" || item.category === category);
  }), [items, search, category]);

  const save = (input: NewItemInput) => {
    try {
      if (editing) updateItem(editing.id, input); else addItem(input);
      setError("");
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : "Barang gagal disimpan.";
      setError(message);
      throw new Error(message);
    }
  };

  return (
    <>
      <PageHeading eyebrow="Master data" title="Daftar barang" description="Kelola komoditas dan bahan bangunan beserta satuan kemasannya." action={<button type="button" onClick={() => { setEditing(undefined); setShowForm(true); }} className="rounded-xl bg-[#213a2e] px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#2d4c3c]">+ Tambah barang</button>} />
      {error && <p role="alert" className="mb-4 rounded-xl bg-[#fde8e4] px-4 py-3 text-sm text-[#a3483a]">{error}<button type="button" onClick={() => setError("")} className="ml-3 font-bold">Tutup</button></p>}
      <section className="overflow-hidden rounded-2xl border border-[#e0e5dd] bg-white shadow-[0_8px_30px_rgba(35,52,39,0.035)]">
        <div className="flex flex-col gap-3 border-b border-[#e8ece6] p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <p className="text-sm font-semibold text-[#344238]">Semua barang <span className="ml-1 rounded-full bg-[#f0f3ed] px-2 py-0.5 text-xs text-[#728075]">{filtered.length}</span></p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cari nama atau kode…" className="w-full rounded-xl border border-[#dfe5dc] px-3.5 py-2.5 text-xs outline-none placeholder:text-[#a1aaa1] focus:border-[#6d8a65] sm:w-56" />
            <select value={category} onChange={(event) => setCategory(event.target.value)} className="rounded-xl border border-[#dfe5dc] bg-white px-3 py-2.5 text-xs text-[#57645a] outline-none focus:border-[#6d8a65]">{categories.map((entry) => <option key={entry}>{entry}</option>)}</select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead className="bg-[#f7f8f5] text-[10px] uppercase tracking-[0.12em] text-[#879187]"><tr><th className="px-5 py-3.5 font-semibold">Barang</th><th className="px-4 py-3.5 font-semibold">Kategori</th><th className="px-4 py-3.5 font-semibold">Stok tersedia</th><th className="px-4 py-3.5 font-semibold">Batas minimum</th><th className="px-4 py-3.5 font-semibold">Status</th><th className="px-5 py-3.5 text-right font-semibold">Aksi</th></tr></thead>
            <tbody className="divide-y divide-[#edf0eb]">{filtered.map((item) => {
              const stock = getStock(item.id, transactions);
              const low = isLowStock(item, transactions);
              return <tr key={item.id} className="hover:bg-[#fbfcf9]"><td className="px-5 py-4"><p className="text-sm font-semibold text-[#2e3c32]">{item.name}</p><p className="mt-1 text-[11px] tracking-wide text-[#929c92]">{item.code} <span className="mx-1">·</span> {item.baseUnit}</p></td><td className="px-4 py-4 text-xs text-[#67746a]">{item.category}</td><td className="px-4 py-4 text-xs font-semibold text-[#36463a]">{formatStock(item, stock)}</td><td className="px-4 py-4 text-xs text-[#67746a]">{item.minimumStock} {item.baseUnit}</td><td className="px-4 py-4"><StatusPill tone={low ? "warning" : "good"}>{low ? "Stok menipis" : "Aman"}</StatusPill></td><td className="px-5 py-4 text-right"><button type="button" onClick={() => { setEditing(item); setShowForm(true); }} className="rounded-lg px-3 py-2 text-xs font-semibold text-[#47664d] hover:bg-[#edf3e9]">Ubah</button></td></tr>;
            })}</tbody>
          </table>
          {filtered.length === 0 && <p className="px-5 py-12 text-center text-sm text-[#879187]">Tidak ada barang yang cocok.</p>}
        </div>
        <div className="flex items-center justify-between border-t border-[#e8ece6] px-5 py-3 text-[11px] text-[#8a958b]"><span>{items.length} barang terdaftar</span><span>Stok dihitung dalam satuan dasar</span></div>
      </section>
      {showForm && <ItemFormDialog item={editing} baseUnitLocked={Boolean(editing && transactions.some((transaction) => transaction.itemId === editing.id))} onClose={() => setShowForm(false)} onSave={(input) => save(input)} />}
    </>
  );
}
