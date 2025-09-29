"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import api from "@/lib/api";
import { useState } from "react";
import { toast } from "sonner";

export function BulkPermissionForm({ onSuccess, trigger, title = "Create Permissions" }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        permission_name: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.permission_name.trim()) {
            toast.error("Permission name is required");
            return;
        }

        setLoading(true);
        try {
            const payload = {
                permission_name: formData.permission_name.trim(),
                actions: ["create", "read", "update", "delete"],
            };

            const response = await api.post("/permissions/bulk", payload);
            toast.success("Permissions created successfully");
            onSuccess(response.data.data);
            setOpen(false);
            setFormData({ permission_name: "" });
        } catch (error) {
            console.error("Error creating permissions:", error);
            const errorMessage = error.response?.data?.message || "Failed to create permissions";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                {trigger}
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>{title}</SheetTitle>
                    <SheetDescription>
                        Create CRUD permissions (Create, Read, Update, Delete) for a resource.
                    </SheetDescription>
                </SheetHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2 px-4">
                        <Label htmlFor="permission_name">Resource Name *</Label>
                        <Input
                            id="permission_name"
                            value={formData.permission_name}
                            onChange={(e) => handleInputChange("permission_name", e.target.value)}
                            placeholder="e.g., users, roles, permissions"
                            required
                        />
                        <p className="text-sm text-gray-500">
                            This will create 4 permissions: {formData.permission_name || "resource"}-create, {formData.permission_name || "resource"}-read, {formData.permission_name || "resource"}-update, {formData.permission_name || "resource"}-delete
                        </p>
                    </div>
                    <SheetFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Creating..." : "Create Permissions"}
                        </Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    );
}
