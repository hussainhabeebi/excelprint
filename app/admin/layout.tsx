import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/current-user";
import { staffHasSection } from "@/lib/auth/rbac";
import { StaffLoginForm } from "@/components/auth/staff-login-form";

const NAV_SECTIONS: { href: string; label: string; section: string }[] = [
  { href: "/admin", label: "Dashboard", section: "dashboard" },
  { href: "/admin/orders", label: "Orders", section: "orders" },
  { href: "/admin/design-queue", label: "Design Queue", section: "design-queue" },
  { href: "/admin/production", label: "Production", section: "production-queue" },
  { href: "/admin/products", label: "Products", section: "products" },
  { href: "/admin/pricing", label: "Pricing", section: "pricing" },
  { href: "/admin/customers", label: "Customers", section: "customers" },
  { href: "/admin/quotes", label: "Quotes", section: "quotes" },
  { href: "/admin/payments", label: "Payments", section: "payments" },
  { href: "/admin/seo", label: "SEO Pages", section: "seo" },
  { href: "/admin/reports", label: "Reports", section: "reports" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  if (!user || user.type !== "staff") {
    return (
      <div className="flex min-h-full flex-1 items-center justify-center bg-secondary/30 px-4 py-16">
        <StaffLoginForm />
      </div>
    );
  }

  const visibleSections = NAV_SECTIONS.filter((item) => staffHasSection(user, item.section));

  return (
    <div className="flex min-h-full flex-1">
      <aside className="hidden w-64 shrink-0 border-r border-border bg-secondary/30 md:block">
        <div className="flex h-16 items-center border-b border-border px-6">
          <span className="font-semibold">ExcelPrint Admin</span>
        </div>
        <nav className="flex flex-col gap-1 p-4">
          {visibleSections.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-background hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-border px-6">
          <span className="text-sm text-muted-foreground">
            Signed in as <span className="font-medium text-foreground">{user.name}</span> ({user.roles.join(", ")})
          </span>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
