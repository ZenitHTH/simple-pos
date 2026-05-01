import { invoke } from "@/lib/api/invoke";
import { Customer, NewCustomer } from "@/lib/types";

/**
 * API wrapper for customer-related operations.
 */
export const customerApi = {
  /** Retrieves all customers from the database. */
  getAll: (key: string): Promise<Customer[]> =>
    invoke("get_customers", { key }),
  /** Creates a new customer record. */
  create: (key: string, data: NewCustomer): Promise<Customer> =>
    invoke("create_customer", {
      key,
      name: data.name,
      taxId: data.tax_id,
      address: data.address,
      branch: data.branch,
    }),
  /** Updates an existing customer record. */
  update: (key: string, id: number, data: NewCustomer): Promise<Customer> =>
    invoke("update_customer", {
      key,
      id,
      name: data.name,
      taxId: data.tax_id,
      address: data.address,
      branch: data.branch,
    }),
  /** Deletes a customer record. */
  delete: (key: string, id: number): Promise<void> =>
    invoke("delete_customer", { key, id }),
};
