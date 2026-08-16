import type { Metadata } from "next";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/current-user";
import { requireStaffSection } from "@/lib/auth/rbac";
import { listCustomersForAdmin } from "@/lib/customer/admin-queries";
import { Badge } from "@/components/ui/badge";
import { formatMoneyAed } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Customers" };

export default async function AdminCustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const user = await getCurrentUser();
  requireStaffSection(user, "customers");

  const { q } = await searchParams;
  const customers = await listCustomersForAdmin({ search: q || undefined });

  return (
    <div>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Customers</h1>
        <p className="mt-1 text-muted-foreground">All registered customer accounts.</p>
      </div>

      <form className="mt-6 flex flex-wrap items-center gap-3" action="/admin/customers">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Search name or email"
          className="h-10 w-72 rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <button
          type="submit"
          className="h-10 rounded-md bg-brand px-4 text-sm font-medium text-brand-foreground hover:bg-brand/90"
        >
          Search
        </button>
        {q && (
          <Link href="/admin/customers" className="text-sm text-brand hover:underline">
            Clear
          </Link>
        )}
      </form>

      <div className="mt-6 overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 text-left text-xs font-medium uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Orders</th>
              <th className="px-4 py-3">Total spent</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {customers.map((customer) => (
              <tr key={customer.id} className="hover:bg-accent/30">
                <td className="px-4 py-3 font-medium">
                  <Link href={`/admin/customers/${customer.id}`} className="text-brand hover:underline">
                    {customer.firstName} {customer.lastName}
                  </Link>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{customer.email}</td>
                <td className="px-4 py-3 text-muted-foreground">{customer.orderCount}</td>
                <td className="px-4 py-3 font-medium">{formatMoneyAed(customer.totalSpentCents)}</td>
                <td className="px-4 py-3">
                  <Badge variant={customer.status === "ACTIVE" ? "success" : "destructive"}>
                    {customer.status === "ACTIVE" ? "Active" : "Disabled"}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {new Date(customer.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                  No customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
