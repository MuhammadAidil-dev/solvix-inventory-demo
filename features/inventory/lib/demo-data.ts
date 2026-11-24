import type { InventoryItem, ItemCategory, StockTransaction } from "../types/inventory";

export const DEFAULT_ITEM_CATEGORIES: ItemCategory[] = ["Komoditas", "Bahan bangunan", "Lainnya"];

export function createDemoData(): { items: InventoryItem[]; transactions: StockTransaction[]; categories: ItemCategory[] } {
  const now = Date.now();
  const items: InventoryItem[] = [
    { id: "item-rice", code: "KMD-001", name: "Beras premium", category: "Komoditas", baseUnit: "kg", packages: [{ unit: "karung", ratio: 25 }], minimumStock: 100, createdAt: new Date(now).toISOString() },
    { id: "item-water", code: "KMD-002", name: "Air mineral 600 ml", category: "Komoditas", baseUnit: "botol", packages: [{ unit: "dus", ratio: 24 }], minimumStock: 120, createdAt: new Date(now).toISOString() },
    { id: "item-sugar", code: "KMD-003", name: "Gula pasir", category: "Komoditas", baseUnit: "kg", packages: [{ unit: "karung", ratio: 50 }], minimumStock: 50, createdAt: new Date(now).toISOString() },
    { id: "item-cement", code: "BDG-001", name: "Semen Portland", category: "Bahan bangunan", baseUnit: "sak", packages: [{ unit: "pallet", ratio: 40 }], minimumStock: 80, createdAt: new Date(now).toISOString() },
    { id: "item-brick", code: "BDG-002", name: "Bata merah", category: "Bahan bangunan", baseUnit: "buah", packages: [{ unit: "ikat", ratio: 10 }], minimumStock: 300, createdAt: new Date(now).toISOString() },
    { id: "item-paint", code: "BDG-003", name: "Cat tembok putih", category: "Bahan bangunan", baseUnit: "kaleng", packages: [{ unit: "pacak", ratio: 4 }], minimumStock: 12, createdAt: new Date(now).toISOString() },
  ];
  const openingStocks = [250, 96, 35, 120, 480, 20];
  const transactions = items.map((item, index): StockTransaction => ({
    id: `opening-${item.id}`,
    itemId: item.id,
    kind: "initial",
    date: new Date(now - (index + 1) * 3_600_000).toISOString(),
    quantity: openingStocks[index],
    unit: item.baseUnit,
    quantityBase: openingStocks[index],
    deltaBase: openingStocks[index],
    note: "Stok awal demo",
  }));
  return { items, transactions, categories: [...DEFAULT_ITEM_CATEGORIES] };
}
