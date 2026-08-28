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
    <section className="relative isolate min-h-[680px] overflow-hidden border-b border-border sm:min-h-[650px] lg:min-h-[720px]">
      <Image
        src="/hero/hero-1.jpg"
        alt="Professional large-format printing services in Ajman, UAE"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[70%_center]"
      />

      <div
        className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.99)_0%,rgba(255,255,255,0.96)_55%,rgba(255,255,255,0.58)_100%)] sm:bg-[linear-gradient(90deg,rgba(255,255,255,0.99)_0%,rgba(255,255,255,0.96)_42%,rgba(255,255,255,0.68)_62%,rgba(255,255,255,0.10)_84%,rgba(255,255,255,0)_100%)]"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto flex min-h-[680px] max-w-7xl flex-col justify-center px-4 py-14 sm:min-h-[650px] sm:px-6 sm:py-16 lg:min-h-[720px] lg:px-8 lg:py-20">
        <div className="max-w-xl lg:max-w-2xl">
          <span className="inline-flex items-center rounded-full border border-border/80 bg-white/85 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm">
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

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" variant="brand">
              <Link href="/products">
                Start Your Order
                <ArrowRight />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-white/90 backdrop-blur-sm">
              <Link href="/quote">Request Custom Quote</Link>
            </Button>
          </div>
        </div>

        <ul className="mt-12 grid max-w-3xl grid-cols-2 gap-x-4 gap-y-4 border-t border-slate-900/10 pt-5 sm:grid-cols-4 sm:gap-x-6">
          {FEATURE_STRIP.map((item) => (
            <li key={item.label} className="flex items-center gap-2.5 text-sm font-medium text-slate-700">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/85 text-brand shadow-sm backdrop-blur-sm">
                <item.icon className="size-4" />
              </span>
              {item.label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
