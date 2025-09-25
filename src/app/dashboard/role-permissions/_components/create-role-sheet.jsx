import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import api from "@/lib/api";
import { useState } from "react";
import { toast } from "sonner";

export function CreateRoleSheet({ permissions, onCreated, onPermissionCreated }) {
    const [open, setOpen] = useState(false);
    const [roleName, setRoleName] = useState("");
    const [selected, setSelected] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [creating, setCreating] = useState({});

    const STANDARD_PERMISSIONS = ["Read", "Create", "Update", "Delete"]; // fixed CRUD badges

    function toggleSelect(id) {
        setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    }

    async function handleSubmit(e) {
        e?.preventDefault?.();
        if (!roleName.trim()) {
            toast.error("Role name is required");
            return;
        }
        try {
            setSubmitting(true);
            const res = await api.post("/roles", {
                role_name: roleName.trim(),
                permission_ids: selected,
            });
            const created = res.data.data ?? res.data;
            toast.success("Role created successfully");
            onCreated(created);
            setOpen(false);
            setRoleName("");
            setSelected([]);
        } catch (error) {
            console.error("Error creating role", error);
            const message = error?.response?.data?.message || "Failed to create role";
            toast.error(message);
        } finally {
            setSubmitting(false);
        }
    }

    async function ensurePermission(name) {
        const key = name.toLowerCase();
        const exists = (permissions || []).some(
            (p) => String(p.permission_name).toLowerCase() === key
        );
        if (exists) return; // already exists, nothing to do

        try {
            setCreating((prev) => ({ ...prev, [key]: true }));
            const res = await api.post("/permissions", { permission_name: name });
            const created = res.data.data ?? res.data;
            toast.success(`${name} permission created`);
            onPermissionCreated?.(created);
            setSelected((prev) => [...prev, created.id]);
        } catch (error) {
            console.error("Error creating permission", error);
            const message = error?.response?.data?.message || `Failed to create ${name} permission`;
            toast.error(message);
        } finally {
            setCreating((prev) => ({ ...prev, [key]: false }));
        }
    }

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="default">New Role</Button>
            </SheetTrigger>
            <SheetContent side="right" className="gap-0">
                <SheetHeader>
                    <SheetTitle>Create Role</SheetTitle>
                </SheetHeader>
                <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-4 p-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium">Role name</label>
                        <Input
                            value={roleName}
                            onChange={(e) => setRoleName(e.target.value)}
                            placeholder="Enter role name"
                            disabled={submitting}
                        />
                    </div>
                    <div>
                        <div className="mb-2 text-sm font-medium">Permissions</div>
                        <div className="flex flex-wrap gap-2">
                            {permissions.map((perm) => {
                                const isActive = selected.includes(perm.id);
                                return (
                                    <Button
                                        key={perm.id}
                                        type="button"
                                        size="sm"
                                        variant={isActive ? "default" : "outline"}
                                        onClick={() => toggleSelect(perm.id)}
                                        disabled={submitting}
                                        className={isActive ? "" : "text-muted-foreground"}
                                    >
                                        {perm.permission_name}
                                    </Button>
                                );
                            })}
                        </div>
                        <div className="mt-4">
                            <div className="mb-2 text-xs font-medium text-muted-foreground">Standard permissions</div>
                            <div className="flex flex-wrap gap-2">
                                {STANDARD_PERMISSIONS.map((label) => {
                                    const key = label.toLowerCase();
                                    const exists = (permissions || []).some(
                                        (p) => String(p.permission_name).toLowerCase() === key
                                    );
                                    const isLoading = !!creating[key];
                                    return (
                                        <Badge
                                            key={key}
                                            variant={exists ? "secondary" : "default"}
                                            className={`${exists ? "opacity-60" : "cursor-pointer"}`}
                                            aria-disabled={exists || isLoading}
                                            onClick={() => {
                                                if (exists || isLoading || submitting) return;
                                                ensurePermission(label);
                                            }}
                                            title={exists ? `${label} exists` : `Create ${label}`}
                                        >
                                            {isLoading ? `${label}...` : label}
                                        </Badge>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </form>
                <SheetFooter>
                    <div className="flex w-full items-center justify-end gap-2">
                        <Button variant="outline" onClick={() => setOpen(false)} disabled={submitting}>Cancel</Button>
                        <Button onClick={handleSubmit} disabled={submitting || !roleName.trim()}>Create</Button>
                    </div>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
