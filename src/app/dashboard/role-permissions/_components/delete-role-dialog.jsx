"use client";

import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import api from "@/lib/api";
import { useState } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

export function DeleteRoleDialog({ role, onDeleted }) {
    const [open, setOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

    async function handleDelete() {
        if (!role?.id) return;

        try {
            setDeleting(true);
            await api.delete(`/roles/${role.id}`);

            toast.success(`Role "${role.role_name}" deleted successfully`);
            onDeleted(role.id);
            setOpen(false);
        } catch (error) {
            console.error("Error deleting role", error);
            const message = error?.response?.data?.message || "Failed to delete role";
            toast.error(message);
        } finally {
            setDeleting(false);
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    disabled={deleting}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Role</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete the role <strong>"{role?.role_name}"</strong>?
                        This action cannot be undone and will remove all permissions associated with this role.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={deleting}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        {deleting ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
