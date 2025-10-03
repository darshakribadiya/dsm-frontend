"use client";

import { useState, useEffect } from "react";
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
import { toast } from "sonner";

export function UserStatusDialog({ open, onOpenChange, userId }) {
  const [status, setStatus] = useState("active");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && userId) {
      api.get(`/users/${userId}`).then((res) => {
        setStatus(res.data.status ?? "active");
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
      const res = await api.patch(`/users/${userId}/status`, { status });

      if (res.status === 200) {
        toast.success(`Status updated to ${status}`);
        onOpenChange(false);
      } else {
        toast.error("Status update failed!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update User Status</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 flex flex-col items-end">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className={"w-full"}>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={handleUpdate} disabled={loading} className="w-max">
            {loading ? "Updating..." : "Update"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
