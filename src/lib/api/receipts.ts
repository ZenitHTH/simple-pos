import { invoke } from "@/lib/api/invoke";
import { ReceiptList, Receipt, AccumulatedReport } from "@/lib/types";

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

  addInvoiceItems: async (
    key: string,
    receiptId: number,
    items: { productId: number; quantity: number }[],
  ): Promise<void> => {
    return await invoke("add_invoice_items", {
      key,
      receiptId: Number(receiptId),
      items: items.map((i) => [Number(i.productId), Number(i.quantity)]),
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
  ): Promise<AccumulatedReport> => {
    return await invoke("get_accumulated_report", {
      key,
      startUnix: Number(startUnix),
      endUnix: Number(endUnix),
    });
  },
};
