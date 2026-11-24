"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { createDemoData } from "../lib/demo-data";
import { convertToBase, getStock } from "../lib/stock";
import type { InventoryItem, MovementInput, NewItemInput, StockTransaction } from "../types/inventory";

interface InventoryState {
  items: InventoryItem[];
  transactions: StockTransaction[];
  hasHydrated: boolean;
  addItem: (input: NewItemInput) => void;
  updateItem: (id: string, input: NewItemInput) => void;
  recordMovement: (input: MovementInput) => void;
  correctStock: (itemId: string, physicalStock: number, date: string, note: string) => void;
  resetDemo: () => void;
  setHasHydrated: (value: boolean) => void;
}

const initialData = createDemoData();
const makeId = () => globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;

function validateItem(input: NewItemInput, items: InventoryItem[], excludeId?: string): void {
  if (!input.code.trim() || !input.name.trim() || !input.baseUnit.trim()) {
    throw new Error("Kode, nama, dan satuan dasar wajib diisi.");
  }
  if (!Number.isFinite(input.minimumStock) || input.minimumStock < 0) {
    throw new Error("Batas stok minimum tidak boleh negatif.");
  }
  if (items.some((item) => item.id !== excludeId && item.code.toLowerCase() === input.code.trim().toLowerCase())) {
    throw new Error("Kode barang sudah digunakan.");
  }
  const units = new Set<string>();
  for (const packaging of input.packages) {
    const unit = packaging.unit.trim().toLowerCase();
    if (!unit || unit === input.baseUnit.trim().toLowerCase() || units.has(unit)) {
      throw new Error("Satuan kemasan harus unik dan berbeda dari satuan dasar.");
    }
    if (!Number.isFinite(packaging.ratio) || packaging.ratio <= 0) {
      throw new Error("Rasio konversi harus lebih besar dari nol.");
    }
    units.add(unit);
  }
}

export const useInventoryStore = create<InventoryState>()(
  persist(
    (set, get) => ({
      ...initialData,
      hasHydrated: false,
      setHasHydrated: (value) => set({ hasHydrated: value }),
      addItem: (input) => {
        const clean = { ...input, code: input.code.trim(), name: input.name.trim(), baseUnit: input.baseUnit.trim(), packages: input.packages.map((entry) => ({ ...entry, unit: entry.unit.trim() })) };
        validateItem(clean, get().items);
        set((state) => ({ items: [...state.items, { ...clean, id: makeId(), createdAt: new Date().toISOString() }] }));
      },
      updateItem: (id, input) => {
        const current = get().items.find((item) => item.id === id);
        if (!current) throw new Error("Barang tidak ditemukan.");
        const hasTransactions = get().transactions.some((transaction) => transaction.itemId === id);
        if (hasTransactions && current.baseUnit !== input.baseUnit.trim()) {
          throw new Error("Satuan dasar tidak dapat diubah setelah ada transaksi.");
        }
        const clean = { ...input, code: input.code.trim(), name: input.name.trim(), baseUnit: input.baseUnit.trim(), packages: input.packages.map((entry) => ({ ...entry, unit: entry.unit.trim() })) };
        validateItem(clean, get().items, id);
        set((state) => ({ items: state.items.map((item) => item.id === id ? { ...item, ...clean } : item) }));
      },
      recordMovement: (input) => {
        const item = get().items.find((entry) => entry.id === input.itemId);
        if (!item) throw new Error("Pilih barang yang tersedia.");
        const quantityBase = convertToBase(item, input.quantity, input.unit);
        const deltaBase = input.kind === "in" ? quantityBase : -quantityBase;
        if (input.kind === "out" && getStock(item.id, get().transactions) < quantityBase) {
          throw new Error("Stok tidak cukup untuk barang keluar.");
        }
        const transaction: StockTransaction = { ...input, id: makeId(), quantityBase, deltaBase, note: input.note.trim() };
        set((state) => ({ transactions: [transaction, ...state.transactions] }));
      },
      correctStock: (itemId, physicalStock, date, note) => {
        const item = get().items.find((entry) => entry.id === itemId);
        if (!item) throw new Error("Pilih barang yang tersedia.");
        if (!Number.isFinite(physicalStock) || physicalStock < 0) throw new Error("Stok fisik tidak boleh negatif.");
        const currentStock = getStock(itemId, get().transactions);
        const deltaBase = physicalStock - currentStock;
        if (deltaBase === 0) throw new Error("Stok fisik sama dengan stok tercatat.");
        const transaction: StockTransaction = {
          id: makeId(), itemId, kind: "adjustment", date, quantity: physicalStock,
          unit: item.baseUnit, quantityBase: physicalStock, deltaBase, note: note.trim(),
        };
        set((state) => ({ transactions: [transaction, ...state.transactions] }));
      },
      resetDemo: () => set({ ...createDemoData() }),
    }),
    {
      name: "inventory-demo-v1",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (state) => ({ items: state.items, transactions: state.transactions }) as InventoryState,
      onRehydrateStorage: () => (state) => state?.setHasHydrated(true),
    },
  ),
);
