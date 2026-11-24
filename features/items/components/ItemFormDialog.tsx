"use client";

import { useState } from "react";
import { Modal } from "../../../components/ui/Modal";
import type { InventoryItem, ItemCategory, NewItemInput, UnitPackage } from "../../inventory/types/inventory";

const fieldClass = "mt-1.5 w-full rounded-xl border border-[#d8e3f1] bg-white px-3.5 py-2.5 text-sm text-[#193858] outline-none transition placeholder:text-[#7b8da5] focus:border-[#1767c2] focus:ring-2 focus:ring-[#1767c2]/10";

export function ItemFormDialog({ item, categories, baseUnitLocked, onClose, onAddCategory, onSave }: { item?: InventoryItem; categories: ItemCategory[]; baseUnitLocked: boolean; onClose: () => void; onAddCategory: (name: string) => string; onSave: (input: NewItemInput) => void }) {
  const [code, setCode] = useState(item?.code ?? "");
  const [name, setName] = useState(item?.name ?? "");
  const [category, setCategory] = useState<ItemCategory>(item?.category ?? "Komoditas");
  const [baseUnit, setBaseUnit] = useState(item?.baseUnit ?? "");
  const [minimumStock, setMinimumStock] = useState(String(item?.minimumStock ?? 0));
  const [packages, setPackages] = useState<UnitPackage[]>(item?.packages ?? []);
  const [addingCategory, setAddingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [error, setError] = useState("");

  const updatePackage = (index: number, key: keyof UnitPackage, value: string) => {
    setPackages((current) => current.map((entry, position) => position === index ? { ...entry, [key]: key === "ratio" ? Number(value) : value } : entry));
  };

  const saveCategory = () => {
    try {
      const added = onAddCategory(newCategory);
      setCategory(added);
      setNewCategory("");
      setCategoryError("");
      setAddingCategory(false);
    } catch (reason) {
      setCategoryError(reason instanceof Error ? reason.message : "Kategori gagal disimpan.");
    }
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
          <label className="text-xs font-semibold text-[#38516f]">Kode barang<input required value={code} onChange={(event) => setCode(event.target.value)} placeholder="KMD-004" className={fieldClass} /></label>
          <label className="text-xs font-semibold text-[#38516f]">Kategori<div className="mt-1.5 flex gap-2"><select value={category} onChange={(event) => setCategory(event.target.value)} className={`${fieldClass} mt-0 min-w-0 flex-1`}>{categories.map((entry) => <option key={entry}>{entry}</option>)}</select><button type="button" onClick={() => { setAddingCategory((current) => !current); setCategoryError(""); }} className="shrink-0 rounded-lg border border-[#cdd9e8] px-3 text-xs font-semibold text-[#155eb5] hover:bg-[#eaf2fc]">+ Baru</button></div></label>
        </div>
        {addingCategory && <div className="rounded-lg border border-[#d8e3f1] bg-[#f3f7fc] p-3"><div className="flex flex-col gap-2 sm:flex-row"><input autoFocus maxLength={40} value={newCategory} onChange={(event) => setNewCategory(event.target.value)} placeholder="Nama kategori baru" className="min-w-0 flex-1 rounded-lg border border-[#cdd9e8] bg-white px-3 py-2.5 text-sm text-[#193858] outline-none focus:border-[#1767c2]" /><button type="button" onClick={saveCategory} className="rounded-lg bg-[#155eb5] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#124f99]">Simpan</button></div>{categoryError && <p role="alert" className="mt-2 text-xs text-[#0d2340]">{categoryError}</p>}</div>}
        <label className="block text-xs font-semibold text-[#38516f]">Nama barang<input required value={name} onChange={(event) => setName(event.target.value)} placeholder="Contoh: Tepung terigu" className={fieldClass} /></label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-xs font-semibold text-[#38516f]">Satuan dasar<input required disabled={baseUnitLocked} value={baseUnit} onChange={(event) => setBaseUnit(event.target.value)} placeholder="kg, botol, sak" className={`${fieldClass} disabled:bg-[#f0f4fa]`} /><span className="mt-1 block font-normal text-[#647892]">{baseUnitLocked ? "Tidak bisa diubah setelah ada transaksi." : "Stok selalu dihitung dalam satuan ini."}</span></label>
          <label className="text-xs font-semibold text-[#38516f]">Batas stok minimum<input type="number" min="0" step="0.01" value={minimumStock} onChange={(event) => setMinimumStock(event.target.value)} className={fieldClass} /><span className="mt-1 block font-normal text-[#647892]">Dalam {baseUnit || "satuan dasar"}.</span></label>
        </div>
        <div className="rounded-xl border border-[#d8e3f1] bg-[#f3f7fc] p-4">
          <div className="mb-3 flex items-center justify-between"><div><p className="text-xs font-semibold text-[#193858]">Satuan kemasan</p><p className="mt-1 text-xs text-[#647892]">Contoh: 1 dus = 24 botol</p></div><button type="button" onClick={() => setPackages((current) => [...current, { unit: "", ratio: 1 }])} className="text-xs font-bold text-[#1767c2] hover:text-[#124f99]">+ Tambah satuan</button></div>
          {packages.length === 0 && <p className="rounded-xl border border-dashed border-[#d8e3f1] px-3 py-4 text-center text-xs text-[#647892]">Barang ini memakai satuan dasar saja.</p>}
          <div className="space-y-2">{packages.map((entry, index) => <div key={index} className="flex items-center gap-2"><span className="text-xs text-[#647892]">1</span><input aria-label="Nama satuan kemasan" value={entry.unit} onChange={(event) => updatePackage(index, "unit", event.target.value)} placeholder="dus" className="min-w-0 flex-1 rounded-lg border border-[#d8e3f1] bg-white px-3 py-2 text-xs outline-none focus:border-[#1767c2]" /><span className="text-xs text-[#647892]">=</span><input aria-label="Jumlah satuan dasar" type="number" min="0.01" step="0.01" value={entry.ratio} onChange={(event) => updatePackage(index, "ratio", event.target.value)} className="w-24 rounded-lg border border-[#d8e3f1] bg-white px-3 py-2 text-xs outline-none focus:border-[#1767c2]" /><span className="w-16 truncate text-xs text-[#647892]">{baseUnit || "dasar"}</span><button type="button" aria-label="Hapus satuan" onClick={() => setPackages((current) => current.filter((_, position) => position !== index))} className="grid size-8 shrink-0 place-items-center rounded-lg text-lg text-[#1d5ca8] hover:bg-[#eaf2fc]">×</button></div>)}</div>
        </div>
        {error && <p role="alert" className="rounded-xl bg-[#dceaff] px-3 py-2.5 text-xs text-[#0d2340]">{error}</p>}
        <div className="flex justify-end gap-2 pt-2"><button type="button" onClick={onClose} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-[#536985] hover:bg-[#eaf2fc]">Batal</button><button type="submit" className="rounded-xl bg-[#155eb5] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#124f99]">Simpan barang</button></div>
      </form>
    </Modal>
  );
}
