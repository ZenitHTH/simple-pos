import { state } from "@/lib/api/mock/state";
import { ReceiptList, Receipt } from "@/lib/types";

export const receiptHandlers = {
  create_invoice: ({ customerId }: { customerId?: number }) => {
    const newId = Math.max(0, ...state.receiptLists.map((r) => r.receipt_id)) + 1;
    const newList: ReceiptList = {
      receipt_id: newId,
      datetime_unix: Math.floor(Date.now() / 1000),
      customer_id: customerId,
    };
    state.receiptLists.push(newList);
    return newList;
  },
  add_invoice_item: ({
    receiptId,
    productId,
    quantity,
  }: {
    receiptId: number;
    productId: number;
    quantity: number;
  }) => {
    const product = state.products.find((p) => p.product_id === productId);
    const newItem: Receipt = {
      id: Math.max(0, ...state.receipts.map((r) => r.id)) + 1,
      receipt_id: receiptId,
      product_id: productId,
      quantity,
      satang_at_sale: product ? product.satang : 0,
    };
    state.receipts.push(newItem);
    return newItem;
  },
  get_invoice_detail: ({ receiptId }: { receiptId: number }) => {
    const list = state.receiptLists.find((r) => r.receipt_id === receiptId);
    const items = state.receipts.filter((r) => r.receipt_id === receiptId);
    return [list, items];
  },
  get_invoices_by_date: ({
    startUnix,
    endUnix,
  }: {
    startUnix: number;
    endUnix: number;
  }) => {
    return state.receiptLists.filter(
      (r) => r.datetime_unix >= startUnix && r.datetime_unix <= endUnix,
    );
  },
  export_receipts: () => "mock_export_path.csv",
};
