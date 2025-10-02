"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function InvitationsSheet() {
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const fetchInvitations = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (status !== "all") params.status = status;

      const res = await api.get("/invitations", { params });
      setInvitations(res.data.data || []);
    } catch (err) {
      console.error("Failed to load invitations", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    try {
      await api.delete(`/invitations/${id}`);
      toast.success("Invitation revoked successfully");
      fetchInvitations();
    } catch (err) {
      console.error("Failed to revoke invitation", err);
      toast.error(err.response?.data?.message || "Failed to revoke invitation");
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchInvitations();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [search, status]);

  return (
    <Sheet onOpenChange={(open) => open && fetchInvitations()}>
      <SheetTrigger asChild>
        <Button variant="outline">View Invitations</Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:w-[600px] px-4 flex flex-col">
        <SheetHeader>
          <SheetTitle>Current Invitations</SheetTitle>
        </SheetHeader>

        {/* Filters */}
        <div className="mt-4 flex items-center gap-2">
          <Input
            placeholder="Search by email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1"
          />

          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* List */}
        <div className="my-4 flex-1 space-y-3 overflow-y-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
          {loading && (
            <p className="text-sm text-muted-foreground">Loading...</p>
          )}

          {!loading && invitations.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No invitations found.
            </p>
          )}

          {!loading &&
            invitations.map((invite) => (
              <Card key={invite.id}>
                <CardContent className="px-4 space-y-2">
                  <div>
                    <p className="font-medium">{invite.email}</p>
                    <p className="text-sm text-muted-foreground">
                      Role: {invite.role?.label || invite.role?.role_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Invited by: {invite.inviter?.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Expires at: {new Date(invite.expires_at).toLocaleString()}
                    </p>
                    <p className="text-xs">
                      <span
                        className={cn({
                          "text-green-600": invite.accepted,
                          "text-yellow-600": !invite.accepted,
                        })}
                      >
                        {invite.accepted ? "Accepted" : "Pending"}
                      </span>
                    </p>
                  </div>

                  {!invite.accepted && (
                    <div className="flex justify-end">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleCancel(invite.id)}
                      >
                        Cancel Invitation
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
