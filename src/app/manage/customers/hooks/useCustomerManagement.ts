import { useState, useEffect } from "react";
import { customerApi } from "@/lib";
import { Customer, NewCustomer } from "@/lib";
import { logger } from "@/lib/utils/logger";

import { useDatabase } from "@/context/DatabaseContext";
import { useAlert } from "@/context/AlertContext";
import { useDataCache } from "@/context/DataContext";

export function useCustomerManagement() {
    const { dbKey } = useDatabase();
    const { showAlert } = useAlert();
    const { customers, updateCache, refreshAll } = useDataCache();
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<
        Customer | undefined
    >(undefined);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCreate = () => {
        setEditingCustomer(undefined);
        setIsModalOpen(true);
    };

    const handleEdit = (customer: Customer) => {
        setEditingCustomer(customer);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!dbKey) return;
        
        const confirmed = await showAlert(
            "Confirm Delete", 
            "Are you sure you want to delete this customer? This action cannot be undone.",
        );

        if (confirmed === undefined || confirmed === false) return;

        try {
            await customerApi.delete(dbKey, id);
            updateCache.customers(customers.filter(c => c.id !== id));
        } catch (err) {
            logger.error("Failed to delete customer:", err);
            await showAlert("Delete Error", String(err));
        }
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
                updateCache.customers(customers.map(c => c.id === result.id ? result : c));
            } else {
                result = await customerApi.create(dbKey, data);
                updateCache.customers([...customers, result]);
            }

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
        handleDelete,
        handleModalSubmit,
    };
}
