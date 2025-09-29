"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import api from "@/lib/api";
import { use, useEffect, useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { BulkPermissionForm } from "../_components/bulk-permission-form";
import { PermissionAssignmentForm } from "../_components/permission-assignment-form";
import { ArrowLeft, Search, Plus, Settings, Shield, Key, Calendar, Clock, Unlink, Filter, ChevronRight } from "lucide-react";
import RolePermissionsSkeleton from "./_components/skeleton";

export default function RolePermissionsPage({ params }) {
    const { "role-id": roleId } = use(params);
    const [isLoading, setIsLoading] = useState(true);
    const [role, setRole] = useState(null);
    const [permissions, setPermissions] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    const loadRoleWithPermissions = async () => {
        try {
            setIsLoading(true);
            const res = await api.get(`/roles/${roleId}`);
            const data = res?.data?.data ?? null;
            setRole(data);
            setPermissions(data?.permissions ?? []);
        } catch (error) {
            toast.error("Failed to load role permissions");
            console.error(`GET /roles/${roleId} failed`, error);
            setRole(null);
            setPermissions([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        let isMounted = true;
        async function load() {
            if (roleId && isMounted) {
                await loadRoleWithPermissions();
            }
        }
        load();
        return () => {
            isMounted = false;
        };
    }, [roleId]);

    const handlePermissionsUpdated = () => {
        loadRoleWithPermissions();
    };

    const handlePermissionDetached = async (permissionId) => {
        try {
            await api.delete(`/roles/${roleId}/permissions/${permissionId}`);
            toast.success("Permission detached successfully");
            loadRoleWithPermissions();
        } catch (error) {
            console.error("Error detaching permission:", error);
            const errorMessage = error.response?.data?.message || "Failed to detach permission";
            toast.error(errorMessage);
        }
    };

    // Filter permissions based on search query
    const filteredPermissions = permissions.filter(permission =>
        permission.permission_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        permission.action?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Get permission icon based on permission name
    const getPermissionIcon = (permissionName) => {
        const name = permissionName?.toLowerCase() || '';
        if (name.includes('create') || name.includes('add')) return <Plus className="h-4 w-4" />;
        if (name.includes('read') || name.includes('view')) return <Search className="h-4 w-4" />;
        if (name.includes('update') || name.includes('edit')) return <Settings className="h-4 w-4" />;
        if (name.includes('delete') || name.includes('remove')) return <Unlink className="h-4 w-4" />;
        return <Key className="h-4 w-4" />;
    };

    // Get permission badge variant based on action
    const getPermissionBadgeVariant = (action) => {
        const actionName = action?.toLowerCase() || '';
        if (actionName.includes('create') || actionName.includes('add')) return 'default';
        if (actionName.includes('read') || actionName.includes('view')) return 'secondary';
        if (actionName.includes('update') || actionName.includes('edit')) return 'outline';
        if (actionName.includes('delete') || actionName.includes('remove')) return 'destructive';
        return 'outline';
    };

    // Get role icon based on role name
    const getRoleIcon = (roleName) => {
        const name = roleName?.toLowerCase() || '';
        if (name.includes('admin')) return <Shield className="h-5 w-5" />;
        if (name.includes('user') || name.includes('student')) return <Settings className="h-5 w-5" />;
        if (name.includes('staff') || name.includes('faculty')) return <Settings className="h-5 w-5" />;
        return <Shield className="h-5 w-5" />;
    };

    return (
        <div className="px-4 space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                            {getRoleIcon(role?.role_name)}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">
                                {role?.label ?? role?.role_name ?? "Role"} Permissions
                            </h1>
                            <p className="text-muted-foreground">
                                Manage permissions assigned to this role
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <BulkPermissionForm
                        onSuccess={handlePermissionsUpdated}
                        trigger={
                            <Button variant="outline" className="gap-2">
                                <Plus className="h-4 w-4" />
                                Create Permissions
                            </Button>
                        }
                    />
                    <PermissionAssignmentForm
                        roleId={roleId}
                        onSuccess={handlePermissionsUpdated}
                        trigger={
                            <Button className="gap-2">
                                <Key className="h-4 w-4" />
                                Assign Permissions
                            </Button>
                        }
                    />
                </div>
            </div>

            {/* Permissions Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Key className="h-5 w-5" />
                        Assigned Permissions to {role?.label ?? role?.role_name}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search permissions..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Filter className="h-4 w-4" />
                            {filteredPermissions.length} of {permissions.length} permissions
                        </div>
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[300px]">Permission</TableHead>
                                    <TableHead>Action</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead>Updated</TableHead>
                                    <TableHead className="w-[120px]">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? <RolePermissionsSkeleton /> : filteredPermissions.length === 0 ? (
                                    // Enhanced Empty State
                                    <TableRow>
                                        <TableCell colSpan={5} className="py-12">
                                            <div className="flex flex-col items-center justify-center text-center space-y-4">
                                                <div className="rounded-full bg-muted p-3">
                                                    <Key className="h-6 w-6 text-muted-foreground" />
                                                </div>
                                                <div className="space-y-2">
                                                    <h3 className="text-lg font-semibold">
                                                        {searchQuery ? "No permissions found" : "No permissions assigned"}
                                                    </h3>
                                                    <p className="text-muted-foreground max-w-sm">
                                                        {searchQuery
                                                            ? `No permissions match "${searchQuery}". Try adjusting your search terms.`
                                                            : "This role doesn't have any permissions assigned yet. Assign permissions to get started."
                                                        }
                                                    </p>
                                                </div>
                                                {!searchQuery && (
                                                    <PermissionAssignmentForm
                                                        roleId={roleId}
                                                        onSuccess={handlePermissionsUpdated}
                                                        trigger={
                                                            <Button className="gap-2">
                                                                <Key className="h-4 w-4" />
                                                                Assign First Permission
                                                            </Button>
                                                        }
                                                    />
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredPermissions.map((permission) => (
                                        <TableRow key={permission.id} className="group">
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center justify-center w-8 h-8 rounded-md bg-muted">
                                                        {getPermissionIcon(permission.action)}
                                                    </div>
                                                    <div className="space-y-1">
                                                        <div className="font-medium">{permission.permission_name}</div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={getPermissionBadgeVariant(permission.action)} className="text-xs">
                                                    {permission.action}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Calendar className="h-3 w-3" />
                                                    {format(new Date(permission.created_at), "MMM dd, yyyy")}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Clock className="h-3 w-3" />
                                                    {format(new Date(permission.updated_at), "MMM dd, yyyy")}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handlePermissionDetached(permission.id)}
                                                    className="gap-1"
                                                >
                                                    <Unlink className="h-3 w-3" />
                                                    Detach
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}


