"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Grid2x2, Home, ShoppingCart, User } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/", label: "Home", icon: Home, match: (path: string) => path === "/" },
  { href: "/products", label: "Products", icon: Grid2x2, match: (path: string) => path.startsWith("/product") },
  { href: "/cart", label: "Cart", icon: ShoppingCart, match: (path: string) => path.startsWith("/cart") || path.startsWith("/checkout") },
  { href: "/account", label: "Account", icon: User, match: (path: string) => path.startsWith("/account") || path.startsWith("/login") || path.startsWith("/orders") },
];

/**
 * Persistent app-like bottom tab bar for mobile (spec section 35 — the
 * primary journey should feel native on a phone). Hidden on desktop, where
 * the top SiteHeader nav already covers navigation.
 */
export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur pb-[env(safe-area-inset-bottom)] supports-[backdrop-filter]:bg-background/85 sm:hidden"
      aria-label="Primary"
    >
      <div className="grid grid-cols-4">
        {TABS.map((tab) => {
          const active = tab.match(pathname);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors",
                active ? "text-brand" : "text-muted-foreground",
              )}
              aria-current={active ? "page" : undefined}
            >
              <tab.icon className="size-5" strokeWidth={active ? 2.25 : 1.75} />
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
