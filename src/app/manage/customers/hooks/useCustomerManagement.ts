import { useState, useEffect } from "react";
import { customerApi } from "@/lib";
import { Customer, NewCustomer } from "@/lib";
import { logger } from "@/lib/logger";

import { useDatabase } from "@/context/DatabaseContext";
import { useAlert } from "@/context/AlertContext";

export function useCustomerManagement() {
    const { dbKey } = useDatabase();
    const { showAlert } = useAlert();
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<
        Customer | undefined
    >(undefined);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchCustomers = async () => {
        if (!dbKey) return;
        try {
            if (customers.length === 0) setLoading(true);
            const data = await customerApi.getAll(dbKey);
            setCustomers(data);
        } catch (err) {
            logger.error("Failed to fetch customers:", err);
            setError("Failed to load customers. Is the backend running?");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, [dbKey]);

    const handleCreate = () => {
        setEditingCustomer(undefined);
        setIsModalOpen(true);
    };

    const handleEdit = (customer: Customer) => {
        setEditingCustomer(customer);
        setIsModalOpen(true);
    };

    const handleModalSubmit = async (
        data: NewCustomer
    ): Promise<Customer | undefined> => {
        if (!dbKey) return;
        try {
            setIsSubmitting(true);
            let result: Customer;
            if (editingCustomer) {
                result = await customerApi.update(
                    dbKey,
                    editingCustomer.id,
                    data
                );
            } else {
                result = await customerApi.create(dbKey, data);
            }

            await fetchCustomers();
            setIsModalOpen(false);
            return result;
        } catch (err) {
            logger.error("Failed to save customer:", err);
            await showAlert("Customer Error", String(err));
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredCustomers = customers.filter((customer) => {
        return (
            customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (customer.tax_id && customer.tax_id.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (customer.address && customer.address.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    });

    return {
        customers: filteredCustomers,
        loading,
        error,
        searchQuery,
        setSearchQuery,
        isModalOpen,
        setIsModalOpen,
        editingCustomer,
        isSubmitting,
        handleCreate,
        handleEdit,
        handleModalSubmit,
    };
}
