import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { requireStaffSection } from "@/lib/auth/rbac";
import { getQuoteForAdmin } from "@/lib/quotes/admin-queries";
import { QuoteStatusForm } from "@/components/admin/quote-status-form";
import { updateQuoteAction } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Quote Detail" };

export default async function AdminQuoteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  requireStaffSection(user, "quotes");

  const { id } = await params;
  const quote = await getQuoteForAdmin(id);
  if (!quote) notFound();

  return (
    <div>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Quote {quote.quoteNumber}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Received {new Date(quote.createdAt).toLocaleString()}
        </p>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-lg border border-border p-4">
            <h2 className="text-sm font-semibold text-muted-foreground">Request</h2>
            <p className="mt-3 whitespace-pre-wrap text-sm">{quote.productDescription}</p>
            <dl className="mt-4 grid grid-cols-3 gap-4 text-sm">
              {quote.quantity != null && (
                <div>
                  <dt className="text-xs uppercase text-muted-foreground">Quantity</dt>
                  <dd>{quote.quantity}</dd>
                </div>
              )}
              {quote.dimensions && (
                <div>
                  <dt className="text-xs uppercase text-muted-foreground">Dimensions</dt>
                  <dd>{quote.dimensions}</dd>
                </div>
              )}
              {quote.material && (
                <div>
                  <dt className="text-xs uppercase text-muted-foreground">Material</dt>
                  <dd>{quote.material}</dd>
                </div>
              )}
            </dl>
            {quote.description && (
              <>
                <h3 className="mt-4 text-xs font-semibold uppercase text-muted-foreground">Additional notes</h3>
                <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">{quote.description}</p>
              </>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border border-border p-4">
            <h2 className="text-sm font-semibold text-muted-foreground">Contact</h2>
            <p className="mt-2 text-sm font-medium">{quote.customerName}</p>
            {quote.company && <p className="text-sm text-muted-foreground">{quote.company}</p>}
            <p className="mt-1 text-sm text-muted-foreground">{quote.email}</p>
            <p className="text-sm text-muted-foreground">{quote.phone}</p>
          </div>

          <div className="rounded-lg border border-border p-4">
            <h2 className="text-sm font-semibold text-muted-foreground">Manage Quote</h2>
            <div className="mt-3">
              <QuoteStatusForm
                action={updateQuoteAction.bind(null, quote.id)}
                currentStatus={quote.status}
                currentQuotedPriceCents={quote.quotedPriceCents}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
