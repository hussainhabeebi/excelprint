import { CheckCircle2, CreditCard, Sliders, Truck, Upload } from "lucide-react";

const STEPS = [
  { icon: Sliders, title: "Choose & configure", description: "Pick a product and set size, paper, finish and quantity." },
  { icon: Upload, title: "Design it", description: "Upload your artwork, request a designer, or generate an AI draft." },
  { icon: CheckCircle2, title: "Approve your proof", description: "Review the print-ready proof and approve before we print." },
  { icon: CreditCard, title: "Pay securely", description: "Checkout with Stripe once your artwork is approved." },
  { icon: Truck, title: "Track & receive", description: "Follow production status through pickup or delivery." },
];

export function ProcessSteps() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 max-w-2xl">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">How it works</h2>
        <p className="mt-2 text-muted-foreground">
          A straightforward path from idea to finished print — no back-and-forth emails required.
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
        {STEPS.map((step, index) => (
          <div key={step.title} className="relative rounded-xl border border-border p-5">
            <span className="absolute -top-3 -left-3 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
              {index + 1}
            </span>
            <step.icon className="size-6 text-brand" strokeWidth={1.75} />
            <h3 className="mt-3 font-semibold">{step.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
