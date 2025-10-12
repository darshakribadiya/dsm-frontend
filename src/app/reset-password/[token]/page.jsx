"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import api from "@/lib/api";
import { resetPasswordLink } from "@/lib/api/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

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

  const emailFromUrl = searchParams.get("email");
  if (!emailFromUrl) return null;

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
      const res = await resetPasswordLink({
        ...values,
        token,
      });

      toast.success("Password reset successfully!");
      router.push("/login");
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
            <div>
              <Input
                label={"Email"}
                type="email"
                {...form.register("email")}
                disabled
                className="bg-muted"
                error={form.formState.errors.email}
              />
            </div>

            <div>
              <Input
                label={"New Password"}
                type="password"
                {...form.register("password")}
                error={form.formState.errors.password}
              />
            </div>

            <div>
              <Input
                label={"Confirm Password"}
                type="password"
                {...form.register("password_confirmation")}
                error={form.formState.errors.password_confirmation}
              />
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
