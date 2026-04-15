import { useState, useEffect } from "react";
import { NewCustomer, Customer } from "@/lib";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface CustomerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: NewCustomer) => Promise<Customer | undefined>;
    initialData?: Customer;
    isSubmitting: boolean;
}

/**
 * CustomerModal component provides a modal dialog for creating or editing customer information.
 * It includes fields for name, tax ID, branch ID, and address.
 * 
 * @param {CustomerModalProps} props - The component props.
 * @param {boolean} props.isOpen - Whether the modal is currently open.
 * @param {() => void} props.onClose - Callback to close the modal.
 * @param {(data: NewCustomer) => Promise<Customer | undefined>} props.onSubmit - Callback to submit customer data.
 * @param {Customer} [props.initialData] - Optional initial customer data for editing.
 * @param {boolean} props.isSubmitting - Whether a submission is currently in progress.
 */
export default function CustomerModal({
    isOpen,
    onClose,
    onSubmit,
    initialData,
    isSubmitting,
}: CustomerModalProps) {
    const [formData, setFormData] = useState<NewCustomer>({
        name: "",
        tax_id: "",
        address: "",
        branch: "00000",
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                tax_id: initialData.tax_id || "",
                address: initialData.address || "",
                branch: initialData.branch || "00000",
            });
        } else {
            setFormData({ name: "", tax_id: "", address: "", branch: "00000" });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "Edit Customer" : "New Customer"}>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    onSubmit(formData);
                }}
                className="space-y-5"
            >
                <Input
                    label="Customer Name *"
                    required
                    value={formData.name}
                    onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Company or Individual Name"
                />

                <Input
                    label="Tax ID"
                    value={formData.tax_id || ""}
                    onChange={(e) =>
                        setFormData({ ...formData, tax_id: e.target.value })
                    }
                    placeholder="เลขประจำตัวผู้เสียภาษีอากร"
                />

                <Input
                    label="Branch ID (Head Office = 00000)"
                    value={formData.branch || "00000"}
                    onChange={(e) =>
                        setFormData({ ...formData, branch: e.target.value })
                    }
                    placeholder="00000"
                />

                <div className="w-full">
                    <label className="text-foreground mb-1 block text-sm font-medium">
                        Address / Branch
                    </label>
                    <textarea
                        value={formData.address || ""}
                        onChange={(e) =>
                            setFormData({ ...formData, address: e.target.value })
                        }
                        rows={3}
                        className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Head Office or Branch address"
                    />
                </div>

                <div className="mt-8 flex justify-end gap-3 p-0">
                    <Button type="button" variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Saving..." : "Save Customer"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
