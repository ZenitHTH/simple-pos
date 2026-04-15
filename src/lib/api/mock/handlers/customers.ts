import { state } from "@/lib/api/mock/state";
import { Customer } from "@/lib/types";

export const customerHandlers = {
  get_customers: () => state.customers,
  create_customer: (customer: Omit<Customer, "id">) => {
    const newCustomer: Customer = {
      id: Math.max(0, ...state.customers.map((c) => c.id)) + 1,
      ...customer,
      branch: customer.branch || "00000",
    };
    state.customers.push(newCustomer);
    return newCustomer;
  },
  update_customer: (customer: Customer) => {
    const index = state.customers.findIndex((c) => c.id === customer.id);
    if (index !== -1) {
      state.customers[index] = {
        ...customer,
        branch: customer.branch || "00000",
      };
    }
    return state.customers[index];
  },
};
