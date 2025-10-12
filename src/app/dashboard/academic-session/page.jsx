"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  deleteAcademicSession,
  getAcademicSessions,
} from "@/lib/api/academic-sessions";
import { Calendar, Plus, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AcademicSessionForm } from "./_components/academic-session-form";
import { AcademicSessionTable } from "./_components/academic-session-table";
import { DeleteConfirmationDialog } from "./_components/delete-confirmation-dialog";
import { Icon } from "@iconify/react";

export default function Page() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [sessionToDelete, setSessionToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const { data } = await getAcademicSessions();
      setSessions(data.data || []);
    } catch (error) {
      toast.error("Failed to load academic sessions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleCreateSession = () => {
    setSelectedSession(null);
    setFormOpen(true);
  };

  const handleEditSession = (session) => {
    setSelectedSession(session);
    setFormOpen(true);
  };

  const handleDeleteSession = (session) => {
    setSessionToDelete(session);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async (session) => {
    setDeleteLoading(true);
    try {
      const response = await deleteAcademicSession(session.id);
      if (response.data.status) {
        toast.success("Academic session deleted successfully");
        setDeleteDialogOpen(false);
        setSessionToDelete(null);
        await fetchSessions();
      } else {
        toast.error("Failed to delete academic session");
      }
    } catch (error) {
      console.error("Error deleting academic session:", error);
      toast.error("Failed to delete academic session");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleFormSuccess = async (sessionData) => {
    setFormOpen(false);
    setSelectedSession(null);
    await fetchSessions();
  };

  const handleRefresh = () => {
    fetchSessions();
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Academic Sessions
          </h1>
          <p className="text-muted-foreground">
            Manage academic sessions for your institution
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center space-x-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </Button>
          <Button
            onClick={handleCreateSession}
            className="flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Session</span>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Sessions
            </CardTitle>
            <Icon
              icon="mdi:calendar-month-outline"
              className="size-4 text-muted-foreground"
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sessions.length}</div>
            <p className="text-xs text-muted-foreground">
              All academic sessions
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Sessions
            </CardTitle>
            <Icon icon="mdi:calendar" className="size-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sessions.filter((s) => s.is_active).length}
            </div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Inactive Sessions
            </CardTitle>
            <Icon icon="mdi:calendar-month" className="size-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sessions.filter((s) => !s.is_active).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Not currently active
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Academic Sessions</CardTitle>
          <CardDescription>
            View and manage all academic sessions in your system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AcademicSessionTable
            sessions={sessions}
            onEdit={handleEditSession}
            onDelete={handleDeleteSession}
            loading={loading}
          />
        </CardContent>
      </Card>

      <AcademicSessionForm
        open={formOpen}
        onOpenChange={setFormOpen}
        session={selectedSession}
        onSuccess={handleFormSuccess}
      />

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        session={sessionToDelete}
        onConfirm={confirmDelete}
        loading={deleteLoading}
      />
    </div>
  );
}
