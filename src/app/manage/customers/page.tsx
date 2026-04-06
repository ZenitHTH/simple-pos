"use client";

import { FaPlus } from "react-icons/fa";
import { useSettings } from "@/context/SettingsContext";
import { useCustomerManagement } from "./hooks/useCustomerManagement";
import CustomerTable from "@/components/manage/CustomerTable";
import CustomerModal from "@/components/manage/CustomerModal";
import ManagementPageLayout from "@/components/layout/ManagementPageLayout";

export default function CustomersPage() {
    const { settings } = useSettings();
    const {
        customers,
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
    } = useCustomerManagement();

    return (
        <ManagementPageLayout
            title="Customer Management"
            subtitle="Manage your customers and tax information"
            headerActions={
                <button
                    onClick={handleCreate}
                    className="bg-primary shadow-primary/20 hover:bg-primary/90 flex items-center gap-2 rounded-xl px-4 py-2 text-white shadow-lg transition-all"
                >
                    <FaPlus />
                    <span>New Customer</span>
                </button>
            }
            loading={loading}
            error={error}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            scaleKey="manage_table_scale"
            modal={
                <CustomerModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleModalSubmit}
                    initialData={editingCustomer}
                    isSubmitting={isSubmitting}
                />
            }
        >
            <CustomerTable
                customers={customers}
                onEdit={handleEdit}
                settings={settings}
            />
        </ManagementPageLayout>
    );
}
