"use client";

import { useEffect, useRef, useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { businessConfig } from "@/lib/config/business";

const CONTACT_DETAILS = [
  {
    icon: Phone,
    label: "Phone",
    content: (
      <div className="flex flex-col gap-1">
        <a href="tel:+97167446347" className="w-fit hover:text-brand">
          06 744 6347
        </a>
        <a href="tel:+971558780322" className="w-fit hover:text-brand">
          055 87 80 322
        </a>
        <a href="tel:+971565024642" className="w-fit hover:text-brand">
          056 50 24 642
        </a>
      </div>
    ),
  },
  {
    icon: Mail,
    label: "Email",
    content: (
      <a href="mailto:xlprint.stamp@gmail.com" className="break-all hover:text-brand">
        xlprint.stamp@gmail.com
      </a>
    ),
  },
  {
    icon: MapPin,
    label: "Visit us",
    content: <span>Near Musallah Bus Station, Liwara 1, Ajman, UAE</span>,
  },
];

export function ContactExcelprint() {
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
    <section ref={sectionRef} className="border-t border-brand/10 bg-accent/45">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 sm:py-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-stretch lg:gap-14 lg:px-8">
        <div
          className={`transition-[opacity,transform] duration-500 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">Contact Excelprint</span>
          <h2 className="mt-2 max-w-xl text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Let&apos;s Talk About Your Next Print Project
          </h2>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Need printing, branding, signage or a custom solution? Get in touch with the Excelprint team in Ajman.
          </p>

          <ul className="mt-8 space-y-6">
            {CONTACT_DETAILS.map((detail, index) => (
              <li
                key={detail.label}
                className={`flex gap-4 transition-[opacity,transform] duration-500 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
                  isVisible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                }`}
                style={{ transitionDelay: `${120 + index * 90}ms` }}
              >
                <detail.icon className="mt-0.5 size-5 shrink-0 text-brand" strokeWidth={1.8} aria-hidden="true" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">{detail.label}</p>
                  <div className="mt-1 text-sm font-medium leading-relaxed text-foreground sm:text-base">
                    {detail.content}
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col gap-3 min-[430px]:flex-row">
            <Button asChild variant="brand" size="lg">
              <a href="tel:+97167446347">
                <Phone aria-hidden="true" />
                Call Us
              </a>
            </Button>
            <Button asChild variant="brandOutline" size="lg">
              <a href="mailto:xlprint.stamp@gmail.com">
                <Mail aria-hidden="true" />
                Email Us
              </a>
            </Button>
          </div>
        </div>

        <div
          className={`relative flex min-h-72 overflow-hidden border-l-4 border-brand bg-[#AFE584] p-7 transition-[opacity,transform] duration-500 delay-200 ease-out sm:min-h-80 sm:p-9 motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <MapPin
            className="absolute -bottom-10 -right-8 size-56 text-brand/10 sm:size-64"
            strokeWidth={1}
            aria-hidden="true"
          />
          <div className="relative z-10 mt-auto max-w-md">
            <MapPin className="size-10 text-brand" strokeWidth={1.6} aria-hidden="true" />
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-brand">Visit Excelprint in Ajman</p>
            <address className="mt-2 text-xl font-semibold not-italic leading-snug text-foreground sm:text-2xl">
              Near Musallah Bus Station, Liwara 1, Ajman, UAE
            </address>
            {businessConfig.mapsUrl && (
              <Button asChild variant="brandOutline" className="mt-6">
                <a href={businessConfig.mapsUrl} target="_blank" rel="noopener noreferrer">
                  Get Directions
                  <MapPin aria-hidden="true" />
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
