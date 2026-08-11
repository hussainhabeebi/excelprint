import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = { title: "Log in" };

export default function LoginPage() {
  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold">Log in to your account</h1>
      <LoginForm />
    </div>
  );
}
