"use client";

import { useState } from "react";
import { decomposeStock, formatNumber, getStock } from "../lib/stock";
import { useInventoryStore } from "../store/inventory";

type FormMovementKind = "in" | "out" | "adjustment";

const fieldClass = "mt-1.5 w-full rounded-xl border border-[#d8e3f1] bg-white px-3.5 py-2.5 text-sm text-[#193858] outline-none focus:border-[#1767c2] focus:ring-2 focus:ring-[#1767c2]/10";
const localToday = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};

export function MovementForm({ onSaved }: { onSaved?: (message: string) => void }) {
  const items = useInventoryStore((state) => state.items);
  const transactions = useInventoryStore((state) => state.transactions);
  const recordMovement = useInventoryStore((state) => state.recordMovement);
  const correctStock = useInventoryStore((state) => state.correctStock);
  const [kind, setKind] = useState<FormMovementKind>("in");
  const [itemId, setItemId] = useState(items[0]?.id ?? "");
  const [quantity, setQuantity] = useState("");
  const [physicalStock, setPhysicalStock] = useState("");
  const [unit, setUnit] = useState(items[0]?.baseUnit ?? "");
  const [date, setDate] = useState(localToday());
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const item = items.find((entry) => entry.id === itemId);
  const currentStock = item ? getStock(item.id, transactions) : 0;
  const units = item ? [item.baseUnit, ...item.packages.map((entry) => entry.unit)] : [];
  const parsedPhysicalStock = Number(physicalStock);
  const physicalStockTotal = Number.isFinite(parsedPhysicalStock) && parsedPhysicalStock >= 0 ? parsedPhysicalStock : 0;
  const packageBreakdown = item ? decomposeStock(item, physicalStockTotal) : [];
  const packageSummary = packageBreakdown
    .filter((entry) => entry.unit !== item?.baseUnit && entry.quantity > 0)
    .map((entry) => `${formatNumber(entry.quantity)} ${entry.unit}`);
  const baseRemainder = packageBreakdown.find((entry) => entry.unit === item?.baseUnit)?.quantity ?? 0;
  if (baseRemainder > 0 || packageSummary.length === 0) packageSummary.push(`${formatNumber(baseRemainder)} ${item?.baseUnit ?? ""}`.trim());

  const selectItem = (id: string) => {
    setItemId(id);
    setPhysicalStock("");
    const next = items.find((entry) => entry.id === id);
    setUnit(next?.baseUnit ?? "");
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    try {
      if (kind === "adjustment") {
        if (!physicalStock.trim()) throw new Error("Masukkan jumlah stok fisik dalam satuan dasar.");
        correctStock(itemId, physicalStockTotal, date, note);
        setSuccess("Stok fisik berhasil disesuaikan.");
      } else {
        recordMovement({ itemId, kind, quantity: Number(quantity), unit, date, note });
        setSuccess(kind === "in" ? "Barang masuk berhasil dicatat." : "Barang keluar berhasil dicatat.");
      }
      onSaved?.(kind === "adjustment" ? "Stok fisik berhasil disesuaikan." : kind === "in" ? "Barang masuk berhasil dicatat." : "Barang keluar berhasil dicatat.");
      setQuantity("");
      setPhysicalStock("");
      setNote("");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Transaksi gagal disimpan.");
    }
  };

  const tabs: { value: FormMovementKind; label: string }[] = [
    { value: "in", label: "Barang masuk" }, { value: "out", label: "Barang keluar" }, { value: "adjustment", label: "Koreksi" },
  ];

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="mb-5 flex rounded-xl bg-[#f0f4fa] p-1">{tabs.map((tab) => <button key={tab.value} type="button" onClick={() => { setKind(tab.value); setError(""); }} className={`flex-1 rounded-lg px-2 py-2.5 text-xs font-semibold transition sm:text-xs ${kind === tab.value ? "bg-white text-[#0d2340] shadow-none" : "text-[#536985] hover:text-[#193858]"}`}>{tab.label}</button>)}</div>
      <div className="space-y-4">
        <label className="block text-xs font-semibold text-[#38516f]">Pilih barang<select required value={itemId} onChange={(event) => selectItem(event.target.value)} className={fieldClass}>{items.map((entry) => <option key={entry.id} value={entry.id}>{entry.name} · {entry.code}</option>)}</select></label>
        {kind === "adjustment" ? <>
          <div className="rounded-xl bg-[#f3f7fc] px-3.5 py-3 text-xs text-[#536985]">Stok tercatat: <strong className="text-[#193858]">{formatNumber(currentStock)} {item?.baseUnit}</strong>. Masukkan jumlah fisik dalam satuan dasar.</div>
          <label className="block text-xs font-semibold text-[#38516f]">Jumlah fisik ({item?.baseUnit})<input type="number" min="0" step="0.01" value={physicalStock} onChange={(event) => setPhysicalStock(event.target.value)} placeholder="0" className={fieldClass} /></label>
          <div className="space-y-1 rounded-xl bg-[#f3f7fc] px-4 py-3" aria-live="polite"><p className="text-xs font-medium text-[#647892]">Setara satuan kemasan</p><p className="text-sm font-semibold text-[#193858]">{item?.packages.length ? packageSummary.join(" + ") : "Tidak ada satuan kemasan"}</p></div>
          <div className="rounded-xl bg-[#eaf2fc] px-4 py-3" aria-live="polite"><p className="text-xs font-medium text-[#536985]">Total fisik terhitung</p><p className="mt-1 text-lg font-bold text-[#0d2340]">{formatNumber(physicalStockTotal)} {item?.baseUnit}</p><p className="mt-1 text-xs text-[#647892]">Jumlah ini dipakai untuk penyesuaian stok.</p></div>
        </> : <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-xs font-semibold text-[#38516f]">Jumlah<input required type="number" min="0" step="0.01" value={quantity} onChange={(event) => setQuantity(event.target.value)} placeholder="0" className={fieldClass} /></label>
          <label className="text-xs font-semibold text-[#38516f]">Satuan<select value={unit} onChange={(event) => setUnit(event.target.value)} className={fieldClass}>{units.map((entry) => <option key={entry}>{entry}</option>)}</select></label>
        </div>}
        <label className="block text-xs font-semibold text-[#38516f]">Tanggal<input required type="date" value={date} onChange={(event) => setDate(event.target.value)} className={fieldClass} /></label>
        <label className="block text-xs font-semibold text-[#38516f]">Catatan <span className="font-normal text-[#647892]">(opsional)</span><input value={note} onChange={(event) => setNote(event.target.value)} placeholder="Contoh: penerimaan dari pemasok" className={fieldClass} /></label>
        {error && <p role="alert" className="rounded-xl bg-[#dceaff] px-3.5 py-3 text-xs text-[#0d2340]">{error}</p>}
        {success && <p role="status" className="rounded-xl bg-[#eaf2fc] px-3.5 py-3 text-xs text-[#155eb5]">{success}</p>}
        <button type="submit" disabled={!items.length} className="w-full rounded-xl bg-[#155eb5] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#124f99] disabled:cursor-not-allowed disabled:opacity-40">Simpan transaksi</button>
      </div>
    </form>
  );
}
