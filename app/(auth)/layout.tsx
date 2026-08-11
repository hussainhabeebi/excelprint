import Link from "next/link";
import { SiteLogo } from "@/components/marketing/site-logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center bg-secondary/30 px-4 py-16">
      <Link href="/" className="mb-8">
        <SiteLogo />
      </Link>
      <div className="w-full max-w-sm rounded-xl border border-border bg-background p-6 shadow-sm">{children}</div>
    </div>
  );
}
