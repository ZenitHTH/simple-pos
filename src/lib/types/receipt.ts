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
