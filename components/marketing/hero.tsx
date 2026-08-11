import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="border-b border-border bg-secondary/30">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-24 lg:px-8">
        <div>
          <span className="inline-flex items-center rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
            Printing &amp; branding in Ajman, UAE
          </span>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Print Anything. Design It. Approve It. Get It Delivered.
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
          <p className="mt-6 text-sm text-muted-foreground">
            Choose a product → Configure specs → Design or upload artwork → Approve your proof → Pay securely → Track
            production.
          </p>
        </div>

        <div className="relative">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 flex h-40 items-center justify-center rounded-xl border border-border bg-background shadow-sm">
              <span className="text-sm font-medium text-muted-foreground">Live price preview as you configure</span>
            </div>
            <div className="flex h-32 items-center justify-center rounded-xl border border-border bg-background shadow-sm">
              <span className="text-sm font-medium text-muted-foreground">Upload or generate artwork</span>
            </div>
            <div className="flex h-32 items-center justify-center rounded-xl border border-border bg-background shadow-sm">
              <span className="text-sm font-medium text-muted-foreground">Approve your proof</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
