"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";

export function LoginForm({ className }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    setSubmitting(false);
    if (res?.error) {
      setError("Invalid credentials");
      return;
    }
    router.push("/dashboard");
  };

  return (
    <form
      className={`flex flex-col gap-6 ${className ?? ""}`}
      onSubmit={onSubmit}
    >
      <Field>
        <FieldLabel>Email</FieldLabel>
        <Input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Field>

      <Field>
        <FieldLabel>Password</FieldLabel>
        <Input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Field>

      <Button type="submit" disabled={submitting}>
        {submitting ? "Logging in..." : "Login"}
      </Button>

      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
    </form>
  );
}
