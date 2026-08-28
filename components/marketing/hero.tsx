import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Award, BadgeDollarSign, Clock3, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TypewriterText } from "@/components/marketing/typewriter-text";

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
  return (
    <section className="relative isolate min-h-[560px] overflow-hidden border-b border-border sm:min-h-[570px] lg:min-h-[570px]">
      <Image
        src="/hero/hero-1.jpg"
        alt="Professional large-format printing services in Ajman, UAE"
        fill
        priority
        quality={90}
        sizes="100vw"
        className="object-cover object-[72%_center] sm:object-[70%_center]"
      />

      <div
        className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.99)_0%,rgba(255,255,255,0.96)_38%,rgba(255,255,255,0.70)_58%,rgba(255,255,255,0.22)_74%,rgba(255,255,255,0)_86%)] sm:bg-[linear-gradient(90deg,rgba(255,255,255,0.99)_0%,rgba(255,255,255,0.96)_30%,rgba(255,255,255,0.62)_42%,rgba(255,255,255,0.18)_52%,rgba(255,255,255,0)_58%)] lg:bg-[linear-gradient(90deg,rgba(255,255,255,0.99)_0%,rgba(255,255,255,0.96)_25%,rgba(255,255,255,0.58)_36%,rgba(255,255,255,0.16)_45%,rgba(255,255,255,0)_50%)]"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto flex min-h-[560px] max-w-7xl flex-col justify-center px-4 py-8 sm:min-h-[570px] sm:px-6 sm:py-10 lg:min-h-[570px] lg:px-8 lg:py-10">
        <div className="max-w-xl lg:max-w-2xl">
          <span className="inline-flex items-center rounded-full border border-border/80 bg-white/90 px-3 py-1 text-xs font-medium text-muted-foreground">
            Printing &amp; branding in Ajman, UAE
          </span>

          <h1 className="mt-5 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl lg:leading-[1.05]">
            Print{" "}
            <span className="text-brand">
              <TypewriterText words={ROTATING_PRODUCTS} />
            </span>
            <br />
            Design It. Approve It. Get It Delivered.
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-700 sm:text-lg">
            Professional printing, custom design and fast production in Ajman. Configure your job, see the price
            instantly, and approve your proof before it ever goes to press.
          </p>
        </div>

        <div className="mt-7 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" variant="brand">
              <Link href="/products">
                Start Your Order
                <ArrowRight />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-white/90">
              <Link href="/quote">Request Custom Quote</Link>
            </Button>
          </div>

          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:flex lg:items-center lg:justify-end">
            {FEATURE_STRIP.map((item) => (
              <li
                key={item.label}
                className="flex items-center gap-2 rounded-full bg-white/90 px-3 py-2 text-xs font-medium text-slate-700 shadow-sm"
              >
                <item.icon className="size-4 shrink-0 text-brand" />
                <span className="whitespace-nowrap">{item.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
