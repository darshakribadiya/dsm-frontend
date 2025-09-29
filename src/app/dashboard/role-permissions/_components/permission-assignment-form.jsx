"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import api from "@/lib/api";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export function PermissionAssignmentForm({ roleId, onSuccess, trigger, title = "Assign Permissions" }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [allPermissions, setAllPermissions] = useState([]);
    const [rolePermissions, setRolePermissions] = useState([]);
    const [selectedPermissions, setSelectedPermissions] = useState([]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [permissionsRes, roleRes] = await Promise.all([
                api.get("/permissions"),
                api.get(`/roles/${roleId}`)
            ]);

            const permissions = permissionsRes?.data?.data ?? [];
            const role = roleRes?.data?.data ?? null;

            setAllPermissions(permissions);
            setRolePermissions(role?.permissions ?? []);
            setSelectedPermissions(role?.permissions?.map(p => p.id) ?? []);
        } catch (error) {
            toast.error("Failed to load permissions");
            console.error("Error loading data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (open && roleId) {
            loadData();
        }
    }, [open, roleId]);

    const handlePermissionToggle = (permissionId) => {
        setSelectedPermissions(prev =>
            prev.includes(permissionId)
                ? prev.filter(id => id !== permissionId)
                : [...prev, permissionId]
        );
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            await api.put(`/roles/${roleId}/permissions`, {
                permission_ids: selectedPermissions
            });
            toast.success("Permissions updated successfully");
            onSuccess();
            setOpen(false);
        } catch (error) {
            console.error("Error updating permissions:", error);
            const errorMessage = error.response?.data?.message || "Failed to update permissions";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const isPermissionAssigned = (permissionId) => {
        return rolePermissions.some(p => p.id === permissionId);
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                {trigger}
            </SheetTrigger>
            <SheetContent className="w-[600px]">
                <SheetHeader>
                    <SheetTitle>{title}</SheetTitle>
                    <SheetDescription>
                        Select which permissions should be assigned to this role.
                    </SheetDescription>
                </SheetHeader>

                <div className="py-4">
                    {loading ? (
                        <div className="text-center py-4">Loading permissions...</div>
                    ) : (
                        <div className="max-h-[400px] overflow-y-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[50px]">Assign</TableHead>
                                        <TableHead>Permission Name</TableHead>
                                        <TableHead>Action</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {allPermissions.map((permission) => (
                                        <TableRow key={permission.id}>
                                            <TableCell>
                                                <Button
                                                    variant={selectedPermissions.includes(permission.id) ? "default" : "outline"}
                                                    size="sm"
                                                    onClick={() => handlePermissionToggle(permission.id)}
                                                >
                                                    {selectedPermissions.includes(permission.id) ? "✓" : "○"}
                                                </Button>
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {permission.permission_name}
                                            </TableCell>
                                            <TableCell>{permission.action}</TableCell>
                                            <TableCell>
                                                {isPermissionAssigned(permission.id) ? (
                                                    <span className="text-green-600">Assigned</span>
                                                ) : (
                                                    <span className="text-gray-500">Not Assigned</span>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </div>

                <SheetFooter>
                    <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={loading}>
                        {loading ? "Updating..." : "Update Permissions"}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
