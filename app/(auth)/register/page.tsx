import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = { title: "Create Account" };

export default function RegisterPage() {
  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold">Create your account</h1>
      <RegisterForm />
    </div>
  );
}
