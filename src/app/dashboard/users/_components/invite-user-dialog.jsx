"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Mail, UserPlus } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";

// Zod schema
const inviteUserSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  roleId: z.string().min(1, "Please select a role"),
});

export default function InviteUserDialog() {
  const [open, setOpen] = useState(false);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(inviteUserSchema),
  });

  const selectedRole = watch("roleId");

  useEffect(() => {
    async function fetchRoles() {
      try {
        const res = await api.get("/roles");
        setRoles(res.data.data);
      } catch (error) {
        console.error("Failed to fetch roles", error);
        toast.error("Failed to load roles");
      }
    }
    fetchRoles();
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await api.post("/send-invitation", {
        email: data.email,
        role_id: Number(data.roleId),
      });

      toast.success(`Invitation sent to ${res.data.data.email}`);
      reset();
      setOpen(false);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to send invitation");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (open) => {
    setOpen(open);
    if (!open) {
      reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Invite User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-left">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Mail className="h-5 w-5" />
            Invite Team Member
          </DialogTitle>
          <DialogDescription>
            Send an invitation to join your team. They'll receive an email with
            setup instructions.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-2">
          {/* Email Field */}
          <div className="space-y-3">
            <Label htmlFor="email" className="text-sm font-medium">
              Email Address
            </Label>
            <div className="space-y-2">
              <Input
                label={"Label"}
                error={errors.email}
                id="email"
                type="email"
                placeholder="colleague@company.com"
                className="h-11"
                {...register("email")}
              />
            </div>
          </div>

          {/* Role Field */}
          <div className="space-y-3">
            <Label htmlFor="role" className="text-sm font-medium">
              Team Role
            </Label>
            <div className="space-y-2">
              <Select
                value={selectedRole}
                onValueChange={(value) => setValue("roleId", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={String(role.id)}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.roleId && (
                <p className="text-red-600 text-sm flex items-center gap-1">
                  {errors.roleId.message ===
                  "Invalid input: expected string, received undefined"
                    ? "Please select a role"
                    : errors.roleId.message}
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !isDirty}
              className="min-w-24"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Send Invite
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
