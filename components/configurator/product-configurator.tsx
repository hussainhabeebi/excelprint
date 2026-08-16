"use client";

import { useMemo, useState, useTransition } from "react";
import { ShoppingCart, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, formatMoneyAed } from "@/lib/utils";
import { computeConfiguredPrice, type ConfiguratorSchema } from "@/lib/pricing/configurator";
import { addToCartAction } from "@/lib/cart/actions";

function defaultSelections(schema: ConfiguratorSchema): string[] {
  return schema.options
    .map((option) => {
      const explicitDefault = option.values.find((v) => v.isDefault)?.id;
      if (explicitDefault) return explicitDefault;
      // Only single-select options need an implicit fallback (something must
      // always be chosen); multi-select add-ons correctly start unselected.
      return option.type === "SINGLE_SELECT" ? option.values[0]?.id : undefined;
    })
    .filter((id): id is string => Boolean(id));
}

export function ProductConfigurator({ schema }: { schema: ConfiguratorSchema }) {
  const [optionValueIds, setOptionValueIds] = useState<string[]>(() => defaultSelections(schema));
  const [quantity, setQuantity] = useState(schema.quantityTiers[0]?.quantity ?? 0);
  const [productionSpeed, setProductionSpeed] = useState<"standard" | "express">("standard");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const { breakdown } = useMemo(
    () => computeConfiguredPrice(schema, { optionValueIds, quantity, productionSpeed }),
    [schema, optionValueIds, quantity, productionSpeed],
  );

  function selectSingle(optionId: string, valueId: string) {
    const otherOptionValueIds = schema.options
      .filter((o) => o.id !== optionId)
      .flatMap((o) => o.values.map((v) => v.id))
      .filter((id) => optionValueIds.includes(id));
    setOptionValueIds([...otherOptionValueIds, valueId]);
  }

  function toggleMulti(valueId: string) {
    setOptionValueIds((prev) => (prev.includes(valueId) ? prev.filter((id) => id !== valueId) : [...prev, valueId]));
  }

  function handleAddToCart() {
    setError(null);
    startTransition(async () => {
      const result = await addToCartAction(schema.productSlug, { optionValueIds, quantity, productionSpeed });
      if (result?.error) setError(result.error);
    });
  }

  const addToCartButton = (
    <Button size="lg" variant="brand" onClick={handleAddToCart} disabled={isPending} className="w-full sm:w-auto">
      {isPending ? "Adding…" : "Add to Cart"}
      <ShoppingCart />
    </Button>
  );

  return (
    <div className="grid gap-10 pb-28 lg:grid-cols-3 lg:pb-0">
      <div className="space-y-8 lg:col-span-2">
        {schema.options.map((option) => (
          <fieldset key={option.id}>
            <legend className="mb-3 text-sm font-semibold">
              {option.name}
              {option.isRequired && <span className="text-destructive"> *</span>}
            </legend>
            <div className="flex flex-wrap gap-2">
              {option.values.map((value) => {
                const selected = optionValueIds.includes(value.id);
                return (
                  <button
                    key={value.id}
                    type="button"
                    onClick={() => (option.type === "MULTI_SELECT" ? toggleMulti(value.id) : selectSingle(option.id, value.id))}
                    className={cn(
                      "rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors",
                      selected
                        ? "border-brand bg-brand text-brand-foreground"
                        : "border-input bg-background text-foreground hover:border-brand/50",
                    )}
                    aria-pressed={selected}
                  >
                    {value.label}
                    {value.priceModifierType === "FIXED" && value.priceModifierCents > 0 && (
                      <span className="ml-1.5 opacity-70">+{formatMoneyAed(value.priceModifierCents)}</span>
                    )}
                    {value.priceModifierType === "PERCENT" && value.priceModifierPercent > 0 && (
                      <span className="ml-1.5 opacity-70">+{value.priceModifierPercent}%</span>
                    )}
                  </button>
                );
              })}
            </div>
          </fieldset>
        ))}

        <fieldset>
          <legend className="mb-3 text-sm font-semibold">Quantity</legend>
          <div className="flex flex-wrap gap-2">
            {schema.quantityTiers.map((tier) => (
              <button
                key={tier.id}
                type="button"
                onClick={() => setQuantity(tier.quantity)}
                className={cn(
                  "rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors",
                  quantity === tier.quantity
                    ? "border-brand bg-brand text-brand-foreground"
                    : "border-input bg-background text-foreground hover:border-brand/50",
                )}
                aria-pressed={quantity === tier.quantity}
              >
                {tier.quantity.toLocaleString()}
              </button>
            ))}
          </div>
        </fieldset>

        {schema.expressModifier && (
          <fieldset>
            <legend className="mb-3 text-sm font-semibold">Production Speed</legend>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setProductionSpeed("standard")}
                className={cn(
                  "rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors",
                  productionSpeed === "standard"
                    ? "border-brand bg-brand text-brand-foreground"
                    : "border-input bg-background text-foreground hover:border-brand/50",
                )}
                aria-pressed={productionSpeed === "standard"}
              >
                Standard
              </button>
              <button
                type="button"
                onClick={() => setProductionSpeed("express")}
                className={cn(
                  "flex items-center gap-1 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors",
                  productionSpeed === "express"
                    ? "border-brand bg-brand text-brand-foreground"
                    : "border-input bg-background text-foreground hover:border-brand/50",
                )}
                aria-pressed={productionSpeed === "express"}
              >
                <Zap className="size-3.5" />
                Express
              </button>
            </div>
          </fieldset>
        )}

        {error && <p className="text-sm text-destructive lg:hidden">{error}</p>}
      </div>

      {/* Desktop summary sidebar */}
      <div className="hidden lg:block">
        <div className="sticky top-24 rounded-xl border border-border bg-secondary/30 p-6">
          <PriceBreakdown breakdown={breakdown} currency={schema.currency} />
          {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
          <div className="mt-6">{addToCartButton}</div>
        </div>
      </div>

      {/* Mobile sticky summary bar */}
      <div className="fixed inset-x-0 bottom-16 z-30 border-t border-border bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/85 sm:bottom-0 lg:hidden">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Total (excl. delivery)</p>
            <p className="text-lg font-semibold">{formatMoneyAed(breakdown.totalCents)}</p>
          </div>
          {addToCartButton}
        </div>
      </div>
    </div>
  );
}

function PriceBreakdown({ breakdown, currency }: { breakdown: ReturnType<typeof computeConfiguredPrice>["breakdown"]; currency: string }) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-muted-foreground">Price Summary</h2>
      <dl className="mt-3 space-y-1.5 text-sm">
        {breakdown.lineItems.map((item) => (
          <div key={item.key} className="flex items-center justify-between">
            <dt className="text-muted-foreground">{item.label}</dt>
            <dd>{formatMoneyAed(item.amountCents)}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
        <span className="font-semibold">Total</span>
        <span className="text-xl font-semibold">{formatMoneyAed(breakdown.totalCents)}</span>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">{currency} · Delivery calculated at checkout</p>
    </div>
  );
}
