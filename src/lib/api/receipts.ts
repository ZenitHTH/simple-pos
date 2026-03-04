import { invoke } from "./invoke";
import { ReceiptList, Receipt } from "../types";

export const receiptApi = {
  createInvoice: async (key: string, customerId?: number): Promise<ReceiptList> => {
    return await invoke("create_invoice", { key, customerId });
  },

  addInvoiceItem: async (
    key: string,
    receiptId: number,
    productId: number,
    quantity: number,
  ): Promise<Receipt> => {
    return await invoke("add_invoice_item", {
      key,
      receiptId: receiptId,
      productId: productId,
      quantity,
    });
  },

  getInvoiceDetail: async (
    key: string,
    receiptId: number,
  ): Promise<[ReceiptList, Receipt[]]> => {
    return await invoke("get_invoice_detail", { key, receiptId });
  },

  getInvoicesByDate: async (
    key: string,
    startDate: number,
    endDate: number,
  ): Promise<ReceiptList[]> => {
    return await invoke("get_invoices_by_date", {
      key,
      startUnix: startDate,
      endUnix: endDate,
    });
  },

  exportReceipts: async (
    key: string,
    exportPath: string,
    format: string,
    startDate: number,
    endDate: number,
    reportType: string,
  ): Promise<string> => {
    return await invoke("export_receipts", {
      key,
      exportPath,
      format,
      startDate: startDate,
      endDate: endDate,
      reportType: reportType,
    });
  },

  getAccumulatedReport: async (
    key: string,
    startDate: number,
    endDate: number,
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
      startUnix: startDate,
      endUnix: endDate,
    });
  },
};
