export type ItemCategory = string;
export type MovementKind = "in" | "out" | "adjustment" | "initial";

export interface UnitPackage {
  unit: string;
  ratio: number;
}

export interface UnitCountSnapshot {
  unit: string;
  quantity: number;
  ratio: number;
}

export interface InventoryItem {
  id: string;
  code: string;
  name: string;
  category: ItemCategory;
  baseUnit: string;
  packages: UnitPackage[];
  minimumStock: number;
  createdAt: string;
}

export interface StockTransaction {
  id: string;
  itemId: string;
  kind: MovementKind;
  date: string;
  quantity: number;
  unit: string;
  quantityBase: number;
  deltaBase: number;
  note: string;
  unitBreakdown?: UnitCountSnapshot[];
}

export interface NewItemInput {
  code: string;
  name: string;
  category: ItemCategory;
  baseUnit: string;
  packages: UnitPackage[];
  minimumStock: number;
}

export interface MovementInput {
  itemId: string;
  kind: "in" | "out";
  quantity: number;
  unit: string;
  date: string;
  note: string;
}
