import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center bg-secondary/30 px-4 py-16">
      <Link href="/" className="mb-8 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground">
          EP
        </span>
        <span className="text-lg font-semibold tracking-tight">
          Excel<span className="text-brand">Print</span>
        </span>
      </Link>
      <div className="w-full max-w-sm rounded-xl border border-border bg-background p-6 shadow-sm">{children}</div>
    </div>
  );
}
