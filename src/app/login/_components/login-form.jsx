"use client";

import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { login } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircleIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(3, "Password must be at least 6 characters"),
});

export function LoginForm({ className, ...props }) {
  const [passwordShow, setPasswordShow] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });

  function handlePasswordToggle() {
    setPasswordShow(!passwordShow);
  }

  const onSubmit = async (data) => {
    setError("");
    try {
      const res = await login(data.email, data.password);
      console.log(res);

      toast.success(res.message);
      router.push("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Login to your account</h1>

        {error && (
          <Alert variant="destructive">
            <AlertCircleIcon className="h-4 w-4" />
            <AlertTitle>{error}</AlertTitle>
          </Alert>
        )}
      </div>

      <div className="grid gap-6">
        <Input
          label="Email"
          id="email"
          type="email"
          placeholder="m@example.com"
          {...register("email")}
          error={errors.email}
        />

        {/* Password */}
        <div className="grid gap-1">
          <Input
            id="password"
            type={passwordShow ? "text" : "password"}
            label={"Password"}
            error={errors.password}
            {...register("password")}
            icon={passwordShow ? "mdi:eye-off" : "mdi:eye"}
            iconAtRight
            onIconClick={handlePasswordToggle}
          />
          <div className="flex items-center">
            <Link
              href="/reset-password"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </Link>
          </div>
        </div>

        {/* Submit */}
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Login"}
        </Button>

        {/* Divider */}
        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            Or continue with
          </span>
        </div>
      </div>

      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <a href="#" className="underline underline-offset-4">
          Sign up
        </a>
      </div>
    </form>
  );
}
