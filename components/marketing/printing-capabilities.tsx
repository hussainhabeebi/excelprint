"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Check, PanelsTopLeft } from "lucide-react";

const CAPABILITIES = [
  "Offset & Digital Printing",
  "Commercial Printing",
  "Large Format Printing",
  "Signage & Display",
  "Packaging & Labels",
  "Corporate Branding",
  "Promotional Products",
  "Graphic Design",
  "Print Finishing",
  "Custom Printing",
];

export function PrintingCapabilities() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="bg-background">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 sm:py-16 lg:grid-cols-[1.08fr_0.92fr] lg:gap-14 lg:px-8">
        <div
          className={`transition-[opacity,transform] duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
          }`}
        >
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">Our printing capabilities</span>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Complete Printing Solutions
          </h2>
          <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
            From essential business print to large-format displays, branded packaging and custom finishing,
            Excel Printing brings a wide range of production and design capabilities together.
          </p>

          <div className="mt-6 flex items-center gap-3 rounded-xl border border-brand/20 bg-accent/70 p-4">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand text-brand-foreground">
              <PanelsTopLeft className="size-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">Key capability</p>
              <p className="mt-0.5 font-semibold text-foreground">Premium 3D Signage &amp; Display</p>
            </div>
          </div>

          <ul className="mt-7 grid gap-x-6 gap-y-3 sm:grid-cols-2">
            {CAPABILITIES.map((capability, index) => (
              <li
                key={capability}
                className={`flex items-center gap-2.5 text-sm font-medium text-foreground transition-[opacity,transform] duration-500 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
                  isVisible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                }`}
                style={{ transitionDelay: `${100 + index * 55}ms` }}
              >
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
                  <Check className="size-3.5" strokeWidth={2.5} aria-hidden="true" />
                </span>
                {capability}
              </li>
            ))}
          </ul>
        </div>

        <div
          className={`relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-muted shadow-lg transition-[opacity,transform] delay-150 duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none lg:aspect-square ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
          }`}
        >
          <Image
            src="/hero/hero-3.jpg"
            alt="Large-format printing equipment producing vibrant custom graphics"
            fill
            sizes="(min-width: 1280px) 520px, (min-width: 1024px) 42vw, 100vw"
            className="object-cover object-center"
          />
          <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/5" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
