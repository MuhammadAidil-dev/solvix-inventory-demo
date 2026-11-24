"use client";

import { useState } from "react";
import { formatNumber, getStock } from "../lib/stock";
import { useInventoryStore } from "../store/inventory";

type FormMovementKind = "in" | "out" | "adjustment";

const fieldClass = "mt-1.5 w-full rounded-xl border border-[#dce2d8] bg-white px-3.5 py-2.5 text-sm text-[#26352b] outline-none focus:border-[#6d8a65] focus:ring-2 focus:ring-[#6d8a65]/10";
const localToday = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};

export function MovementForm() {
  const items = useInventoryStore((state) => state.items);
  const transactions = useInventoryStore((state) => state.transactions);
  const recordMovement = useInventoryStore((state) => state.recordMovement);
  const correctStock = useInventoryStore((state) => state.correctStock);
  const [kind, setKind] = useState<FormMovementKind>("in");
  const [itemId, setItemId] = useState(items[0]?.id ?? "");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState(items[0]?.baseUnit ?? "");
  const [date, setDate] = useState(localToday());
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const item = items.find((entry) => entry.id === itemId);
  const currentStock = item ? getStock(item.id, transactions) : 0;
  const units = item ? [item.baseUnit, ...item.packages.map((entry) => entry.unit)] : [];

  const selectItem = (id: string) => {
    setItemId(id);
    const next = items.find((entry) => entry.id === id);
    setUnit(next?.baseUnit ?? "");
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    try {
      if (kind === "adjustment") {
        correctStock(itemId, Number(quantity), date, note);
        setSuccess("Stok fisik berhasil disesuaikan.");
      } else {
        recordMovement({ itemId, kind, quantity: Number(quantity), unit, date, note });
        setSuccess(kind === "in" ? "Barang masuk berhasil dicatat." : "Barang keluar berhasil dicatat.");
      }
      setQuantity("");
      setNote("");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Transaksi gagal disimpan.");
    }
  };

  const tabs: { value: FormMovementKind; label: string }[] = [
    { value: "in", label: "Barang masuk" }, { value: "out", label: "Barang keluar" }, { value: "adjustment", label: "Koreksi" },
  ];

  return (
    <form onSubmit={submit} className="rounded-2xl border border-[#e0e5dd] bg-white p-5 shadow-[0_8px_30px_rgba(35,52,39,0.035)] sm:p-6">
      <div className="mb-5 flex rounded-xl bg-[#f0f3ee] p-1">{tabs.map((tab) => <button key={tab.value} type="button" onClick={() => { setKind(tab.value); setError(""); }} className={`flex-1 rounded-lg px-2 py-2.5 text-[11px] font-semibold transition sm:text-xs ${kind === tab.value ? "bg-white text-[#26382c] shadow-sm" : "text-[#7d887e] hover:text-[#35453a]"}`}>{tab.label}</button>)}</div>
      <div className="space-y-4">
        <label className="block text-xs font-semibold text-[#59665c]">Pilih barang<select required value={itemId} onChange={(event) => selectItem(event.target.value)} className={fieldClass}>{items.map((entry) => <option key={entry.id} value={entry.id}>{entry.name} · {entry.code}</option>)}</select></label>
        {kind === "adjustment" && <div className="rounded-xl bg-[#f5f7f3] px-3.5 py-3 text-xs text-[#68766b]">Stok tercatat: <strong className="text-[#334137]">{formatNumber(currentStock)} {item?.baseUnit}</strong>. Masukkan jumlah fisik hasil hitung.</div>}
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-xs font-semibold text-[#59665c]">{kind === "adjustment" ? "Stok fisik" : "Jumlah"}<input required type="number" min="0" step="0.01" value={quantity} onChange={(event) => setQuantity(event.target.value)} placeholder="0" className={fieldClass} /></label>
          {kind !== "adjustment" && <label className="text-xs font-semibold text-[#59665c]">Satuan<select value={unit} onChange={(event) => setUnit(event.target.value)} className={fieldClass}>{units.map((entry) => <option key={entry}>{entry}</option>)}</select></label>}
          <label className={`text-xs font-semibold text-[#59665c] ${kind === "adjustment" ? "" : "sm:col-span-2"}`}>Tanggal<input required type="date" value={date} onChange={(event) => setDate(event.target.value)} className={fieldClass} /></label>
        </div>
        <label className="block text-xs font-semibold text-[#59665c]">Catatan <span className="font-normal text-[#9aa39a]">(opsional)</span><input value={note} onChange={(event) => setNote(event.target.value)} placeholder="Contoh: penerimaan dari pemasok" className={fieldClass} /></label>
        {error && <p role="alert" className="rounded-xl bg-[#fde8e4] px-3.5 py-3 text-xs text-[#a3483a]">{error}</p>}
        {success && <p role="status" className="rounded-xl bg-[#e8f4e8] px-3.5 py-3 text-xs text-[#357047]">{success}</p>}
        <button type="submit" disabled={!items.length} className="w-full rounded-xl bg-[#213a2e] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#2d4c3c] disabled:cursor-not-allowed disabled:opacity-40">Simpan transaksi</button>
      </div>
    </form>
  );
}
