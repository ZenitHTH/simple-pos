import { invoke } from "./invoke";
import { ReceiptList, Receipt } from "../types";

export const receiptApi = {
  createInvoice: async (
    key: string,
    customer_id?: number,
  ): Promise<ReceiptList> => {
    return await invoke("create_invoice", { key, customer_id });
  },

  addInvoiceItem: async (
    key: string,
    receipt_id: number,
    product_id: number,
    quantity: number,
  ): Promise<Receipt> => {
    return await invoke("add_invoice_item", {
      key,
      receipt_id,
      product_id,
      quantity,
    });
  },

  getInvoiceDetail: async (
    key: string,
    receipt_id: number,
  ): Promise<[ReceiptList, Receipt[]]> => {
    return await invoke("get_invoice_detail", { key, receipt_id });
  },

  getInvoicesByDate: async (
    key: string,
    start_unix: number,
    end_unix: number,
  ): Promise<ReceiptList[]> => {
    return await invoke("get_invoices_by_date", {
      key,
      start_unix,
      end_unix,
    });
  },

  exportReceipts: async (
    key: string,
    export_path: string,
    format: string,
    start_date: number,
    end_date: number,
  ): Promise<string> => {
    return await invoke("export_receipts", {
      key,
      export_path,
      format,
      start_date,
      end_date,
    });
  },

  getAccumulatedReport: async (
    key: string,
    start_unix: number,
    end_unix: number,
  ): Promise<{
    products: { product_id: number; title: string; total_quantity: number }[];
    materials: {
      material_id: number;
      name: string;
      total_volume_used: number;
      precision: number;
    }[];
  }> => {
    return await invoke("get_accumulated_report", {
      key,
      start_unix,
      end_unix,
    });
  },
};
