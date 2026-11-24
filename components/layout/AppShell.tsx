"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useInventoryStore } from "../../features/inventory/store/inventory";

const navigation = [
  { href: "/", label: "Ringkasan", icon: "▦" },
  { href: "/items", label: "Daftar barang", icon: "◫" },
  { href: "/transactions", label: "Transaksi", icon: "↕" },
  { href: "/history", label: "Riwayat", icon: "◷" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hydrated = useInventoryStore((state) => state.hasHydrated);

  useEffect(() => {
    void useInventoryStore.persist.rehydrate();
  }, []);

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[252px_minmax(0,1fr)]">
      <aside className="border-b border-[#dce2d8] bg-[#172c24] px-5 pb-4 pt-5 text-white lg:flex lg:min-h-screen lg:flex-col lg:border-b-0 lg:px-6 lg:py-7">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-[#d1e65b] text-lg font-black text-[#172c24]">S</span>
          <span>
            <span className="block text-sm font-bold tracking-wide">SOLVIX INVENTORY</span>
            <span className="mt-0.5 block text-[10px] uppercase tracking-[0.2em] text-white/50">Warehouse system</span>
          </span>
        </Link>
        <p className="mb-3 mt-9 hidden px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40 lg:block">Workspace</p>
        <nav className="mt-5 flex gap-1 overflow-x-auto lg:mt-0 lg:flex-col">
          {navigation.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} className={`flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${active ? "bg-white/10 font-semibold text-white" : "text-white/60 hover:bg-white/5 hover:text-white"}`}>
                <span className={`grid size-7 place-items-center rounded-lg text-base ${active ? "bg-[#d1e65b] text-[#172c24]" : "bg-white/5 text-white/60"}`}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto hidden rounded-2xl border border-white/10 bg-white/5 p-4 lg:block">
          <div className="flex items-center gap-2 text-xs font-semibold"><span className="size-2 rounded-full bg-[#d1e65b]" /> Gudang aktif</div>
          <p className="mt-2 text-xs leading-5 text-white/50">Seluruh pergerakan stok tersimpan di perangkat ini.</p>
        </div>
      </aside>
      <div className="min-w-0">
        <header className="flex h-[68px] items-center justify-between border-b border-[#dce2d8] bg-[#fbfcf9] px-5 sm:px-8">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7b867e]">Operasional gudang</p>
            <p className="mt-1 text-xs font-medium text-[#39483f]">Gudang utama <span className="mx-1.5 text-[#b7c0b6]">/</span> Satu lokasi</p>
          </div>
          <button type="button" onClick={() => { if (window.confirm("Reset seluruh perubahan dan muat ulang data demo?")) useInventoryStore.getState().resetDemo(); }} className="rounded-lg border border-[#dce2d8] bg-white px-3 py-2 text-xs font-semibold text-[#4b5b50] hover:border-[#aab6aa]">Reset demo</button>
        </header>
        <main className="mx-auto w-full max-w-[1440px] px-5 py-7 sm:px-8 sm:py-9">
          {hydrated ? children : <div className="animate-pulse rounded-2xl border border-[#e1e6de] bg-white p-8 text-sm text-[#7b867e]">Memuat data demo…</div>}
        </main>
      </div>
    </div>
  );
}
