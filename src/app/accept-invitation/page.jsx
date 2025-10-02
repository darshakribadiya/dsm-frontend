"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { LoadingScreen } from "@/components/loading-screen";

const AcceptInvitationSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  password: z.string().min(8, "Password must be at least 8 characters"),
  password_confirmation: z.string().min(8),
});

const confirmSchema = AcceptInvitationSchema.refine(
  (data) => data.password === data.password_confirmation,
  {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  }
);

export default function AcceptInvitationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [invitation, setInvitation] = useState(null);
  const [globalError, setGlobalError] = useState("");

  const form = useForm({
    resolver: zodResolver(confirmSchema),
    defaultValues: {
      name: "",
      password: "",
      password_confirmation: "",
    },
  });

  useEffect(() => {
    if (!token) {
      setGlobalError("Missing invitation token.");
      setLoading(false);
      return;
    }

    setLoading(true);
    api
      .get(`/invitation?token=${encodeURIComponent(token)}`)
      .then((res) => {
        if (res.data?.data) {
          setInvitation(res.data.data);
        } else {
          setGlobalError(res.data?.message || "Invalid or expired invitation.");
        }
      })
      .catch((err) => {
        console.error(err);
        setGlobalError(
          err?.response?.data?.message || "Unable to fetch invitation."
        );
      })
      .finally(() => setLoading(false));
  }, [token]);

  const onSubmit = async (values) => {
    setGlobalError("");
    try {
      const res = await api.post("/accept-invitation", {
        ...values,
        token,
      });

      toast.success("Account created successfully. You can now log in.");
      router.push("/login");
    } catch (err) {
      const message = err?.response?.data?.message;
      if (message) {
        setGlobalError(message);
      } else {
        setGlobalError("Unexpected server error. Try again later.");
      }
    }
  };

  if (loading) {
    return <LoadingScreen loadingText={"Loading invitation..."} />;
  }

  if (globalError) {
    return (
      <div className="max-w-md mx-auto mt-12">
        <Card>
          <CardHeader>
            <CardTitle>Invitation Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-destructive">{globalError}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-12">
      <Card>
        <CardHeader>
          <CardTitle>Accept Invitation</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">
            You are invited as <strong>{invitation?.role?.label}</strong> for
            the email <strong>{invitation?.email}</strong>.
          </p>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Full name"
                {...form.register("name")}
              />
              {form.formState.errors.name && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Password"
                {...form.register("password")}
              />
              {form.formState.errors.password && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="password_confirmation">Confirm Password</Label>
              <Input
                id="password_confirmation"
                type="password"
                placeholder="Confirm password"
                {...form.register("password_confirmation")}
              />
              {form.formState.errors.password_confirmation && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.password_confirmation.message}
                </p>
              )}
            </div>

            {globalError && (
              <p className="text-sm text-destructive">{globalError}</p>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting
                ? "Creating account..."
                : "Create account"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
