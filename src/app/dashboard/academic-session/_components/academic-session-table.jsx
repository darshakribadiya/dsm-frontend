"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Icon } from "@iconify/react";
import { format } from "date-fns";

export function AcademicSessionTable({
  sessions,
  onEdit,
  onDelete,
  loading = false,
}) {
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch (error) {
      return dateString;
    }
  };

  const getStatusBadge = (isActive) => {
    return (
      <Badge
        variant={isActive ? "default" : "secondary"}
        className={
          isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
        }
      >
        {isActive ? "Active" : "Inactive"}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">Loading academic sessions...</p>
        </div>
      </div>
    );
  }

  if (!sessions || sessions.length === 0) {
    return (
      <div className="text-center py-8">
        <Icon
          icon="mdi:calendar-blank"
          className="mx-auto h-12 w-12 text-muted-foreground mb-4"
        />
        <h3 className="text-lg font-medium text-muted-foreground mb-2">
          No Academic Sessions
        </h3>
        <p className="text-sm text-muted-foreground">
          Get started by creating your first academic session.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Session Name</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sessions.map((session) => (
            <TableRow key={session.id}>
              <TableCell className="font-medium">{session.name}</TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Icon
                    icon="mdi:calendar-blank"
                    className="size-4 text-muted-foreground"
                  />
                  <span>{formatDate(session.start_date)}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Icon
                    icon="mdi:calendar-month"
                    className="size-4 text-muted-foreground"
                  />
                  <span>{formatDate(session.end_date)}</span>
                </div>
              </TableCell>
              <TableCell>{getStatusBadge(session.is_active)}</TableCell>
              <TableCell className="text-muted-foreground">
                {formatDate(session.created_at)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(session)}
                    className="h-8 w-8 p-0"
                  >
                    <Icon icon="mdi:square-edit-outline" className="size-4" />
                    <span className="sr-only">Edit session</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(session)}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Icon icon="mdi:bin" className="size-4" />
                    <span className="sr-only">Delete session</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
