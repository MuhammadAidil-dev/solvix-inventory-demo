"use client";

import { useState } from "react";
import { Modal } from "../../../components/ui/Modal";
import type { InventoryItem, ItemCategory, NewItemInput, UnitPackage } from "../../inventory/types/inventory";

const categories: ItemCategory[] = ["Komoditas", "Bahan bangunan", "Lainnya"];
const fieldClass = "mt-1.5 w-full rounded-xl border border-[#dce2d8] bg-white px-3.5 py-2.5 text-sm text-[#26352b] outline-none transition placeholder:text-[#a6afa7] focus:border-[#6d8a65] focus:ring-2 focus:ring-[#6d8a65]/10";

export function ItemFormDialog({ item, baseUnitLocked, onClose, onSave }: { item?: InventoryItem; baseUnitLocked: boolean; onClose: () => void; onSave: (input: NewItemInput) => void }) {
  const [code, setCode] = useState(item?.code ?? "");
  const [name, setName] = useState(item?.name ?? "");
  const [category, setCategory] = useState<ItemCategory>(item?.category ?? "Komoditas");
  const [baseUnit, setBaseUnit] = useState(item?.baseUnit ?? "");
  const [minimumStock, setMinimumStock] = useState(String(item?.minimumStock ?? 0));
  const [packages, setPackages] = useState<UnitPackage[]>(item?.packages ?? []);
  const [error, setError] = useState("");

  const updatePackage = (index: number, key: keyof UnitPackage, value: string) => {
    setPackages((current) => current.map((entry, position) => position === index ? { ...entry, [key]: key === "ratio" ? Number(value) : value } : entry));
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    try {
      onSave({ code, name, category, baseUnit, minimumStock: Number(minimumStock), packages: packages.filter((entry) => entry.unit.trim()) });
      onClose();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Barang gagal disimpan.");
    }
  };

  return (
    <Modal title={item ? "Ubah barang" : "Tambah barang"} subtitle="Gunakan satuan dasar untuk menghitung seluruh stok." onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-xs font-semibold text-[#59665c]">Kode barang<input required value={code} onChange={(event) => setCode(event.target.value)} placeholder="KMD-004" className={fieldClass} /></label>
          <label className="text-xs font-semibold text-[#59665c]">Kategori<select value={category} onChange={(event) => setCategory(event.target.value as ItemCategory)} className={fieldClass}>{categories.map((entry) => <option key={entry}>{entry}</option>)}</select></label>
        </div>
        <label className="block text-xs font-semibold text-[#59665c]">Nama barang<input required value={name} onChange={(event) => setName(event.target.value)} placeholder="Contoh: Tepung terigu" className={fieldClass} /></label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-xs font-semibold text-[#59665c]">Satuan dasar<input required disabled={baseUnitLocked} value={baseUnit} onChange={(event) => setBaseUnit(event.target.value)} placeholder="kg, botol, sak" className={`${fieldClass} disabled:bg-[#f1f3ef]`} /><span className="mt-1 block font-normal text-[#879187]">{baseUnitLocked ? "Tidak bisa diubah setelah ada transaksi." : "Stok selalu dihitung dalam satuan ini."}</span></label>
          <label className="text-xs font-semibold text-[#59665c]">Batas stok minimum<input type="number" min="0" step="0.01" value={minimumStock} onChange={(event) => setMinimumStock(event.target.value)} className={fieldClass} /><span className="mt-1 block font-normal text-[#879187]">Dalam {baseUnit || "satuan dasar"}.</span></label>
        </div>
        <div className="rounded-2xl border border-[#e4e9e1] bg-[#f5f7f3] p-4">
          <div className="mb-3 flex items-center justify-between"><div><p className="text-xs font-semibold text-[#38483d]">Satuan kemasan</p><p className="mt-1 text-[11px] text-[#859086]">Contoh: 1 dus = 24 botol</p></div><button type="button" onClick={() => setPackages((current) => [...current, { unit: "", ratio: 1 }])} className="text-xs font-bold text-[#426744] hover:text-[#233b27]">+ Tambah satuan</button></div>
          {packages.length === 0 && <p className="rounded-xl border border-dashed border-[#d7ded5] px-3 py-4 text-center text-xs text-[#909a91]">Barang ini memakai satuan dasar saja.</p>}
          <div className="space-y-2">{packages.map((entry, index) => <div key={index} className="flex items-center gap-2"><span className="text-xs text-[#839087]">1</span><input aria-label="Nama satuan kemasan" value={entry.unit} onChange={(event) => updatePackage(index, "unit", event.target.value)} placeholder="dus" className="min-w-0 flex-1 rounded-lg border border-[#dce2d8] bg-white px-3 py-2 text-xs outline-none focus:border-[#6d8a65]" /><span className="text-xs text-[#839087]">=</span><input aria-label="Jumlah satuan dasar" type="number" min="0.01" step="0.01" value={entry.ratio} onChange={(event) => updatePackage(index, "ratio", event.target.value)} className="w-24 rounded-lg border border-[#dce2d8] bg-white px-3 py-2 text-xs outline-none focus:border-[#6d8a65]" /><span className="w-16 truncate text-xs text-[#839087]">{baseUnit || "dasar"}</span><button type="button" aria-label="Hapus satuan" onClick={() => setPackages((current) => current.filter((_, position) => position !== index))} className="grid size-8 shrink-0 place-items-center rounded-lg text-lg text-[#9b655c] hover:bg-[#fbe8e5]">×</button></div>)}</div>
        </div>
        {error && <p role="alert" className="rounded-xl bg-[#fde8e4] px-3 py-2.5 text-xs text-[#a3483a]">{error}</p>}
        <div className="flex justify-end gap-2 pt-2"><button type="button" onClick={onClose} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-[#68766b] hover:bg-[#edf0eb]">Batal</button><button type="submit" className="rounded-xl bg-[#213a2e] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#2d4c3c]">Simpan barang</button></div>
      </form>
    </Modal>
  );
}
