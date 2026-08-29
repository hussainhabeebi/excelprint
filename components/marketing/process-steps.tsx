"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, CreditCard, Sliders, Truck, Upload } from "lucide-react";

const STEPS = [
  { icon: Sliders, title: "Choose & configure", description: "Pick a product and set size, paper, finish and quantity." },
  { icon: Upload, title: "Design it", description: "Upload your artwork, request a designer, or generate an AI draft." },
  { icon: CheckCircle2, title: "Approve your proof", description: "Review the print-ready proof and approve before we print." },
  { icon: CreditCard, title: "Pay securely", description: "Checkout with Stripe once your artwork is approved." },
  { icon: Truck, title: "Track & receive", description: "Follow production status through pickup or delivery." },
];

export function ProcessSteps() {
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
      { threshold: 0.2 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="border-y border-brand/15 bg-brand/25">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">Simple from start to finish</span>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">How it works</h2>
          <p className="mt-2 text-muted-foreground">
            A straightforward path from idea to finished print — no back-and-forth emails required.
          </p>
        </div>

        <div className="relative pl-8 sm:pl-0">
          <div className="absolute bottom-8 left-3.5 top-8 w-px bg-brand/30 sm:hidden" aria-hidden="true" />
          <div className="absolute left-[10%] right-[10%] top-8 hidden h-px bg-brand/20 lg:block" aria-hidden="true">
            <span
              className={`block h-full origin-left bg-brand/60 transition-transform duration-1000 ease-out motion-reduce:scale-x-100 motion-reduce:transition-none ${
                isVisible ? "scale-x-100" : "scale-x-0"
              }`}
            />
          </div>

          <ol className="relative grid gap-5 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4">
            {STEPS.map((step, index) => (
              <li
                key={step.title}
                className={`h-full transition-[opacity,transform] duration-500 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
                  isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="group relative h-full rounded-xl border border-border bg-white p-5 shadow-sm transition-[transform,border-color,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:border-brand/50 hover:shadow-md motion-reduce:transform-none motion-reduce:transition-none">
                  <span className="absolute -left-10 top-5 flex size-7 items-center justify-center rounded-full bg-brand text-xs font-semibold text-white shadow-sm sm:-left-2.5 sm:-top-2.5">
                    {index + 1}
                  </span>
                  <div
                    className={`flex size-11 items-center justify-center rounded-lg bg-accent text-brand transition-transform duration-500 motion-reduce:scale-100 motion-reduce:transition-none ${
                      isVisible ? "scale-100" : "scale-90"
                    }`}
                    style={{ transitionDelay: `${index * 100 + 100}ms` }}
                  >
                    <step.icon className="size-5" strokeWidth={1.75} aria-hidden="true" />
                  </div>
                  <h3 className="mt-4 font-semibold text-foreground">{step.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
