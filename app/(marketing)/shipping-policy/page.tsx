import type { Metadata } from "next";
import { LegalPage } from "@/components/marketing/legal-page";
import { businessConfig } from "@/lib/config/business";

export const metadata: Metadata = {
  title: "Shipping & Delivery Policy",
  description: "Pickup, local delivery, and courier options for Excel Printing orders in Ajman and the UAE.",
};

export default function ShippingPolicyPage() {
  return (
    <LegalPage title="Shipping & Delivery Policy" lastUpdated="11 August 2026">
      <p>You can choose from the following fulfillment methods at checkout. Availability and fees are shown per order.</p>

      <h2>1. Store Pickup</h2>
      <p>
        Collect your order directly from our Ajman location once it is ready. We will notify you when your order is
        ready for pickup.
        {businessConfig.address ? ` Pickup address: ${businessConfig.address}.` : ""}
      </p>

      <h2>2. Local Delivery (Ajman)</h2>
      <p>
        We offer local delivery within Ajman for an additional fee, shown at checkout. Local delivery times are
        estimated separately from production time and will be confirmed once your order is ready to ship.
      </p>

      <h2>3. Courier (UAE-wide)</h2>
      <p>
        For delivery outside Ajman, we use a third-party courier. Courier fees and estimated transit times are shown
        at checkout and vary by destination.
      </p>

      <h2>4. Production Time vs. Delivery Time</h2>
      <p>
        The production time shown on each product page covers printing and finishing only, starting from proof
        approval. Delivery or pickup happens after production is complete — total time to receive your order is
        production time plus delivery time.
      </p>

      <h2>5. Order Tracking</h2>
      <p>
        You can track your order&apos;s production and delivery status from your account dashboard at any time after
        checkout.
      </p>

      <h2>6. Delivery Issues</h2>
      <p>
        If your order does not arrive, arrives damaged in transit, or is delivered to the wrong address due to an
        error on our part, contact us and we will work with you to resolve it.
      </p>

      <h2>7. Contact</h2>
      <p>
        Questions about delivery can be sent to{" "}
        {businessConfig.email ? <a href={`mailto:${businessConfig.email}`}>{businessConfig.email}</a> : "our support team"}
        {businessConfig.phone ? ` or ${businessConfig.phone}` : ""}.
      </p>
    </LegalPage>
  );
}
