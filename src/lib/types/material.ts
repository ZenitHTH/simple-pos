export interface Material {
  id: number;
  name: string;
  type_: string;
  volume: number;
  quantity: number;
  precision: number;
  tags: string[];
}

export interface MaterialFormData {
  name: string;
  type_: string;
  volume: number;
  quantity: number;
  tags: string[];
}
