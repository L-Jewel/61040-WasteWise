export enum AccessLevel {
  None,
  Organization,
  Admin,
}

export enum MaterialType {
  Recyclable,
  Compostable,
  SolidWaste,
  Donatable,
}

export enum BinType {
  Compost,
  Recycling,
  Trash,
  Donation,
}

export enum BinStatus {
  Full,
  NotFull,
}

export type Coordinate = { x: number; y: number };
