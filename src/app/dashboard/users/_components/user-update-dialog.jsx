"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api from "@/lib/api";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function UserUpdateDialog({ open, onOpenChange, userId }) {
  const [status, setStatus] = useState("active");
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [rolesList, setRolesList] = useState([]);
  const [permissionsList, setPermissionsList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && userId) {
      Promise.all([
        api.get(`/users/${userId}/roles-permissions`),
        api.get("/roles"),
        api.get("/permissions"),
      ])
        .then(([userRolesPermsRes, rolesRes, permissionsRes]) => {
          const {
            user,
            roles: userRoles,
            permissions: userPermissions,
          } = userRolesPermsRes.data;
          setStatus(user.status ?? "active");
          setRoles(userRoles.map((role) => role.name));
          const allUserPermissions = userPermissions.all || [];
          const convertedPermissions = allUserPermissions.map(
            (perm) => `${perm.name}:${perm.action}`
          );
          setPermissions(convertedPermissions);
          setRolesList(rolesRes.data.data || []);
          setPermissionsList(permissionsRes.data.data || []);
        })
        .catch((err) => {
          console.error("Error fetching data:", err);
          toast.error("Failed to load user data");
        });
    }
  }, [open, userId]);

  const handleUpdate = async () => {
    if (!userId) {
      toast.error("User ID missing!");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        status,
        roles: roles
          .map((roleName) => {
            const role = rolesList.find((r) => r.role_name === roleName);
            return role ? role.id : null;
          })
          .filter((id) => id !== null),
        permissions: permissions
          .map((permKey) => {
            const [permissionName, action] = permKey.split(":");
            const permission = permissionsList.find(
              (p) => p.permission_name === permissionName && p.action === action
            );
            return permission ? permission.id : null;
          })
          .filter((id) => id !== null),
      };

      const res = await api.patch(`/users/${userId}/update`, payload);

      if (res.status === 200) {
        toast.success("User updated successfully");
        onOpenChange(false);
      } else {
        toast.error("Update failed");
      }
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update User Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 flex flex-col items-end">
          <div className="w-full">
            <label className="text-sm font-medium">Status</label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-full">
            <label className="text-sm font-medium">Roles</label>
            <div className="border rounded-md p-3 mt-1 max-h-32 overflow-y-auto space-y-2">
              {rolesList.map((r) => {
                const isChecked = roles.includes(r.role_name);
                return (
                  <label
                    key={r.id}
                    className="flex items-center space-x-2 text-sm cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      className="accent-primary"
                      checked={isChecked}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setRoles((prev) => [...prev, r.role_name]);
                        } else {
                          setRoles((prev) =>
                            prev.filter((val) => val !== r.role_name)
                          );
                        }
                      }}
                    />
                    <span>{r.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="w-full">
            <label className="text-sm font-medium">Permissions</label>
            <div className="border rounded-md p-3 mt-1 max-h-64 overflow-y-auto space-y-3">
              {Object.entries(
                permissionsList.reduce((acc, p) => {
                  if (!acc[p.permission_name]) acc[p.permission_name] = [];
                  acc[p.permission_name].push(p);
                  return acc;
                }, {})
              ).map(([module, perms]) => (
                <div key={module}>
                  <h4 className="text-sm font-semibold mb-1 capitalize">
                    {module}
                  </h4>
                  <div className="grid grid-cols-2 gap-2 pl-2">
                    {perms.map((p) => {
                      const permKey = `${p.permission_name}:${p.action}`;
                      const isChecked = permissions.includes(permKey);
                      return (
                        <label
                          key={p.id}
                          className="flex items-center space-x-2 text-sm cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            className="accent-primary"
                            checked={isChecked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setPermissions((prev) => [...prev, permKey]);
                              } else {
                                setPermissions((prev) =>
                                  prev.filter((val) => val !== permKey)
                                );
                              }
                            }}
                          />
                          <span className="capitalize">{p.action}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Button onClick={handleUpdate} disabled={loading} className="w-max">
            {loading ? "Updating..." : "Update"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
