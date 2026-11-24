"use client";

import Link from "next/link";
import { PageHeading } from "../../../components/ui/PageHeading";
import { StatusPill } from "../../../components/ui/StatusPill";
import { TransactionTable } from "../../inventory/components/TransactionTable";
import { formatStock, getLocalDateString, getStock, isLowStock } from "../../inventory/lib/stock";
import { useInventoryStore } from "../../inventory/store/inventory";

function StatCard({ label, value, detail, marker }: { label: string; value: string; detail: string; marker: string }) {
  return <div className="rounded-2xl border border-[#e0e5dd] bg-white p-5 shadow-[0_8px_30px_rgba(35,52,39,0.035)]"><div className="flex items-start justify-between"><p className="text-xs font-semibold text-[#78847b]">{label}</p><span className="grid size-8 place-items-center rounded-xl bg-[#f0f3ed] text-sm font-bold text-[#55704f]">{marker}</span></div><p className="mt-5 text-3xl font-semibold tracking-[-0.05em] text-[#23342a]">{value}</p><p className="mt-1.5 text-[11px] text-[#929c92]">{detail}</p></div>;
}

export function DashboardOverview() {
  const items = useInventoryStore((state) => state.items);
  const transactions = useInventoryStore((state) => state.transactions);
  const lowItems = items.filter((item) => isLowStock(item, transactions));
  const today = getLocalDateString();
  const todayCount = transactions.filter((transaction) => transaction.date.slice(0, 10) === today && transaction.kind !== "initial").length;
  const dateLabel = new Intl.DateTimeFormat("id-ID", { dateStyle: "full" }).format(new Date());

  return (
    <>
      <PageHeading eyebrow={`Gudang utama · ${dateLabel}`} title="Ringkasan gudang" description="Pantau stok dan pergerakan barang di satu tempat." action={<Link href="/transactions" className="rounded-xl bg-[#213a2e] px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#2d4c3c]">+ Catat transaksi</Link>} />
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Jenis barang" value={String(items.length)} detail="Barang terdaftar di gudang" marker="▦" />
        <StatCard label="Stok menipis" value={String(lowItems.length)} detail="Di bawah batas minimum" marker="!" />
        <StatCard label="Transaksi hari ini" value={String(todayCount)} detail="Pergerakan selain stok awal" marker="↕" />
        <StatCard label="Kategori aktif" value={String(new Set(items.map((item) => item.category)).size)} detail="Komoditas dan bahan gudang" marker="◫" />
      </div>
      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <section className="overflow-hidden rounded-2xl border border-[#e0e5dd] bg-white shadow-[0_8px_30px_rgba(35,52,39,0.035)]">
          <div className="flex items-center justify-between border-b border-[#e8ece6] px-5 py-4"><div><h2 className="text-sm font-semibold text-[#344238]">Perlu diperhatikan</h2><p className="mt-1 text-[11px] text-[#8a958b]">Barang di bawah batas minimum</p></div><StatusPill tone={lowItems.length ? "warning" : "good"}>{lowItems.length ? `${lowItems.length} barang` : "Semua aman"}</StatusPill></div>
          <div className="divide-y divide-[#edf0eb]">{lowItems.slice(0, 6).map((item) => <div key={item.id} className="flex items-center justify-between gap-3 px-5 py-4"><div className="min-w-0"><p className="truncate text-xs font-semibold text-[#334137]">{item.name}</p><p className="mt-1 text-[10px] text-[#929c92]">Min. {item.minimumStock} {item.baseUnit}</p></div><div className="text-right"><p className="text-xs font-bold text-[#a45b4d]">{formatStock(item, getStock(item.id, transactions))}</p><p className="mt-1 text-[10px] text-[#9ca59b]">{item.category}</p></div></div>)}
            {!lowItems.length && <div className="px-5 py-10 text-center"><span className="mx-auto grid size-10 place-items-center rounded-full bg-[#e8f4e8] text-lg text-[#357047]">✓</span><p className="mt-3 text-xs font-semibold text-[#4c6350]">Semua stok di atas batas minimum.</p></div>}
          </div>
          {lowItems.length > 6 && <Link href="/items" className="block border-t border-[#e8ece6] px-5 py-3 text-center text-xs font-semibold text-[#47664d] hover:bg-[#fbfcf9]">Lihat semua barang →</Link>}
        </section>
        <section className="overflow-hidden rounded-2xl border border-[#e0e5dd] bg-white shadow-[0_8px_30px_rgba(35,52,39,0.035)]">
          <div className="flex items-center justify-between border-b border-[#e8ece6] px-5 py-4"><div><h2 className="text-sm font-semibold text-[#344238]">Aktivitas terbaru</h2><p className="mt-1 text-[11px] text-[#8a958b]">Catatan stok paling baru</p></div><Link href="/history" className="text-xs font-semibold text-[#47664d] hover:underline">Riwayat →</Link></div>
          <TransactionTable transactions={transactions} items={items} compact />
        </section>
      </div>
    </>
  );
}
