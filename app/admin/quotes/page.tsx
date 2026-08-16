import type { Metadata } from "next";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/current-user";
import { requireStaffSection } from "@/lib/auth/rbac";
import { listQuotesForAdmin } from "@/lib/quotes/admin-queries";
import { QUOTE_STATUSES, type QuoteStatus } from "@/lib/orders/constants";
import { Badge } from "@/components/ui/badge";
import { formatMoneyAed } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Quotes" };

const QUOTE_STATUS_LABELS: Record<QuoteStatus, string> = {
  NEW: "New",
  REVIEWING: "Reviewing",
  QUOTED: "Quoted",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
  EXPIRED: "Expired",
  CONVERTED: "Converted",
};

function quoteBadgeVariant(status: QuoteStatus) {
  if (status === "ACCEPTED" || status === "CONVERTED") return "success" as const;
  if (status === "REJECTED" || status === "EXPIRED") return "destructive" as const;
  if (status === "NEW") return "brand" as const;
  return "secondary" as const;
}

function isQuoteStatus(value: string): value is QuoteStatus {
  return (QUOTE_STATUSES as readonly string[]).includes(value);
}

export default async function AdminQuotesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const user = await getCurrentUser();
  requireStaffSection(user, "quotes");

  const { status, q } = await searchParams;
  const statusFilter = status && isQuoteStatus(status) ? status : undefined;

  const quotes = await listQuotesForAdmin({ status: statusFilter, search: q || undefined });

  return (
    <div>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Quotes</h1>
        <p className="mt-1 text-muted-foreground">Custom quote requests from the website.</p>
      </div>

      <form className="mt-6 flex flex-wrap items-center gap-3" action="/admin/quotes">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Search quote number, name or email"
          className="h-10 w-72 rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <select
          name="status"
          defaultValue={statusFilter ?? ""}
          className="h-10 rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="">All statuses</option>
          {QUOTE_STATUSES.map((s) => (
            <option key={s} value={s}>
              {QUOTE_STATUS_LABELS[s]}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="h-10 rounded-md bg-brand px-4 text-sm font-medium text-brand-foreground hover:bg-brand/90"
        >
          Filter
        </button>
        {(statusFilter || q) && (
          <Link href="/admin/quotes" className="text-sm text-brand hover:underline">
            Clear
          </Link>
        )}
      </form>

      <div className="mt-6 overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 text-left text-xs font-medium uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Quote</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Quoted price</th>
              <th className="px-4 py-3">Received</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {quotes.map((quote) => (
              <tr key={quote.id} className="hover:bg-accent/30">
                <td className="px-4 py-3 font-medium">
                  <Link href={`/admin/quotes/${quote.id}`} className="text-brand hover:underline">
                    {quote.quoteNumber}
                  </Link>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {quote.customerName}
                  <div className="text-xs">{quote.email}</div>
                </td>
                <td className="max-w-xs truncate px-4 py-3 text-muted-foreground">{quote.productDescription}</td>
                <td className="px-4 py-3">
                  <Badge variant={quoteBadgeVariant(quote.status)}>{QUOTE_STATUS_LABELS[quote.status]}</Badge>
                </td>
                <td className="px-4 py-3 font-medium">
                  {quote.quotedPriceCents != null ? formatMoneyAed(quote.quotedPriceCents) : "—"}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {new Date(quote.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {quotes.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                  No quote requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
