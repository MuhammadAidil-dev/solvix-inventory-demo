"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useInventoryStore } from "../../features/inventory/store/inventory";

const navigation = [
  { href: "/", label: "Ringkasan", icon: "overview" },
  { href: "/items", label: "Daftar barang", icon: "items" },
  { href: "/transactions", label: "Transaksi", icon: "movement" },
  { href: "/history", label: "Riwayat", icon: "history" },
];

function NavIcon({ name }: { name: string }) {
  const paths: Record<string, React.ReactNode> = {
    overview: <><rect x="3.5" y="3.5" width="7" height="7" rx="1" /><rect x="13.5" y="3.5" width="7" height="7" rx="1" /><rect x="3.5" y="13.5" width="7" height="7" rx="1" /><rect x="13.5" y="13.5" width="7" height="7" rx="1" /></>,
    items: <><path d="M4 5.5h16M4 12h16M4 18.5h16" /><circle cx="7" cy="5.5" r="1.5" fill="currentColor" stroke="none" /><circle cx="17" cy="12" r="1.5" fill="currentColor" stroke="none" /><circle cx="10" cy="18.5" r="1.5" fill="currentColor" stroke="none" /></>,
    movement: <><path d="M7 7h11M14 3l4 4-4 4M17 17H6m4-4-4 4 4 4" /></>,
    history: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7v5l3.5 2" /></>,
  };
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="size-5">{paths[name]}</svg>;
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hydrated = useInventoryStore((state) => state.hasHydrated);

  useEffect(() => {
    void useInventoryStore.persist.rehydrate();
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f8fc] lg:grid lg:grid-cols-[248px_minmax(0,1fr)]">
      <aside className="border-b border-[#dce5f1] bg-white px-5 pb-4 pt-5 lg:sticky lg:top-0 lg:h-screen lg:self-start lg:overflow-y-auto lg:overscroll-contain lg:flex lg:flex-col lg:border-b-0 lg:border-r lg:px-6 lg:py-7">
        <Link href="/" aria-label="Solvix Inventory beranda" className="inline-flex w-fit flex-col items-start gap-1">
          <Image src="/branding/top-solvix-logo.png" alt="Top Solvix Labs" width={220} height={57} priority className="h-10 w-[154px] object-contain object-left" />
          <span className="pl-1 text-xs font-bold tracking-[0.16em] text-[#0d2340]">SOLVIX INVENTORY</span>
        </Link>
        <p className="mb-3 mt-9 hidden px-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#71829b] lg:block">Menu gudang</p>
        <nav aria-label="Navigasi utama" className="mt-5 flex gap-1 overflow-x-auto lg:mt-0 lg:flex-col">
          {navigation.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined} className={`flex shrink-0 items-center gap-3 rounded-lg px-3 py-3 text-sm transition-colors ${active ? "bg-[#eaf2fc] font-semibold text-[#155eb5]" : "text-[#435672] hover:bg-[#f2f6fc] hover:text-[#102846]"}`}>
                <span className="grid size-7 place-items-center"><NavIcon name={item.icon} /></span>{item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto hidden border-t border-[#e3eaf3] pt-5 text-xs leading-5 text-[#708099] lg:block">
          <p className="font-semibold text-[#193858]">Gudang utama</p>
          <p className="mt-1">Data demo tersimpan di perangkat ini.</p>
        </div>
      </aside>
      <div className="min-w-0">
        <header className="flex min-h-[72px] items-center justify-between border-b border-[#dce5f1] bg-white px-5 sm:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#71829b]">Operasional gudang</p>
            <p className="mt-1 text-sm font-medium text-[#193858]">Gudang utama <span className="mx-1.5 text-[#a5b4c7]">/</span> Satu lokasi</p>
          </div>
          <button type="button" onClick={() => { if (window.confirm("Reset seluruh perubahan dan muat ulang data demo?")) useInventoryStore.getState().resetDemo(); }} className="rounded-lg border border-[#cdd9e8] bg-white px-3.5 py-2.5 text-sm font-semibold text-[#193858] transition-colors hover:bg-[#f2f6fc]">Reset demo</button>
        </header>
        <main id="main-content" className="mx-auto w-full max-w-[1440px] px-5 py-8 sm:px-8 sm:py-10">
          {hydrated ? children : <div className="animate-pulse rounded-xl border border-[#dce5f1] bg-white p-8 text-sm text-[#647892]">Memuat data demo…</div>}
        </main>
      </div>
    </div>
  );
}
