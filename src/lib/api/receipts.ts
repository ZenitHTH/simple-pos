import { invoke } from "@/lib/api/invoke";
import { ReceiptList, Receipt, AccumulatedReport } from "@/lib/types";

/**
 * API wrapper for receipt and transaction operations.
 */
export const receiptApi = {
  /** Creates a new invoice/receipt header. */
  createInvoice: async (
    key: string,
    customerId?: number,
  ): Promise<ReceiptList> => {
    return await invoke("create_invoice", {
      key,
      customerId: customerId ? Number(customerId) : undefined,
    });
  },

  /** Adds items to an existing invoice in bulk. */
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

  /** Creates a new invoice, adds items, and deducts stock in a single atomic operation. */
  completeCheckout: async (
    key: string,
    data: {
      customerId?: number;
      items: { productId: number; quantity: number }[];
    },
  ): Promise<ReceiptList> => {
    return await invoke("complete_checkout", {
      key,
      customerId: data.customerId ? Number(data.customerId) : undefined,
      items: data.items.map((i) => [Number(i.productId), Number(i.quantity)]),
    });
  },

  /** Retrieves full details for a specific invoice, including its items. */
  getInvoiceDetail: async (
    key: string,
    receiptId: number,
  ): Promise<[ReceiptList, Receipt[]]> => {
    return await invoke("get_invoice_detail", { key, receiptId: Number(receiptId) });
  },

  /** Retrieves all invoices within a specified date range. */
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

  /** Exports receipt data to a file in the specified format. */
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

  /** Generates an accumulated sales report for a specified date range. */
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

// Expose globally for E2E testing
if (typeof window !== 'undefined') {
  (window as any).receiptApi = receiptApi;
}
