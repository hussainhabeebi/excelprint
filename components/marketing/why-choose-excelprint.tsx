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

        <div className="grid sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((benefit, index) => (
            <article
              key={benefit.title}
              className={`group flex flex-col items-center border-b border-brand/15 px-4 py-8 text-center transition-[opacity,transform] duration-300 ease-out last:border-b-0 sm:border-b-0 sm:px-8 sm:py-9 lg:px-7 ${
                index < 2 ? "sm:border-b lg:border-b-0" : ""
              } ${index % 2 === 0 ? "sm:border-r" : ""} ${index === 1 ? "lg:border-r" : ""} ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              } motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none`}
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              <benefit.icon
                className="size-11 text-brand transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-105 motion-reduce:transform-none motion-reduce:transition-none"
                strokeWidth={1.6}
                aria-hidden="true"
              />
              <span
                className="mt-4 h-0.5 w-8 rounded-full bg-brand transition-[width] duration-300 group-hover:w-12 motion-reduce:transition-none"
                aria-hidden="true"
              />
              <h3 className="mt-4 font-semibold text-foreground transition-colors duration-300 group-hover:text-brand motion-reduce:transition-none">
                {benefit.title}
              </h3>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">{benefit.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
