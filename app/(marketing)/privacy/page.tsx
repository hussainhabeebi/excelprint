import type { Metadata } from "next";
import { LegalPage } from "@/components/marketing/legal-page";
import { businessConfig } from "@/lib/config/business";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Excel Printing collects, uses, and protects your personal data.",
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" lastUpdated="11 August 2026">
      <p>
        This Privacy Policy explains how Excel Printing (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) collects, uses, and protects your
        personal data when you use our website and order our printing and design services.
      </p>

      <h2>1. Information We Collect</h2>
      <ul>
        <li>Account details: name, email, phone number, password (stored as a salted hash, never in plain text).</li>
        <li>Order details: billing and delivery addresses, order specifications, and order history.</li>
        <li>
          Artwork and design content: files you upload, design briefs, logos, and reference material you provide for
          your order.
        </li>
        <li>Payment information: processed directly by Stripe — we do not store your full card number.</li>
        <li>Technical data: IP address, browser type, and device information, used for security and fraud prevention.</li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <ul>
        <li>To process and fulfill your orders, including production, proofing, and delivery.</li>
        <li>To communicate with you about your order status, proofs, and approvals.</li>
        <li>To verify payments and prevent fraud.</li>
        <li>To improve our website and services.</li>
        <li>To send you marketing communications, only if you have opted in.</li>
      </ul>

      <h2>3. Artwork Confidentiality</h2>
      <p>
        Artwork and design files you upload are stored securely and are only accessible to you and the Excel
        Printing staff working on your order. We do not share your artwork with other customers or use it for
        purposes outside fulfilling your order without your permission.
      </p>

      <h2>4. Sharing Your Information</h2>
      <p>
        We share information with service providers who help us operate the business — payment processing (Stripe),
        cloud hosting and storage (Cloudflare), and, where you request it, our AI design partner for generating
        design drafts. We do not sell your personal data.
      </p>

      <h2>5. Data Retention</h2>
      <p>
        We retain order records, including artwork history and proof approvals, for as long as needed to fulfill
        legal, accounting, and warranty obligations. You may request deletion of your account data, subject to
        records we are required to keep by law.
      </p>

      <h2>6. Your Rights</h2>
      <p>
        You may request access to, correction of, or deletion of your personal data by contacting us using the
        details below.
      </p>

      <h2>7. Cookies</h2>
      <p>
        We use cookies for authentication (keeping you logged in) and essential site functionality. See our{" "}
        <a href="/cookie-policy">Cookie Policy</a> for details.
      </p>

      <h2>8. Contact</h2>
      <p>
        For privacy questions or requests, contact us at{" "}
        {businessConfig.email ? <a href={`mailto:${businessConfig.email}`}>{businessConfig.email}</a> : "our support team"}
        {businessConfig.phone ? ` or ${businessConfig.phone}` : ""}.
      </p>
    </LegalPage>
  );
}
