"use client";

import Link from "next/link";
import { PageHeading } from "../../../components/ui/PageHeading";
import { StatusPill } from "../../../components/ui/StatusPill";
import { TransactionTable } from "../../inventory/components/TransactionTable";
import { formatStock, getLocalDateString, getStock, isLowStock } from "../../inventory/lib/stock";
import { useInventoryStore } from "../../inventory/store/inventory";

function StatCard({ label, value, detail, marker }: { label: string; value: string; detail: string; marker: string }) {
  return <div className="rounded-xl border border-[#d8e3f1] bg-white p-5 shadow-none"><div className="flex items-start justify-between"><p className="text-xs font-semibold text-[#536985]">{label}</p><span className="grid size-8 place-items-center rounded-lg bg-[#f0f4fa] text-sm font-bold text-[#155eb5]">{marker}</span></div><p className="mt-5 text-3xl font-semibold tracking-[-0.05em] text-[#0d2340]">{value}</p><p className="mt-1.5 text-xs text-[#647892]">{detail}</p></div>;
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
      <PageHeading eyebrow={`Gudang utama · ${dateLabel}`} title="Ringkasan gudang" description="Pantau stok dan pergerakan barang di satu tempat." action={<Link href="/transactions" className="rounded-xl bg-[#155eb5] px-4 py-3 text-sm font-semibold text-white shadow-none hover:bg-[#124f99]">+ Catat transaksi</Link>} />
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Jenis barang" value={String(items.length)} detail="Barang terdaftar di gudang" marker="▦" />
        <StatCard label="Stok menipis" value={String(lowItems.length)} detail="Di bawah batas minimum" marker="!" />
        <StatCard label="Transaksi hari ini" value={String(todayCount)} detail="Pergerakan selain stok awal" marker="↕" />
        <StatCard label="Kategori aktif" value={String(new Set(items.map((item) => item.category)).size)} detail="Komoditas dan bahan gudang" marker="◫" />
      </div>
      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <section className="overflow-hidden rounded-xl border border-[#d8e3f1] bg-white shadow-none">
          <div className="flex items-center justify-between border-b border-[#d8e3f1] px-5 py-4"><div><h2 className="text-sm font-semibold text-[#193858]">Perlu diperhatikan</h2><p className="mt-1 text-xs text-[#647892]">Barang di bawah batas minimum</p></div><StatusPill tone={lowItems.length ? "warning" : "good"}>{lowItems.length ? `${lowItems.length} barang` : "Semua aman"}</StatusPill></div>
          <div className="divide-y divide-[#eaf2fc]">{lowItems.slice(0, 6).map((item) => <div key={item.id} className="flex items-center justify-between gap-3 px-5 py-4"><div className="min-w-0"><p className="truncate text-xs font-semibold text-[#193858]">{item.name}</p><p className="mt-1 text-xs text-[#647892]">Min. {item.minimumStock} {item.baseUnit}</p></div><div className="text-right"><p className="text-xs font-bold text-[#155eb5]">{formatStock(item, getStock(item.id, transactions))}</p><p className="mt-1 text-xs text-[#647892]">{item.category}</p></div></div>)}
            {!lowItems.length && <div className="px-5 py-10 text-center"><span className="mx-auto grid size-10 place-items-center rounded-full bg-[#eaf2fc] text-lg text-[#155eb5]">✓</span><p className="mt-3 text-xs font-semibold text-[#123f78]">Semua stok di atas batas minimum.</p></div>}
          </div>
          {lowItems.length > 6 && <Link href="/items" className="block border-t border-[#d8e3f1] px-5 py-3 text-center text-xs font-semibold text-[#155eb5] hover:bg-[#ffffff]">Lihat semua barang →</Link>}
        </section>
        <section className="overflow-hidden rounded-xl border border-[#d8e3f1] bg-white shadow-none">
          <div className="flex items-center justify-between border-b border-[#d8e3f1] px-5 py-4"><div><h2 className="text-sm font-semibold text-[#193858]">Aktivitas terbaru</h2><p className="mt-1 text-xs text-[#647892]">Catatan stok paling baru</p></div><Link href="/history" className="text-xs font-semibold text-[#155eb5] hover:underline">Riwayat →</Link></div>
          <TransactionTable transactions={transactions} items={items} compact />
        </section>
      </div>
    </>
  );
}
