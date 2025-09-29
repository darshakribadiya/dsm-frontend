"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import api from "@/lib/api";
import { ArrowRight, Edit, Filter, Plus, Search, Settings, Shield, Trash2, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { BulkPermissionForm } from "./_components/bulk-permission-form";
import { DeleteRoleDialog } from "./_components/delete-role-dialog";
import { RoleForm } from "./_components/role-form";

export default function Page() {
    const [roles, setRoles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const loadRoles = async () => {
        try {
            setIsLoading(true);
            const res = await api.get("/roles");
            const data = res?.data?.data ?? [];
            setRoles(Array.isArray(data) ? data : []);
        } catch (error) {
            toast.error("Failed to load roles");
            console.error("Failed to load roles", error);
            setRoles([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadRoles();
    }, []);

    const handleRoleCreated = (newRole) => {
        setRoles(prev => [...prev, newRole]);
    };

    const handleRoleUpdated = (updatedRole) => {
        setRoles(prev => prev.map(role => role.id === updatedRole.id ? updatedRole : role));
    };

    const handleRoleDeleted = (roleId) => {
        setRoles(prev => prev.filter(role => role.id !== roleId));
    };

    const handlePermissionsCreated = () => {
        // Refresh roles to show updated data
        loadRoles();
    };

    // Filter roles based on search query
    const filteredRoles = roles.filter(role =>
        role.role_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        role.label?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Get role icon based on role name
    const getRoleIcon = (roleName) => {
        const name = roleName?.toLowerCase() || '';
        if (name.includes('admin')) return <Shield className="h-4 w-4" />;
        if (name.includes('user') || name.includes('student')) return <Users className="h-4 w-4" />;
        if (name.includes('staff') || name.includes('faculty')) return <Settings className="h-4 w-4" />;
        return <Shield className="h-4 w-4" />;
    };

    // Get role badge variant based on role name
    const getRoleBadgeVariant = (roleName) => {
        const name = roleName?.toLowerCase() || '';
        if (name.includes('admin')) return 'destructive';
        if (name.includes('user') || name.includes('student')) return 'default';
        if (name.includes('staff') || name.includes('faculty')) return 'secondary';
        return 'outline';
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header Section */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Role Management</h1>
                    <p className="text-muted-foreground">
                        Manage user roles and their permissions across the system
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <BulkPermissionForm
                        onSuccess={handlePermissionsCreated}
                        trigger={
                            <Button variant="outline" className="gap-2">
                                <Settings className="h-4 w-4" />
                                Create Permissions
                            </Button>
                        }
                    />
                    <RoleForm
                        onSuccess={handleRoleCreated}
                        trigger={
                            <Button className="gap-2">
                                <Plus className="h-4 w-4" />
                                Add Role
                            </Button>
                        }
                    />
                </div>
            </div>

            {/* Search and Filter Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Roles Overview
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search roles..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Filter className="h-4 w-4" />
                            {filteredRoles.length} of {roles.length} roles
                        </div>
                    </div>

                    {/* Enhanced Table */}
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[300px]">Role</TableHead>
                                    <TableHead className="w-[200px]">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    // Enhanced Loading State
                                    Array.from({ length: 3 }).map((_, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Skeleton className="h-4 w-4 rounded" />
                                                    <Skeleton className="h-4 w-24" />
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Skeleton className="h-4 w-32" />
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Skeleton className="h-8 w-16" />
                                                    <Skeleton className="h-8 w-12" />
                                                    <Skeleton className="h-8 w-16" />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : filteredRoles.length === 0 ? (
                                    // Enhanced Empty State
                                    <TableRow>
                                        <TableCell colSpan={3} className="py-12">
                                            <div className="flex flex-col items-center justify-center text-center space-y-4">
                                                <div className="rounded-full bg-muted p-3">
                                                    <Shield className="h-6 w-6 text-muted-foreground" />
                                                </div>
                                                <div className="space-y-2">
                                                    <h3 className="text-lg font-semibold">
                                                        {searchQuery ? "No roles found" : "No roles created yet"}
                                                    </h3>
                                                    <p className="text-muted-foreground max-w-sm">
                                                        {searchQuery
                                                            ? `No roles match "${searchQuery}". Try adjusting your search terms.`
                                                            : "Get started by creating your first role to manage user permissions."
                                                        }
                                                    </p>
                                                </div>
                                                {!searchQuery && (
                                                    <RoleForm
                                                        onSuccess={handleRoleCreated}
                                                        trigger={
                                                            <Button className="gap-2">
                                                                <Plus className="h-4 w-4" />
                                                                Create First Role
                                                            </Button>
                                                        }
                                                    />
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredRoles.map((role) => (
                                        <TableRow key={role.id} className="group">
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center justify-center w-8 h-8 rounded-md bg-muted">
                                                        {getRoleIcon(role.label)}
                                                    </div>
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-medium">{role.label}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <RoleForm
                                                        role={role}
                                                        onSuccess={handleRoleUpdated}
                                                        trigger={
                                                            <Button variant="outline" size="sm" className="gap-1">
                                                                <Edit className="h-3 w-3" />
                                                                Edit
                                                            </Button>
                                                        }
                                                        title="Edit Role"
                                                    />
                                                    <DeleteRoleDialog
                                                        role={role}
                                                        onDeleted={handleRoleDeleted}
                                                        trigger={
                                                            <Button variant="destructive" size="sm" className="gap-1">
                                                                <Trash2 className="h-3 w-3" />
                                                                Delete
                                                            </Button>
                                                        }
                                                    />
                                                    <Link
                                                        href={`/dashboard/role-permissions/${role.id}`}
                                                        className="inline-flex items-center gap-1 text-sm hover:underline"
                                                    >
                                                        <ArrowRight className="size-6" />
                                                    </Link>
                                                </div>
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


