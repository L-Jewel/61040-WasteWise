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

export type Coordinate = { x: number; y: number };
