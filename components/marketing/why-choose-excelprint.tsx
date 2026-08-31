"use client";

import { useEffect, useRef, useState } from "react";
import { Gauge, Palette, Printer, Settings2 } from "lucide-react";

const BENEFITS = [
  {
    icon: Printer,
    title: "Quality Printing",
    description: "Consistent, professional print quality for every project.",
  },
  {
    icon: Gauge,
    title: "Fast Turnaround",
    description: "Efficient production to keep your printing projects moving.",
  },
  {
    icon: Palette,
    title: "Design Support",
    description: "Support with artwork and design to help get your files print-ready.",
  },
  {
    icon: Settings2,
    title: "Custom Solutions",
    description: "Flexible printing solutions tailored to different business requirements.",
  },
];

export function WhyChooseExcelprint() {
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
    <section ref={sectionRef} className="border-t border-brand/10 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto mb-9 max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">Why Excelprint</span>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Why Choose Excelprint?
          </h2>
          <p className="mt-2 text-muted-foreground">
            Professional printing solutions focused on quality, speed and service.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((benefit, index) => (
            <article
              key={benefit.title}
              className={`group relative overflow-hidden rounded-xl border border-border bg-white p-5 shadow-sm transition-[opacity,transform,border-color,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:border-brand/50 hover:shadow-md motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              <span className="absolute inset-x-0 top-0 h-1 bg-brand" aria-hidden="true" />
              <div className="flex size-10 items-center justify-center rounded-lg bg-accent text-brand transition-transform duration-300 group-hover:scale-105 motion-reduce:transform-none motion-reduce:transition-none">
                <benefit.icon className="size-5" strokeWidth={1.8} aria-hidden="true" />
              </div>
              <h3 className="mt-4 font-semibold text-foreground">{benefit.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{benefit.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
