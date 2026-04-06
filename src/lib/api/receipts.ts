import { invoke } from "./invoke";
import { ReceiptList, Receipt } from "../types";

export const receiptApi = {
  createInvoice: async (
    key: string,
    customerId?: number,
  ): Promise<ReceiptList> => {
    return await invoke("create_invoice", {
      key,
      customerId: customerId ? Number(customerId) : undefined,
    });
  },

  addInvoiceItem: async (
    key: string,
    receiptId: number,
    productId: number,
    quantity: number,
  ): Promise<Receipt> => {
    return await invoke("add_invoice_item", {
      key,
      receiptId: Number(receiptId),
      productId: Number(productId),
      quantity: Number(quantity),
    });
  },

  getInvoiceDetail: async (
    key: string,
    receiptId: number,
  ): Promise<[ReceiptList, Receipt[]]> => {
    return await invoke("get_invoice_detail", { key, receiptId: Number(receiptId) });
  },

  getInvoicesByDate: async (
    key: string,
    startUnix: number,
    endUnix: number,
  ): Promise<ReceiptList[]> => {
    return await invoke("get_invoices_by_date", {
      key,
      startUnix: Number(startUnix),
      endUnix: Number(endUnix),
    });
  },

  exportReceipts: async (
    key: string,
    exportPath: string,
    format: string,
    startDate: number,
    endDate: number,
  ): Promise<string> => {
    return await invoke("export_receipts", {
      key,
      exportPath,
      format,
      startDate: Number(startDate),
      endDate: Number(endDate),
    });
  },

  getAccumulatedReport: async (
    key: string,
    startUnix: number,
    endUnix: number,
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
      startUnix: Number(startUnix),
      endUnix: Number(endUnix),
    });
  },
};
