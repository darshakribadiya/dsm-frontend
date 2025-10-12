"use client";

import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  createAcademicSession,
  updateAcademicSession,
} from "@/lib/api/academic-sessions";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const academicSessionSchema = z
  .object({
    name: z
      .string()
      .min(1, "Session name is required")
      .regex(/^\d{4}-\d{2}$/, "Session format must be YYYY-YY"),
    start_date: z.date({
      required_error: "Start date is required",
    }),
    end_date: z.date({
      required_error: "End date is required",
    }),
    is_active: z.boolean({
      required_error: "Session status is required",
    }),
  })
  .refine(
    (data) => {
      if (data.start_date && data.end_date) {
        return data.end_date >= data.start_date;
      }
      return true;
    },
    {
      message: "End date must be after or equal to start date",
      path: ["end_date"],
    }
  );

export function AcademicSessionForm({
  open,
  onOpenChange,
  session,
  onSuccess,
}) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(academicSessionSchema),
    defaultValues: {
      name: "",
      start_date: undefined,
      end_date: undefined,
      is_active: true,
    },
  });

  useEffect(() => {
    if (open) {
      if (session) {
        reset({
          name: session.name || "",
          start_date: session.start_date
            ? new Date(session.start_date)
            : undefined,
          end_date: session.end_date ? new Date(session.end_date) : undefined,
          is_active: session.is_active === 1 ? true : false,
        });
      } else {
        reset({
          name: "",
          start_date: undefined,
          end_date: undefined,
          is_active: true,
        });
      }
    }
  }, [open, session, reset]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = {
        name: data.name,
        start_date: format(data.start_date, "yyyy-MM-dd"),
        end_date: format(data.end_date, "yyyy-MM-dd"),
        is_active: data.is_active,
      };

      let response;
      if (session) {
        response = await updateAcademicSession(session.id, payload);
        toast.success("Academic session updated successfully");
      } else {
        response = await createAcademicSession(payload);
        toast.success(response.data.message);
      }

      onSuccess(response.data.data);
      reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving academic session:", error);

      if (error.response?.data?.errors) {
        toast.error(error.response.data.errors);
      } else {
        const errorMessage =
          error.response?.data?.message || "Failed to save academic session";
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            {session ? "Edit Academic Session" : "Create Academic Session"}
          </SheetTitle>
          <SheetDescription>
            {session
              ? "Update the academic session information below."
              : "Add a new academic session to the system."}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 px-4 py-6">
          <Input
            label={"Session Name *"}
            {...register("name")}
            id="name"
            placeholder="e.g., 2025-26"
            className={errors.name ? "border-red-500" : ""}
            error={errors.name}
          />

          <div className="space-y-2">
            <Label>Start Date *</Label>
            <DatePicker
              date={watch("start_date")}
              onDateChange={(date) =>
                setValue("start_date", date, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
              placeholder="Select start date"
              disabled={loading}
              className={errors.start_date ? "border-red-500" : ""}
            />

            {errors.start_date && (
              <p className="text-red-500 text-sm">
                {errors.start_date.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>End Date *</Label>
            <DatePicker
              date={watch("end_date")}
              onDateChange={(date) =>
                setValue("end_date", date, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
              placeholder="Select end date"
              disabled={loading}
              className={errors.end_date ? "border-red-500" : ""}
            />

            {errors.end_date && (
              <p className="text-red-500 text-sm">{errors.end_date.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="is_active">Status</Label>
            <Select
              value={watch("is_active").toString()}
              onValueChange={(value) =>
                setValue("is_active", value === "true", { shouldDirty: true })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Active</SelectItem>
                <SelectItem value="false">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </form>

        <SheetFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading || !isDirty}
            onClick={handleSubmit(onSubmit)}
          >
            {loading ? "Saving..." : session ? "Update" : "Create"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
