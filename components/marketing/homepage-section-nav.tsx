"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const SECTION_LINKS = [
  { href: "/#products", label: "Products", sectionId: "products" },
  { href: "/#services", label: "Services", sectionId: "services" },
  { href: "/#custom-quote", label: "Custom Quote", sectionId: "custom-quote" },
] as const;

type SectionId = (typeof SECTION_LINKS)[number]["sectionId"];

export function HomepageSectionNav() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<SectionId | null>(null);

  useEffect(() => {
    if (pathname !== "/") {
      return;
    }

    const sections = SECTION_LINKS.map(({ sectionId }) => document.getElementById(sectionId)).filter(
      (section): section is HTMLElement => section !== null,
    );

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top))[0];

        if (visibleEntry) setActiveSection(visibleEntry.target.id as SectionId);
      },
      { rootMargin: "-64px 0px -55% 0px", threshold: [0, 0.1, 0.25] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [pathname]);

  return (
    <nav className="hidden items-center gap-6 md:flex" aria-label="Homepage sections">
      {SECTION_LINKS.map((link) => {
        const isActive = pathname === "/" && activeSection === link.sectionId;

        return (
          <Link
            key={link.sectionId}
            href={link.href}
            className={cn(
              "border-b-2 py-1 text-sm font-medium transition-[color,border-color] duration-300 focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2",
              isActive
                ? "border-brand text-brand"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
            aria-current={isActive ? "location" : undefined}
          >
            {link.label}
          </Link>
        );
      })}
      <Link
        href="/blog"
        className="border-b-2 border-transparent py-1 text-sm font-medium text-muted-foreground transition-colors duration-300 hover:text-foreground focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
      >
        Guides
      </Link>
    </nav>
  );
}
