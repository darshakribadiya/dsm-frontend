"use client";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import api from "@/lib/api";
import { useState } from "react";
import { toast } from "sonner";

export function DeletePermissionDialog({ permission, onDeleted, trigger }) {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        setLoading(true);
        try {
            await api.delete(`/permissions/${permission.id}`);
            toast.success("Permission deleted successfully");
            onDeleted(permission.id);
        } catch (error) {
            console.error("Error deleting permission:", error);
            const errorMessage = error.response?.data?.message || "Failed to delete permission";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {trigger}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Permission</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete the permission "{permission.permission_name} - {permission.action}"?
                        This action cannot be undone and will remove the permission from all roles and users.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={loading}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        {loading ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
