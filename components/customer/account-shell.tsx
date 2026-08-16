import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";
import { LogoutButton } from "@/components/auth/logout-button";
import type { CurrentCustomer } from "@/lib/auth/current-user";

const NAV_ITEMS = [
  { href: "/account", label: "Dashboard" },
  { href: "/orders", label: "My Orders" },
  { href: "/account/designs", label: "My Designs" },
  { href: "/account/addresses", label: "Addresses" },
  { href: "/account/invoices", label: "Invoices" },
  { href: "/account/settings", label: "Account Settings" },
];

/**
 * Shared auth-gated shell for every customer-area route (/account/*,
 * /orders/*) — one sidebar, one login prompt, so a signed-out visitor sees
 * the same experience regardless of which customer route they landed on.
 */
export function AccountShell({ user, children }: { user: CurrentCustomer | null; children: React.ReactNode }) {
  if (!user) {
    return (
      <div className="flex min-h-full flex-1 flex-col items-center justify-center bg-secondary/30 px-4 py-16">
        <div className="w-full max-w-sm rounded-xl border border-border bg-background p-6 shadow-sm">
          <h1 className="mb-6 text-xl font-semibold">Log in to view your account</h1>
          <LoginForm />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 gap-8 px-4 py-10 sm:px-6 lg:px-8">
      <aside className="hidden w-56 shrink-0 md:block">
        <p className="mb-4 text-sm text-muted-foreground">
          {user.firstName} {user.lastName}
        </p>
        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <LogoutButton variant="outline" className="mt-4 w-full" />
      </aside>
      <div className="flex-1">{children}</div>
    </div>
  );
}
