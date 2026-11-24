import { StatusPill } from "../../../components/ui/StatusPill";
import { formatDate, formatNumber } from "../lib/stock";
import type { InventoryItem, StockTransaction } from "../types/inventory";

const kindLabel = { in: "Barang masuk", out: "Barang keluar", adjustment: "Koreksi", initial: "Stok awal" };

export function TransactionTable({ transactions, items, compact = false }: { transactions: StockTransaction[]; items: InventoryItem[]; compact?: boolean }) {
  const visible = compact ? transactions.slice(0, 7) : transactions;
  if (!visible.length) return <p className="px-5 py-12 text-center text-sm text-[#879187]">Belum ada transaksi.</p>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[680px] text-left">
        <thead className="bg-[#f7f8f5] text-[10px] uppercase tracking-[0.12em] text-[#879187]"><tr><th className="px-5 py-3.5 font-semibold">Barang</th><th className="px-4 py-3.5 font-semibold">Jenis</th><th className="px-4 py-3.5 font-semibold">Jumlah</th><th className="px-4 py-3.5 font-semibold">Tanggal</th><th className="px-5 py-3.5 font-semibold">Catatan</th></tr></thead>
        <tbody className="divide-y divide-[#edf0eb]">{visible.map((transaction) => {
          const item = items.find((entry) => entry.id === transaction.itemId);
          if (!item) return null;
          const tone = transaction.kind === "in" || transaction.kind === "initial" ? "good" : transaction.kind === "out" ? "neutral" : "warning";
          const signed = transaction.deltaBase > 0 ? "+" : "−";
          const amount = transaction.kind === "adjustment"
            ? `${signed}${formatNumber(Math.abs(transaction.deltaBase))} ${item.baseUnit} · fisik ${formatNumber(transaction.quantity)} ${transaction.unit}`
            : `${formatNumber(transaction.quantity)} ${transaction.unit} · ${signed}${formatNumber(Math.abs(transaction.deltaBase))} ${item.baseUnit}`;
          return <tr key={transaction.id} className="hover:bg-[#fbfcf9]"><td className="px-5 py-4"><p className="text-xs font-semibold text-[#334137]">{item.name}</p><p className="mt-1 text-[10px] text-[#929c92]">{item.code}</p></td><td className="px-4 py-4"><StatusPill tone={tone}>{kindLabel[transaction.kind]}</StatusPill></td><td className={`px-4 py-4 text-xs font-semibold ${transaction.deltaBase > 0 ? "text-[#3d754d]" : transaction.deltaBase < 0 ? "text-[#a45b4d]" : "text-[#67746a]"}`}>{amount}</td><td className="px-4 py-4 text-xs text-[#67746a]">{formatDate(transaction.date)}</td><td className="max-w-[200px] truncate px-5 py-4 text-xs text-[#8a958b]">{transaction.note || "—"}</td></tr>;
        })}</tbody>
      </table>
    </div>
  );
}
