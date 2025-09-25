import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/lib/api";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";


export function EditableRoleName({ role, onUpdated }) {
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(role.role_name);
    const [saving, setSaving] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

    useEffect(() => {
        setValue(role.role_name);
    }, [role.role_name]);

    function startEditing() {
        if (saving) return;
        setIsEditing(true);
    }

    function cancelEditing() {
        setValue(role.role_name);
        setIsEditing(false);
    }

    async function save() {
        if (!value?.trim() || value.trim() === role.role_name) {
            setIsEditing(false);
            return;
        }
        try {
            setSaving(true);
            const permissionIds = (role.permissions || []).map((p) => p.id);
            const res = await api.put(`/roles/${role.id}`, {
                role_name: value.trim(),
                permission_ids: permissionIds,
            });
            const updated = res.data.data ?? res.data;
            toast.success("Role name updated");
            onUpdated(updated);
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating role name", error);
            toast.error("Failed to update role name");
        } finally {
            setSaving(false);
        }
    }

    function onKeyDown(e) {
        if (e.key === "Enter") {
            e.preventDefault();
            save();
        } else if (e.key === "Escape") {
            e.preventDefault();
            cancelEditing();
        }
    }

    if (!isEditing) {
        return (
            <div
                onDoubleClick={startEditing}
                className="inline-flex items-center gap-2 cursor-text select-none"
                title="Double click to edit"
            >
                <span>{role.role_name}</span>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2">
            <div className="min-w-0 flex-1">
                <Input
                    ref={inputRef}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={onKeyDown}
                    onBlur={save}
                    disabled={saving}
                    className={"lg:min-w-xs"}
                />
            </div>
            <Button size="sm" variant="outline" onClick={cancelEditing} disabled={saving}>Cancel</Button>
            <Button size="sm" onClick={save} disabled={saving || !value?.trim()}>Save</Button>
        </div>
    );
}