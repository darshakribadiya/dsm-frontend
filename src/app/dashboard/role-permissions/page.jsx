"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import api from "@/lib/api";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CreateRoleSheet } from "./_components/create-role-sheet";
import { EditableRoleName } from "./_components/editable-role-name";


export default function Page() {
    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    async function fetchRolePermission() {
        try {
            setIsFetching(true);
            const [roleRes, permRes] = await Promise.all([
                api.get("/roles"),
                api.get("/permissions"),
            ]);

            setRoles(roleRes.data.data ?? roleRes.data);
            setPermissions(permRes.data.data ?? permRes.data);
        } catch (error) {
            console.error("Error fetching role-permission data", error);
        } finally {
            setIsFetching(false);
        }
    }

    async function togglePermission(role, permissionId, checked) {
        setLoading(true);
        try {
            let updatedPermissions = role.permissions.map((p) => p.id);

            if (checked) {
                if (!updatedPermissions.includes(permissionId)) {
                    updatedPermissions.push(permissionId);
                }
            } else {
                updatedPermissions = updatedPermissions.filter((id) => id !== permissionId);
            }

            const res = await api.put(`/roles/${role.id}`, {
                role_name: role.role_name,
                permission_ids: updatedPermissions,
            });

            setRoles((prev) =>
                prev.map((r) => (r.id === role.id ? res.data.data ?? res.data : r))
            );

            toast.success("Role permissions updated successfully");
        } catch (error) {
            console.error("Error updating permission", error);
            toast.error("Failed to update role permissions");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchRolePermission();
    }, []);

    return (
        <div className="p-6">
            <div className="mb-4 flex items-center justify-between gap-2">
                <h1 className="text-xl font-bold">Role Permissions</h1>
                <CreateRoleSheet
                    permissions={permissions}
                    onCreated={(newRole) => setRoles((prev) => [...prev, newRole])}
                    onPermissionCreated={(perm) => setPermissions((prev) => [...prev, perm])}
                />
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[220px]">Role</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isFetching && roles.length === 0 ? (
                        Array.from({ length: 4 }).map((_, rIdx) => (
                            <TableRow key={rIdx}>
                                <TableCell>
                                    <Skeleton className="h-5 w-40" />
                                </TableCell>
                                {Array.from({ length: Math.max(permissions.length, 4) }).map((_, cIdx) => (
                                    <TableCell key={cIdx} className="text-center">
                                        <Skeleton className="h-4 w-4 inline-block" />
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        roles.map((role) => (
                            <TableRow key={role.id}>
                                <TableCell className="font-medium">
                                    <EditableRoleName
                                        role={role}
                                        onUpdated={(updated) =>
                                            setRoles((prev) => prev.map((r) => (r.id === updated.id ? updated : r)))
                                        }
                                    />
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-wrap gap-2">
                                        {permissions.map((perm, index) => {
                                            const hasPermission = role.permissions.some((p) => p.id === perm.id);
                                            return (
                                                <Button
                                                    key={index}
                                                    size="xs"
                                                    variant={hasPermission ? "enabled" : "disabled"}
                                                    aria-pressed={hasPermission}
                                                    disabled={loading}
                                                    onClick={() => togglePermission(role, perm.id, !hasPermission)}
                                                    title={hasPermission ? "Disable permission" : "Enable permission"}
                                                >
                                                    {perm.permission_name}
                                                </Button>
                                            );
                                        })}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}


