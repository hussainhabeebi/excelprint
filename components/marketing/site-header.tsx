import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SiteLogo } from "@/components/marketing/site-logo";
import { businessConfig } from "@/lib/config/business";
import { Phone } from "lucide-react";

const NAV_LINKS = [
  { href: "/products", label: "Products" },
  { href: "/printing-services-ajman", label: "Services" },
  { href: "/quote", label: "Custom Quote" },
  { href: "/blog", label: "Guides" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="shrink-0">
          <SiteLogo />
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {businessConfig.phone && (
            <a
              href={`tel:${businessConfig.phone}`}
              className="hidden items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground lg:flex"
            >
              <Phone className="size-4" />
              {businessConfig.phone}
            </a>
          )}
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <Link href="/login">Log in</Link>
          </Button>
          <Button asChild variant="brand" size="sm">
            <Link href="/products">Start Your Order</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
