"use client";

import { useState } from "react";
import { useSearchParams, useParams, useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import api from "@/lib/api"; // ← your axios instance

// ✅ Zod validation schema
const resetPasswordSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });

export default function ResetPasswordPage() {
  const { token } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const emailFromUrl = searchParams.get("email") || "";

  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: emailFromUrl,
      password: "",
      password_confirmation: "",
    },
  });

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const res = await api.post("/reset-password", {
        ...values,
        token,
      });

      toast.success("Password reset successfully!");
      router.push("/sign-in");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to reset password. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Reset Your Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                {...form.register("email")}
                disabled
                className="bg-muted"
              />
              {form.formState.errors.email && (
                <p className="text-sm text-red-500 mt-1">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <Label>New Password</Label>
              <Input type="password" {...form.register("password")} />
              {form.formState.errors.password && (
                <p className="text-sm text-red-500 mt-1">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <Label>Confirm Password</Label>
              <Input
                type="password"
                {...form.register("password_confirmation")}
              />
              {form.formState.errors.password_confirmation && (
                <p className="text-sm text-red-500 mt-1">
                  {form.formState.errors.password_confirmation.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
