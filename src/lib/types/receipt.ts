export interface ReceiptList {
  receipt_id: number;
  datetime_unix: number;
  customer_id?: number;
}

export interface Receipt {
  id: number;
  receipt_id: number;
  product_id: number;
  quantity: number;
  satang_at_sale: number;
}

export interface NewReceipt {
  receipt_id: number;
  product_id: number;
  quantity: number;
  satang_at_sale: number;
}

export interface ProductAccumulation {
  product_id: number;
  title: string;
  total_quantity: number;
}

export interface MaterialAccumulation {
  material_id: number;
  name: string;
  total_volume_used: number;
  precision: number;
}

export interface AccumulatedReport {
  products: ProductAccumulation[];
  materials: MaterialAccumulation[];
}
