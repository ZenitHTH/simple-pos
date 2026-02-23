import { invoke } from "./invoke";
import { Customer, NewCustomer } from "../types";

export const customerApi = {
    getAll: (key: string): Promise<Customer[]> => invoke("get_customers", { key }),
    create: (key: string, data: NewCustomer): Promise<Customer> => invoke("create_customer", { key, ...data }),
    update: (key: string, id: number, data: NewCustomer): Promise<Customer> => invoke("update_customer", { key, id, ...data }),
};
