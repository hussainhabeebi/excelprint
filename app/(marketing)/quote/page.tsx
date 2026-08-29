import type { Metadata } from "next";
import { Phone, Mail, MessageCircle } from "lucide-react";
import { QuoteRequestForm } from "@/components/marketing/quote-request-form";
import { businessConfig } from "@/lib/config/business";
import { getProductBySlug } from "@/lib/catalog/queries";

export const metadata: Metadata = { title: "Request a Quote" };

export default async function QuotePage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const { service } = await searchParams;
  const selectedProduct = service ? await getProductBySlug(service) : null;
  const initialServiceName = selectedProduct?.purchaseMode === "QUOTE_ONLY" ? selectedProduct.name : undefined;
  const hasContactInfo = businessConfig.phone || businessConfig.whatsapp || businessConfig.email;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:py-16">
      <div className="text-center">
        <h1 className="text-3xl font-semibold tracking-tight">Request a Custom Quote</h1>
        <p className="mt-3 text-muted-foreground">
          Tell us what you need and our team will get back to you with pricing — no obligation.
        </p>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <QuoteRequestForm initialServiceName={initialServiceName} />
        </div>

        {hasContactInfo && (
          <div className="space-y-4 rounded-xl border border-border p-6">
            <h2 className="text-sm font-semibold text-muted-foreground">Prefer to talk to us directly?</h2>
            {businessConfig.phone && (
              <a href={`tel:${businessConfig.phone}`} className="flex items-center gap-3 text-sm hover:text-brand">
                <Phone className="size-4" /> {businessConfig.phone}
              </a>
            )}
            {businessConfig.whatsapp && (
              <a
                href={`https://wa.me/${businessConfig.whatsapp.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm hover:text-brand"
              >
                <MessageCircle className="size-4" /> WhatsApp
              </a>
            )}
            {businessConfig.email && (
              <a href={`mailto:${businessConfig.email}`} className="flex items-center gap-3 text-sm hover:text-brand">
                <Mail className="size-4" /> {businessConfig.email}
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
