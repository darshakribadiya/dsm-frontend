"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import api from "@/lib/api";
import { useState } from "react";
import { toast } from "sonner";

export function RoleForm({ role = null, onSuccess, trigger, title = "Add Role" }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        role_name: role?.role_name || "",
        label: role?.label || "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.role_name.trim()) {
            toast.error("Role name is required");
            return;
        }

        setLoading(true);
        try {
            const payload = {
                role_name: formData.role_name.trim(),
                label: formData.label.trim() || null,
            };

            let response;
            if (role) {
                // Update existing role
                response = await api.put(`/roles/${role.id}`, payload);
                toast.success("Role updated successfully");
            } else {
                // Create new role
                response = await api.post("/roles", payload);
                toast.success("Role created successfully");
            }

            onSuccess(response.data.data);
            setOpen(false);
            setFormData({ role_name: "", label: "" });
        } catch (error) {
            console.error("Error saving role:", error);
            const errorMessage = error.response?.data?.message || "Failed to save role";
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
                        {role ? "Update the role information below." : "Add a new role to the system."}
                    </SheetDescription>
                </SheetHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2 px-4">
                        <Label htmlFor="role_name">Role Name *</Label>
                        <Input
                            id="role_name"
                            value={formData.role_name}
                            onChange={(e) => handleInputChange("role_name", e.target.value)}
                            placeholder="e.g., faculty, student, admin"
                            required
                        />
                    </div>
                    <div className="space-y-2 px-4">
                        <Label htmlFor="label">Label</Label>
                        <Input
                            id="label"
                            value={formData.label}
                            onChange={(e) => handleInputChange("label", e.target.value)}
                            placeholder="e.g., Faculty, Student, Administrator"
                        />
                    </div>
                    <SheetFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Saving..." : (role ? "Update" : "Create")}
                        </Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    );
}
