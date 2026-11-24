import type { InventoryItem, StockTransaction, UnitCountSnapshot } from "../types/inventory";

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
  const breakdown = decomposeStock(item, stock);
  const packages = breakdown.filter((entry) => entry.unit !== item.baseUnit && entry.quantity > 0);
  const remainder = breakdown.find((entry) => entry.unit === item.baseUnit)?.quantity ?? 0;
  const parts = [...packages.map((entry) => `${formatNumber(entry.quantity)} ${entry.unit}`)];
  if (remainder > 0 || parts.length === 0) parts.push(`${formatNumber(remainder)} ${item.baseUnit}`);
  return `${formatNumber(stock)} ${item.baseUnit}${parts.length ? ` · ${parts.join(" + ")}` : ""}`;
}

export function decomposeStock(item: InventoryItem, stock: number): UnitCountSnapshot[] {
  if (!item.packages.length) return [{ unit: item.baseUnit, quantity: stock, ratio: 1 }];
  const packages = [...item.packages].sort((a, b) => b.ratio - a.ratio);
  const breakdown: UnitCountSnapshot[] = [];
  let remainder = stock;

  for (const packaging of packages) {
    const count = Math.floor(remainder / packaging.ratio + Number.EPSILON * 4);
    if (count > 0) breakdown.push({ unit: packaging.unit, quantity: count, ratio: packaging.ratio });
    const converted = count * packaging.ratio;
    remainder -= converted;
    const tolerance = Number.EPSILON * Math.max(1, Math.abs(remainder), Math.abs(converted)) * 4;
    if (Math.abs(remainder) <= tolerance) remainder = 0;
  }
  if (remainder > 0 || breakdown.length === 0) {
    breakdown.push({ unit: item.baseUnit, quantity: remainder, ratio: 1 });
  }
  return breakdown;
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
