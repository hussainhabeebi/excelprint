import type { Metadata } from "next";
import { LegalPage } from "@/components/marketing/legal-page";
import { businessConfig } from "@/lib/config/business";

export const metadata: Metadata = {
  title: "Return & Refund Policy",
  description: "Cancellation, return, and refund terms for custom printing orders from Excel Printing.",
};

export default function RefundPolicyPage() {
  return (
    <LegalPage title="Return & Refund Policy" lastUpdated="11 August 2026">
      <p>
        Most Excel Printing products are custom-made to your specifications and artwork, so this policy differs from
        a typical off-the-shelf retail return policy.
      </p>

      <h2>1. Before Proof Approval</h2>
      <p>
        You may cancel an order for a full refund at any time before you approve your design proof, provided
        production has not yet started. Once you approve a proof, your order moves into production and the
        cancellation terms below apply.
      </p>

      <h2>2. After Proof Approval, Before Production</h2>
      <p>
        If production has not yet started, you may request cancellation. A partial refund may apply, deducting any
        design or processing fees already incurred.
      </p>

      <h2>3. Once Production Has Started</h2>
      <p>
        Once printing has begun, orders generally cannot be cancelled or refunded, because materials and production
        time have already been committed. Contact us as soon as possible if there is a problem — we will always try
        to help.
      </p>

      <h2>4. Faulty or Incorrect Orders</h2>
      <p>
        If your order arrives damaged, defective, or materially different from your approved proof (for example, a
        printing error not present in the file you approved), contact us within 7 days of delivery or pickup with
        photos of the issue. We will offer a reprint or refund, at our discretion, for orders where the fault is
        ours.
      </p>
      <p>
        We are not responsible for reprint costs where the issue traces back to content in the artwork you approved
        (spelling, layout, color choices, or low-resolution source files), or to normal variation between screen
        display and printed output.
      </p>

      <h2>5. How Refunds Are Processed</h2>
      <p>
        Approved refunds are issued to your original Stripe payment method. Processing times depend on your bank or
        card issuer and typically take 5–10 business days to appear after we initiate the refund.
      </p>

      <h2>6. Custom Quotes</h2>
      <p>
        Orders placed through a custom quote follow the cancellation and refund terms agreed in the quote, or this
        policy if none were specified.
      </p>

      <h2>7. Contact</h2>
      <p>
        To request a cancellation or report an issue with your order, contact us at{" "}
        {businessConfig.email ? <a href={`mailto:${businessConfig.email}`}>{businessConfig.email}</a> : "our support team"}
        {businessConfig.phone ? ` or ${businessConfig.phone}` : ""} with your order number.
      </p>
    </LegalPage>
  );
}
