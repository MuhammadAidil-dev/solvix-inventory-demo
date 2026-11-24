"use client";

import { useMemo, useState } from "react";
import { PageHeading } from "../../../components/ui/PageHeading";
import { StatusPill } from "../../../components/ui/StatusPill";
import { ItemFormDialog } from "../../../features/items/components/ItemFormDialog";
import { formatStock, getStock, isLowStock } from "../../../features/inventory/lib/stock";
import { useInventoryStore } from "../../../features/inventory/store/inventory";
import type { InventoryItem, NewItemInput } from "../../../features/inventory/types/inventory";

export default function ItemsPage() {
  const items = useInventoryStore((state) => state.items);
  const transactions = useInventoryStore((state) => state.transactions);
  const categories = useInventoryStore((state) => state.categories);
  const addItem = useInventoryStore((state) => state.addItem);
  const updateItem = useInventoryStore((state) => state.updateItem);
  const addCategory = useInventoryStore((state) => state.addCategory);
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
      <PageHeading eyebrow="Master data" title="Daftar barang" description="Kelola komoditas dan bahan bangunan beserta satuan kemasannya." action={<button type="button" onClick={() => { setEditing(undefined); setShowForm(true); }} className="rounded-xl bg-[#155eb5] px-4 py-3 text-sm font-semibold text-white shadow-none hover:bg-[#124f99]">+ Tambah barang</button>} />
      {error && <p role="alert" className="mb-4 rounded-xl bg-[#dceaff] px-4 py-3 text-sm text-[#0d2340]">{error}<button type="button" onClick={() => setError("")} className="ml-3 font-bold">Tutup</button></p>}
      <section className="overflow-hidden rounded-xl border border-[#d8e3f1] bg-white shadow-none">
        <div className="flex flex-col gap-3 border-b border-[#d8e3f1] p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <p className="text-sm font-semibold text-[#193858]">Semua barang <span className="ml-1 rounded-full bg-[#f0f4fa] px-2 py-0.5 text-xs text-[#647892]">{filtered.length}</span></p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cari nama atau kode…" className="w-full rounded-xl border border-[#d8e3f1] px-3.5 py-2.5 text-xs outline-none placeholder:text-[#7b8da5] focus:border-[#1767c2] sm:w-56" />
            <select value={category} onChange={(event) => setCategory(event.target.value)} className="rounded-xl border border-[#d8e3f1] bg-white px-3 py-2.5 text-xs text-[#38516f] outline-none focus:border-[#1767c2]"><option>Semua kategori</option>{categories.map((entry) => <option key={entry}>{entry}</option>)}</select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead className="bg-[#f3f7fc] text-xs uppercase tracking-[0.12em] text-[#647892]"><tr><th className="px-5 py-3.5 font-semibold">Barang</th><th className="px-4 py-3.5 font-semibold">Kategori</th><th className="px-4 py-3.5 font-semibold">Stok tersedia</th><th className="px-4 py-3.5 font-semibold">Batas minimum</th><th className="px-4 py-3.5 font-semibold">Status</th><th className="px-5 py-3.5 text-right font-semibold">Aksi</th></tr></thead>
            <tbody className="divide-y divide-[#eaf2fc]">{filtered.map((item) => {
              const stock = getStock(item.id, transactions);
              const low = isLowStock(item, transactions);
              return <tr key={item.id} className="hover:bg-[#ffffff]"><td className="px-5 py-4"><p className="text-sm font-semibold text-[#193858]">{item.name}</p><p className="mt-1 text-xs tracking-wide text-[#647892]">{item.code} <span className="mx-1">·</span> {item.baseUnit}</p></td><td className="px-4 py-4 text-xs text-[#536985]">{item.category}</td><td className="px-4 py-4 text-xs font-semibold text-[#193858]">{formatStock(item, stock)}</td><td className="px-4 py-4 text-xs text-[#536985]">{item.minimumStock} {item.baseUnit}</td><td className="px-4 py-4"><StatusPill tone={low ? "warning" : "good"}>{low ? "Stok menipis" : "Aman"}</StatusPill></td><td className="px-5 py-4 text-right"><button type="button" onClick={() => { setEditing(item); setShowForm(true); }} className="rounded-lg px-3 py-2 text-xs font-semibold text-[#155eb5] hover:bg-[#eaf2fc]">Ubah</button></td></tr>;
            })}</tbody>
          </table>
          {filtered.length === 0 && <p className="px-5 py-12 text-center text-sm text-[#647892]">Tidak ada barang yang cocok.</p>}
        </div>
        <div className="flex items-center justify-between border-t border-[#d8e3f1] px-5 py-3 text-xs text-[#647892]"><span>{items.length} barang terdaftar</span><span>Stok dihitung dalam satuan dasar</span></div>
      </section>
      {showForm && <ItemFormDialog item={editing} categories={categories} baseUnitLocked={Boolean(editing && transactions.some((transaction) => transaction.itemId === editing.id))} onClose={() => setShowForm(false)} onAddCategory={addCategory} onSave={(input) => save(input)} />}
    </>
  );
}
