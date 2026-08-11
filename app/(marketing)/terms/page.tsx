import type { Metadata } from "next";
import { LegalPage } from "@/components/marketing/legal-page";
import { businessConfig } from "@/lib/config/business";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms and conditions for using the Excel Printing website and ordering printing services.",
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms & Conditions" lastUpdated="11 August 2026">
      <p>
        These Terms &amp; Conditions (&quot;Terms&quot;) govern your use of the Excel Printing website and your purchase of
        printing, design, and related services (the &quot;Services&quot;) from Excel Printing (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;), a printing
        and branding business operating in Ajman, United Arab Emirates. By placing an order or using this website,
        you agree to these Terms.
      </p>

      <h2>1. Orders and Configuration</h2>
      <p>
        Prices shown on the website are calculated dynamically based on the product, specifications, quantity, and
        options you select, and are recalculated by our servers at checkout. The price shown at checkout is the
        binding price for your order. We reserve the right to correct obvious pricing errors before an order is
        accepted.
      </p>

      <h2>2. Artwork and Print-Ready Files</h2>
      <p>
        You are responsible for ensuring that any artwork you upload is accurate, complete, and print-ready
        according to the artwork requirements shown for each product (format, resolution, color profile, bleed, and
        safe margins). We are not responsible for spelling, layout, or color errors present in artwork you supply
        and approve.
      </p>
      <p>
        Where you request our design team to create or revise artwork, or use our AI design tool to generate a
        concept, that artwork remains a draft until a designer prepares a final print-ready proof. AI-generated
        drafts are never sent to production without passing through this review.
      </p>

      <h2>3. Proof Approval</h2>
      <p>
        Before production begins, we will provide a digital proof of your artwork. Production only starts after you
        approve the proof. Once approved, an order is considered final for the purposes of production — if you need
        to make a change after approval, contact us as soon as possible; changes after approval may incur
        additional charges and delay your order, and if artwork has already changed, your prior approval no longer
        applies to the revised artwork.
      </p>

      <h2>4. Payment</h2>
      <p>
        Payment is processed securely through Stripe. We do not store your full card details. An order is only
        confirmed as paid once payment has been verified by our payment provider.
      </p>

      <h2>5. Production and Delivery</h2>
      <p>
        Estimated production times are shown per product and are counted from proof approval (and, where
        applicable, payment), not from the order date. Delivery timing depends on the delivery method you choose at
        checkout. See our{" "}
        <a href="/shipping-policy">Shipping &amp; Delivery Policy</a> for details.
      </p>

      <h2>6. Cancellations and Refunds</h2>
      <p>
        Because most orders are custom-made to your specifications, cancellation and refund eligibility depends on
        how far your order has progressed. See our <a href="/refund-policy">Return &amp; Refund Policy</a> for full
        details.
      </p>

      <h2>7. Intellectual Property</h2>
      <p>
        You confirm that you own or have the right to use any logos, images, text, and other content you upload or
        provide to us, and that using it does not infringe any third party&apos;s rights. You grant us a limited license
        to reproduce that content solely for the purpose of fulfilling your order.
      </p>

      <h2>8. Limitation of Liability</h2>
      <p>
        To the extent permitted by UAE law, our liability for any claim relating to an order is limited to the
        amount you paid for that order. We are not liable for indirect or consequential losses.
      </p>

      <h2>9. Governing Law</h2>
      <p>These Terms are governed by the laws of the United Arab Emirates.</p>

      <h2>10. Contact</h2>
      <p>
        Questions about these Terms can be sent to{" "}
        {businessConfig.email ? <a href={`mailto:${businessConfig.email}`}>{businessConfig.email}</a> : "our support team"}
        {businessConfig.phone ? ` or by phone at ${businessConfig.phone}` : ""}.
      </p>
    </LegalPage>
  );
}
