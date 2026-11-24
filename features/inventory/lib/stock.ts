import type { InventoryItem, StockTransaction } from "../types/inventory";

export function getStock(itemId: string, transactions: StockTransaction[]): number {
  return transactions
    .filter((transaction) => transaction.itemId === itemId)
    .reduce((total, transaction) => total + transaction.deltaBase, 0);
}

export function getUnitRatio(item: InventoryItem, unit: string): number {
  if (unit === item.baseUnit) return 1;
  const packaging = item.packages.find((entry) => entry.unit === unit);
  if (!packaging) throw new Error("Satuan tidak tersedia untuk barang ini.");
  return packaging.ratio;
}

export function convertToBase(item: InventoryItem, quantity: number, unit: string): number {
  if (!Number.isFinite(quantity) || quantity <= 0) {
    throw new Error("Jumlah harus lebih besar dari nol.");
  }
  return quantity * getUnitRatio(item, unit);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("id-ID", { maximumFractionDigits: 2 }).format(value);
}

export function formatStock(item: InventoryItem, stock: number): string {
  if (!item.packages.length) return `${formatNumber(stock)} ${item.baseUnit}`;
  const packages = [...item.packages].sort((a, b) => b.ratio - a.ratio);
  const parts: string[] = [];
  let remainder = stock;

  for (const packaging of packages) {
    const count = Math.floor((remainder + Number.EPSILON) / packaging.ratio);
    if (count > 0) parts.push(`${formatNumber(count)} ${packaging.unit}`);
    remainder -= count * packaging.ratio;
  }
  if (remainder > 0 || parts.length === 0) {
    parts.push(`${formatNumber(remainder)} ${item.baseUnit}`);
  }
  return `${formatNumber(stock)} ${item.baseUnit} · ${parts.join(" + ")}`;
}

export function isLowStock(item: InventoryItem, transactions: StockTransaction[]): boolean {
  return getStock(item.id, transactions) < item.minimumStock;
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function getLocalDateString(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
