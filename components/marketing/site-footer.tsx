import Link from "next/link";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import { SiteLogo } from "@/components/marketing/site-logo";
import { Button } from "@/components/ui/button";

const PRODUCT_LINKS = [
  { href: "/product/business-cards", label: "Business Cards" },
  { href: "/product/flyers", label: "Flyers" },
  { href: "/product/brochures", label: "Brochures" },
  { href: "/product/stamps", label: "Stamps" },
  { href: "/product/roll-up-banners", label: "Roll-up Banners" },
  { href: "/products", label: "View All Products" },
];

const SERVICE_LINKS = [
  { href: "/products", label: "Printing Services in Ajman" },
  { href: "/quote", label: "Digital Printing" },
  { href: "/quote", label: "Offset Printing" },
  { href: "/quote", label: "Corporate Printing" },
  { href: "/quote", label: "Custom Printing / Request Quote" },
];

const POLICY_LINKS = [
  { href: "/terms", label: "Terms" },
  { href: "/privacy", label: "Privacy" },
  { href: "/refund-policy", label: "Refund Policy" },
  { href: "/shipping-policy", label: "Shipping Policy" },
  { href: "/cookie-policy", label: "Cookies" },
];

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-1.5 py-1 text-sm text-white/65 transition-colors duration-300 hover:text-brand-bright focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-bright"
    >
      <span>{label}</span>
      <ArrowRight
        className="size-3.5 opacity-0 transition-[opacity,transform] duration-300 group-hover:translate-x-0.5 group-hover:opacity-100 motion-reduce:transform-none motion-reduce:transition-none"
        aria-hidden="true"
      />
    </Link>
  );
}

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-[#172316] text-white">
      <div className="mx-auto max-w-7xl px-4 pb-7 pt-12 sm:px-6 sm:pt-14 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.2fr_0.85fr_1fr_1.2fr] lg:gap-12">
          <div>
            <div className="inline-flex bg-white px-3 py-2">
              <SiteLogo />
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/65">
              Professional printing, branding and custom production solutions for businesses and individuals in
              Ajman, UAE.
            </p>
            <Button asChild variant="brand" className="mt-6">
              <Link href="/quote">
                Request a Quote
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-brand-bright">Products</h2>
            <ul className="mt-4 space-y-1">
              {PRODUCT_LINKS.map((link) => (
                <li key={link.href + link.label}>
                  <FooterLink {...link} />
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-brand-bright">Services</h2>
            <ul className="mt-4 space-y-1">
              {SERVICE_LINKS.map((link) => (
                <li key={link.label}>
                  <FooterLink {...link} />
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-brand-bright">Contact</h2>
            <ul className="mt-5 space-y-5 text-sm text-white/70">
              <li className="flex gap-3">
                <Phone className="mt-0.5 size-4 shrink-0 text-brand-bright" strokeWidth={1.8} aria-hidden="true" />
                <div className="flex flex-col gap-1.5">
                  <a href="tel:+97167446347" className="w-fit transition-colors duration-300 hover:text-brand-bright">06 744 6347</a>
                  <a href="tel:+971558780322" className="w-fit transition-colors duration-300 hover:text-brand-bright">055 87 80 322</a>
                  <a href="tel:+971565024642" className="w-fit transition-colors duration-300 hover:text-brand-bright">056 50 24 642</a>
                </div>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 size-4 shrink-0 text-brand-bright" strokeWidth={1.8} aria-hidden="true" />
                <a href="mailto:xlprint.stamp@gmail.com" className="break-all transition-colors duration-300 hover:text-brand-bright">
                  xlprint.stamp@gmail.com
                </a>
              </li>
              <li className="flex gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-brand-bright" strokeWidth={1.8} aria-hidden="true" />
                <address className="max-w-xs not-italic leading-relaxed">
                  Near Musallah Bus Station, Liwara 1, Ajman, UAE
                </address>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6">
          <div className="flex flex-col gap-4 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between">
            <p>&copy; {year} Excel Printing Ajman. All rights reserved.</p>
            <nav aria-label="Legal policies">
              <ul className="flex flex-wrap gap-x-4 gap-y-2">
                {POLICY_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="transition-colors duration-300 hover:text-brand-bright">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <p className="mt-4 border-t border-white/10 pt-4 text-center text-[11px] text-white/40 sm:text-left">
            Site built by{" "}
            <a href="https://aiingo.com" target="_blank" rel="noopener noreferrer" className="transition-colors duration-300 hover:text-brand-bright">
              Aiingo
            </a>{" "}
            &amp;{" "}
            <a href="https://leadvyne.com" target="_blank" rel="noopener noreferrer" className="transition-colors duration-300 hover:text-brand-bright">
              LeadVyne
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
