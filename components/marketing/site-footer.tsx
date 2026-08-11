import Link from "next/link";
import { businessConfig } from "@/lib/config/business";

const FOOTER_COLUMNS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Products",
    links: [
      { href: "/products/business-cards", label: "Business Cards" },
      { href: "/products/flyers", label: "Flyers" },
      { href: "/products/brochures", label: "Brochures" },
      { href: "/products/stamps", label: "Stamps" },
      { href: "/products/roll-up-banners", label: "Roll-up Banners" },
    ],
  },
  {
    title: "Services",
    links: [
      { href: "/printing-services-ajman", label: "Printing Services in Ajman" },
      { href: "/digital-printing-ajman", label: "Digital Printing" },
      { href: "/offset-printing-ajman", label: "Offset Printing" },
      { href: "/urgent-printing-ajman", label: "Urgent Printing" },
      { href: "/corporate-printing-ajman", label: "Corporate Printing" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/quote", label: "Request a Quote" },
      { href: "/blog", label: "Printing Guides" },
      { href: "/account", label: "My Account" },
      { href: "/orders", label: "Track an Order" },
    ],
  },
];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground">
                EP
              </span>
              <span className="text-lg font-semibold tracking-tight">
                Excel<span className="text-brand">Print</span>
              </span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              Professional printing, custom design and fast production in Ajman, UAE.
            </p>
            <ul className="mt-4 space-y-1 text-sm text-muted-foreground">
              {businessConfig.phone && <li>{businessConfig.phone}</li>}
              {businessConfig.email && <li>{businessConfig.email}</li>}
              {businessConfig.address && <li>{businessConfig.address}</li>}
              {businessConfig.hours && <li>{businessConfig.hours}</li>}
            </ul>
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-semibold text-foreground">{column.title}</h3>
              <ul className="mt-3 space-y-2">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {year} Excel Printing Ajman. All rights reserved.
            {businessConfig.vatNumber ? ` TRN: ${businessConfig.vatNumber}` : ""}
          </p>
          <div className="flex gap-4">
            <Link href="/terms" className="hover:text-foreground">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-foreground">
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
