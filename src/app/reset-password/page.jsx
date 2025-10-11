"use client";

import api from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const passwordSchema = z
  .object({
    otp: z.string().regex(/^\d{6}$/, {
      message: "Invalid OTP. Please enter a 6-digit code.",
    }),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function Page() {
  const router = useRouter();
  const [otpSent, setOtpSent] = useState(false);
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const emailForm = useForm({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: { otp: "", password: "", confirmPassword: "" },
  });

  const handleEmailSubmit = async (values, type) => {
    setLoadingEmail(true);
    try {
      if (type === "otp") {
        await api.post("/send-reset-otp", values);
        toast.success("OTP sent to your email.");
        setOtpSent(true);
      } else {
        await api.post("/forgot-password", values);
        toast.success("Reset password link sent to your email.");
        router.push("/login");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong. Try again."
      );
    } finally {
      setLoadingEmail(false);
    }
  };

  const handlePasswordSubmit = async (values) => {
    setLoadingPassword(true);
    try {
      await api.post("/reset-password-otp", {
        email: emailForm.getValues("email"),
        otp_code: values.otp,
        password: values.password,
      });
      toast.success("Password reset successful. Redirecting to login...");
      router.push("/login");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to reset password. Try again."
      );
    } finally {
      setLoadingPassword(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md shadow-lg border">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            {otpSent ? "Reset Password" : "Forgot Password"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!otpSent ? (
            <form
              onSubmit={emailForm.handleSubmit((values) =>
                handleEmailSubmit(values, "otp")
              )}
              className="space-y-4"
            >
              <Input
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                {...emailForm.register("email")}
              />
              {emailForm.formState.errors.email && (
                <p className="text-sm text-red-500">
                  {emailForm.formState.errors.email.message}
                </p>
              )}

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled={loadingEmail}
                  onClick={emailForm.handleSubmit((values) =>
                    handleEmailSubmit(values, "otp")
                  )}
                >
                  {loadingEmail ? "Sending..." : "Send OTP"}
                </Button>
                <Button
                  type="button"
                  disabled={loadingEmail}
                  onClick={emailForm.handleSubmit((values) =>
                    handleEmailSubmit(values, "link")
                  )}
                >
                  {loadingEmail ? "Sending..." : "Send Reset Link"}
                </Button>
              </div>
            </form>
          ) : (
            <form
              onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}
              className="space-y-4"
            >
              <Input
                label="OTP"
                type="text"
                placeholder="Enter OTP"
                error={passwordForm.formState.errors.otp}
                {...passwordForm.register("otp")}
              />

              <Input
                label="New Password"
                type={passwordVisible ? "text" : "password"}
                placeholder="Enter new password"
                icon={passwordVisible ? "mdi:eye-off" : "mdi:eye"}
                iconAtRight
                onIconClick={() => setPasswordVisible(!passwordVisible)}
                {...passwordForm.register("password")}
                error={passwordForm.formState.errors.password}
              />

              <Input
                label="Confirm Password"
                type={confirmPasswordVisible ? "text" : "password"}
                placeholder="Confirm password"
                icon={confirmPasswordVisible ? "mdi:eye-off" : "mdi:eye"}
                iconAtRight
                onIconClick={() =>
                  setConfirmPasswordVisible(!confirmPasswordVisible)
                }
                {...passwordForm.register("confirmPassword")}
                error={passwordForm.formState.errors.confirmPassword}
              />

              <Button
                type="submit"
                disabled={loadingPassword}
                className="w-full"
              >
                {loadingPassword ? "Resetting..." : "Reset Password"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
