import Link from "next/link";
import { Phone, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteLogo } from "@/components/marketing/site-logo";
import { LogoutButton } from "@/components/auth/logout-button";
import { businessConfig } from "@/lib/config/business";
import { getCurrentUser } from "@/lib/auth/current-user";

const NAV_LINKS = [
  { href: "/products", label: "Products" },
  { href: "/printing-services-ajman", label: "Services" },
  { href: "/quote", label: "Custom Quote" },
  { href: "/blog", label: "Guides" },
];

export async function SiteHeader() {
  const user = await getCurrentUser();
  const isCustomer = user?.type === "customer";

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
          {isCustomer ? (
            <>
              <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                <Link href="/account">
                  <User />
                  {user.firstName}
                </Link>
              </Button>
              <LogoutButton className="hidden sm:inline-flex" />
            </>
          ) : (
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Link href="/login">Log in</Link>
            </Button>
          )}
          <Button asChild variant="brand" size="sm">
            <Link href="/products">Start Your Order</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
