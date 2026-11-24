import { StatusPill } from "../../../components/ui/StatusPill";
import { formatDate, formatNumber } from "../lib/stock";
import type { InventoryItem, StockTransaction } from "../types/inventory";

const kindLabel = { in: "Barang masuk", out: "Barang keluar", adjustment: "Koreksi", initial: "Stok awal" };

export function TransactionTable({ transactions, items, compact = false }: { transactions: StockTransaction[]; items: InventoryItem[]; compact?: boolean }) {
  const visible = compact ? transactions.slice(0, 7) : transactions;
  if (!visible.length) return <p className="px-5 py-12 text-center text-sm text-[#647892]">Belum ada transaksi.</p>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[680px] text-left">
        <thead className="bg-[#f3f7fc] text-xs uppercase tracking-[0.12em] text-[#647892]"><tr><th className="px-5 py-3.5 font-semibold">Barang</th><th className="px-4 py-3.5 font-semibold">Jenis</th><th className="px-4 py-3.5 font-semibold">Jumlah</th><th className="px-4 py-3.5 font-semibold">Tanggal</th><th className="px-5 py-3.5 font-semibold">Catatan</th></tr></thead>
        <tbody className="divide-y divide-[#eaf2fc]">{visible.map((transaction) => {
          const item = items.find((entry) => entry.id === transaction.itemId);
          if (!item) return null;
          const tone = transaction.kind === "in" || transaction.kind === "initial" ? "good" : transaction.kind === "out" ? "neutral" : "warning";
          const signed = transaction.deltaBase > 0 ? "+" : "−";
          const previousStock = transaction.quantityBase - transaction.deltaBase;
          const adjustmentBreakdown = transaction.unitBreakdown
            ?.filter((count) => count.quantity > 0)
            .map((count) => `${formatNumber(count.quantity)} ${count.unit}`)
            .join(" + ");
          const change = transaction.deltaBase > 0
            ? `bertambah ${formatNumber(transaction.deltaBase)} ${item.baseUnit}`
            : transaction.deltaBase < 0
              ? `berkurang ${formatNumber(Math.abs(transaction.deltaBase))} ${item.baseUnit}`
              : "tidak berubah";
          const amount = transaction.kind === "adjustment"
            ? {
                title: `Stok sebelumnya ${formatNumber(previousStock)} ${item.baseUnit} → hasil opname ${formatNumber(transaction.quantityBase)} ${item.baseUnit}`,
                detail: `Hitungan fisik: ${adjustmentBreakdown || `${formatNumber(transaction.quantityBase)} ${item.baseUnit}`} · Stok ${change}`,
              }
            : `${formatNumber(transaction.quantity)} ${transaction.unit} · ${signed}${formatNumber(Math.abs(transaction.deltaBase))} ${item.baseUnit}`;
          return <tr key={transaction.id} className="hover:bg-[#ffffff]"><td className="px-5 py-4"><p className="text-xs font-semibold text-[#193858]">{item.name}</p><p className="mt-1 text-xs text-[#647892]">{item.code}</p></td><td className="px-4 py-4"><StatusPill tone={tone}>{kindLabel[transaction.kind]}</StatusPill></td><td className="max-w-[420px] whitespace-normal px-4 py-4 text-xs text-[#155eb5]">{typeof amount === "string" ? <span className="font-semibold">{amount}</span> : <><p className="font-semibold text-[#193858]">{amount.title}</p><p className="mt-1 text-[#647892]">{amount.detail}</p></>}</td><td className="px-4 py-4 text-xs text-[#536985]">{formatDate(transaction.date)}</td><td className="max-w-[200px] truncate px-5 py-4 text-xs text-[#647892]">{transaction.note || "—"}</td></tr>;
        })}</tbody>
      </table>
    </div>
  );
}
