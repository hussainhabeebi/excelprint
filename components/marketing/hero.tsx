"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Award, BadgeDollarSign, Clock3, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TypewriterText } from "@/components/marketing/typewriter-text";

const SLIDE_INTERVAL_MS = 5000;

const HERO_SLIDES = [
  {
    src: "/hero/hero-1.jpg",
    alt: "Professional large-format printer producing vibrant custom graphics",
    position: "object-[52%_center] sm:object-center",
  },
  {
    src: "/hero/hero-2.jpg",
    alt: "Large-format banner printing in progress at Excelprint",
    position: "object-center",
  },
  {
    src: "/hero/hero-3.jpg",
    alt: "Professional commercial printing production facility",
    position: "object-[55%_center] sm:object-center",
  },
];

const ROTATING_PRODUCTS = [
  "Business Cards",
  "Flyers",
  "Banners",
  "Stickers",
  "Stamps",
  "Packaging",
];

const FEATURE_STRIP = [
  { icon: Award, label: "Premium Quality" },
  { icon: Clock3, label: "Fast Turnaround" },
  { icon: BadgeDollarSign, label: "Transparent Pricing" },
  { icon: Headphones, label: "Expert Support" },
];

export function Hero() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => setPrefersReducedMotion(mediaQuery.matches);

    updateMotionPreference();
    mediaQuery.addEventListener("change", updateMotionPreference);

    return () => mediaQuery.removeEventListener("change", updateMotionPreference);
  }, []);

  useEffect(() => {
    if (isPaused || prefersReducedMotion) return;

    const timeout = window.setTimeout(() => {
      setActiveSlide((currentSlide) => (currentSlide + 1) % HERO_SLIDES.length);
    }, SLIDE_INTERVAL_MS);

    return () => window.clearTimeout(timeout);
  }, [activeSlide, isPaused, prefersReducedMotion]);

  return (
    <section
      className="relative isolate h-[520px] overflow-hidden border-b border-border sm:h-[540px] lg:h-[560px]"
      aria-roledescription="carousel"
      aria-label="Excelprint printing services"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsPaused(false);
      }}
    >
      <div className="absolute inset-0">
        {HERO_SLIDES.map((slide, index) => (
          <div
            key={slide.src}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out motion-reduce:transition-none ${
              index === activeSlide ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
            aria-hidden={index !== activeSlide}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={index === 0}
              quality={90}
              sizes="100vw"
              className={`object-cover ${slide.position}`}
            />
          </div>
        ))}
      </div>

      <div className="absolute inset-0 bg-black/35" aria-hidden="true" />

      <div className="relative z-10 mx-auto flex h-full max-w-7xl -translate-y-2 flex-col items-center justify-center px-4 py-6 text-center sm:-translate-y-3 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <span className="inline-flex items-center rounded-full border border-white/35 bg-black/25 px-3 py-1 text-xs font-medium text-white shadow-sm">
            Printing &amp; branding in Ajman, UAE
          </span>

          <h1 className="mt-3 text-[1.75rem] font-bold leading-tight tracking-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.65)] sm:text-3xl lg:text-4xl lg:leading-[1.12]">
            Print{" "}
            <span className="text-brand-bright">
              <TypewriterText words={ROTATING_PRODUCTS} />
            </span>
            <br />
            Design It. Approve It. Get It Delivered.
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-white/95 drop-shadow-[0_1px_5px_rgba(0,0,0,0.75)] sm:text-base">
            Professional printing, custom design and fast production in Ajman. Configure your job, see the price
            instantly, and approve your proof before it ever goes to press.
          </p>

          <div className="mt-4 flex flex-col justify-center gap-2.5 min-[380px]:flex-row">
            <Button asChild variant="brand">
              <Link href="/products">
                Start Your Order
                <ArrowRight />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-white/80 bg-white/95 text-slate-900 hover:bg-white"
            >
              <Link href="/quote">Request Custom Quote</Link>
            </Button>
          </div>
        </div>

        <ul className="mt-5 grid w-full max-w-3xl grid-cols-2 gap-x-5 gap-y-3 sm:grid-cols-4">
          {FEATURE_STRIP.map((item) => (
            <li
              key={item.label}
              className="flex items-center justify-center gap-1.5 text-[11px] font-medium leading-tight text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)] sm:gap-2 sm:text-xs"
            >
              <item.icon className="size-4 shrink-0 text-brand-bright" />
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-2" aria-label="Choose hero slide">
        {HERO_SLIDES.map((slide, index) => (
          <button
            key={slide.src}
            type="button"
            onClick={() => setActiveSlide(index)}
            className={`size-2.5 rounded-full border border-white/80 transition-colors motion-reduce:transition-none ${
              index === activeSlide ? "bg-white" : "bg-white/25 hover:bg-white/60"
            }`}
            aria-label={`Show slide ${index + 1}: ${slide.alt}`}
            aria-current={index === activeSlide ? "true" : undefined}
          />
        ))}
      </div>

      <p className="sr-only" aria-live="polite">
        Slide {activeSlide + 1} of {HERO_SLIDES.length}: {HERO_SLIDES[activeSlide].alt}
      </p>
    </section>
  );
}
