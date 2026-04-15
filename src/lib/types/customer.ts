export interface Customer {
  id: number;
  name: string;
  tax_id: string | null;
  address: string | null;
  branch: string;
}

export interface NewCustomer {
  name: string;
  tax_id: string | null;
  address: string | null;
  branch: string | null;
}
