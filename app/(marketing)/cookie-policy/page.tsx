import type { Metadata } from "next";
import { LegalPage } from "@/components/marketing/legal-page";
import { businessConfig } from "@/lib/config/business";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "How Excel Printing uses cookies on its website.",
};

export default function CookiePolicyPage() {
  return (
    <LegalPage title="Cookie Policy" lastUpdated="11 August 2026">
      <p>This Cookie Policy explains how Excel Printing uses cookies and similar technologies on this website.</p>

      <h2>1. What Are Cookies</h2>
      <p>
        Cookies are small text files stored on your device that let a website remember information about your visit,
        such as your login session or preferences.
      </p>

      <h2>2. Cookies We Use</h2>
      <ul>
        <li>
          <strong>Essential/session cookies</strong> — keep you logged in to your account and cart, and are required
          for the site to function. These cannot be disabled without affecting core functionality.
        </li>
        <li>
          <strong>Security cookies</strong> — used by Cloudflare Turnstile to help distinguish real visitors from
          bots on forms.
        </li>
        <li>
          <strong>Payment cookies</strong> — set by Stripe during checkout to process your payment securely.
        </li>
      </ul>
      <p>We do not currently use third-party advertising or cross-site tracking cookies.</p>

      <h2>3. Managing Cookies</h2>
      <p>
        Most browsers let you block or delete cookies through their settings. Blocking essential cookies will
        prevent you from logging in or completing checkout on this site.
      </p>

      <h2>4. Contact</h2>
      <p>
        Questions about this policy can be sent to{" "}
        {businessConfig.email ? <a href={`mailto:${businessConfig.email}`}>{businessConfig.email}</a> : "our support team"}.
      </p>
    </LegalPage>
  );
}
