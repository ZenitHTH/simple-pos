export interface Material {
  id: number;
  name: string;
  type_: string;
  volume: number; // This is the significand (integer)
  quantity: number;
  precision: number;
}
