import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Sparkles, Wand2 } from "lucide-react";
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
  { icon: Sparkles, label: "Live price preview as you configure" },
  { icon: Wand2, label: "Upload artwork or generate an AI draft" },
  { icon: CheckCircle2, label: "Approve your proof before we print" },
];

export function Hero() {
  return (
    <section className="border-b border-border bg-secondary/30">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-24 lg:px-8">
        <div>
          <span className="inline-flex items-center rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
            Printing &amp; branding in Ajman, UAE
          </span>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Print{" "}
            <span className="text-brand">
              <TypewriterText words={ROTATING_PRODUCTS} />
            </span>
            <br />
            Design It. Approve It. Get It Delivered.
          </h1>
          <p className="mt-4 max-w-xl text-lg text-muted-foreground">
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
            <Button asChild size="lg" variant="outline">
              <Link href="/quote">Request Custom Quote</Link>
            </Button>
          </div>

          <ul className="mt-8 flex flex-col gap-2.5 sm:hidden">
            {FEATURE_STRIP.map((item) => (
              <li key={item.label} className="flex items-center gap-2 text-sm text-muted-foreground">
                <item.icon className="size-4 shrink-0 text-brand" />
                {item.label}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-lg sm:aspect-[16/10] lg:aspect-auto lg:h-[480px]">
            <Image
              src="/hero/hero-1.jpg"
              alt="Professional large-format printing services in Ajman, UAE"
              fill
              priority
              sizes="(min-width: 1280px) 592px, (min-width: 1024px) 50vw, (min-width: 640px) calc(100vw - 3rem), calc(100vw - 2rem)"
              className="object-cover object-center"
            />
          </div>
          <ul className="mt-6 hidden gap-4 sm:grid sm:grid-cols-3">
            {FEATURE_STRIP.map((item) => (
              <li key={item.label} className="flex flex-col items-center gap-2 text-center text-xs text-muted-foreground">
                <span className="flex size-9 items-center justify-center rounded-full bg-accent text-accent-foreground">
                  <item.icon className="size-4" />
                </span>
                {item.label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
