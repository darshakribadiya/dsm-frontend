"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import api from "@/lib/api";

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export default function Page() {
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values, type) => {
    setLoading(true);
    try {
      if (type === "link") {
        const res = await api.post("/forgot-password", values);
        toast.success("Reset password link sent to your email.");
      } else {
        const res = await api.post("/send-reset-otp", values);
        toast.success("OTP sent to your email.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md shadow-lg border">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Forgot Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div>
              <Input
                label={"Email Address"}
                type="email"
                placeholder="Enter your email"
                {...form.register("email")}
                error={form.formState.errors.email}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                className="w-full"
                disabled={loading}
                onClick={form.handleSubmit((values) =>
                  onSubmit(values, "link")
                )}
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                disabled={loading}
                onClick={form.handleSubmit((values) => onSubmit(values, "otp"))}
              >
                {loading ? "Sending..." : "Send OTP"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
