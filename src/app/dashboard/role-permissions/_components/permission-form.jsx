"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import api from "@/lib/api";
import { useState } from "react";
import { toast } from "sonner";

export function PermissionForm({ permission = null, roleId, onSuccess, trigger, title = "Add Permission" }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        permission_name: permission?.permission_name || "",
        action: permission?.action || "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.permission_name.trim() || !formData.action.trim()) {
            toast.error("Permission name and action are required");
            return;
        }

        setLoading(true);
        try {
            const payload = {
                permission_name: formData.permission_name.trim(),
                action: formData.action.trim(),
            };

            let response;
            if (permission) {
                // Update existing permission
                response = await api.put(`/permissions/${permission.id}`, payload);
                toast.success("Permission updated successfully");
            } else {
                // Create new permission
                response = await api.post("/permissions", payload);
                toast.success("Permission created successfully");
            }

            onSuccess(response.data.data);
            setOpen(false);
            setFormData({ permission_name: "", action: "" });
        } catch (error) {
            console.error("Error saving permission:", error);
            const errorMessage = error.response?.data?.message || "Failed to save permission";
            const validationErrors = error.response?.data?.errors;

            if (validationErrors?.permission) {
                toast.error(validationErrors.permission[0]);
            } else {
                toast.error(errorMessage);
            }
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
                        {permission ? "Update the permission information below." : "Add a new permission to the system."}
                    </SheetDescription>
                </SheetHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2 px-4">
                        <Label htmlFor="permission_name">Permission Name *</Label>
                        <Input
                            id="permission_name"
                            value={formData.permission_name}
                            onChange={(e) => handleInputChange("permission_name", e.target.value)}
                            placeholder="e.g., users, roles, permissions"
                            required
                        />
                    </div>
                    <div className="space-y-2 px-4">
                        <Label htmlFor="action">Action *</Label>
                        <Input
                            id="action"
                            value={formData.action}
                            onChange={(e) => handleInputChange("action", e.target.value)}
                            placeholder="e.g., create, read, update, delete"
                            required
                        />
                    </div>
                    <SheetFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Saving..." : (permission ? "Update" : "Create")}
                        </Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    );
}
