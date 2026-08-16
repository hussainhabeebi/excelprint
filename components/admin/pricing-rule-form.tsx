"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { PricingRuleFormState } from "@/app/admin/pricing/actions";
import type { pricingRules } from "@/db/schema";

type PricingRule = typeof pricingRules.$inferSelect;

const RULE_TYPES = [
  "MATERIAL",
  "PRINTING",
  "FINISH",
  "ADDON",
  "DESIGN_FEE",
  "URGENCY",
  "DELIVERY",
  "DISCOUNT",
  "CUSTOM",
] as const;

interface PricingRuleFormProps {
  action: (state: PricingRuleFormState, formData: FormData) => Promise<PricingRuleFormState>;
  rule?: PricingRule;
  products: { id: string; name: string }[];
}

function toDateInputValue(date: Date | null | undefined): string {
  if (!date) return "";
  return new Date(date).toISOString().slice(0, 10);
}

export function PricingRuleForm({ action, rule, products }: PricingRuleFormProps) {
  const [state, formAction, pending] = useActionState<PricingRuleFormState, FormData>(action, { error: null });

  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" defaultValue={rule?.name} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="productId">Applies to product</Label>
          <select
            id="productId"
            name="productId"
            defaultValue={rule?.productId ?? ""}
            className="flex h-11 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">All products (global)</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="ruleType">Rule type</Label>
          <select
            id="ruleType"
            name="ruleType"
            defaultValue={rule?.ruleType ?? "URGENCY"}
            className="flex h-11 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {RULE_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="modifierType">Modifier type</Label>
          <select
            id="modifierType"
            name="modifierType"
            defaultValue={rule?.modifierType ?? "PERCENT"}
            className="flex h-11 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="FIXED">Fixed (AED)</option>
            <option value="PERCENT">Percent (%)</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <Input id="priority" name="priority" type="number" defaultValue={rule?.priority ?? 0} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="amountCents">Fixed amount (AED)</Label>
          <Input
            id="amountCents"
            name="amountCents"
            type="number"
            step="0.01"
            defaultValue={rule ? (rule.amountCents / 100).toFixed(2) : "0"}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="amountPercent">Percent (%)</Label>
          <Input
            id="amountPercent"
            name="amountPercent"
            type="number"
            step="0.01"
            defaultValue={rule?.amountPercent ?? 0}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="appliesTo">Applies-to condition (advanced, JSON)</Label>
        <Textarea
          id="appliesTo"
          name="appliesTo"
          rows={2}
          defaultValue={rule?.appliesTo ? JSON.stringify(rule.appliesTo) : ""}
          placeholder='e.g. {"productionSpeed":"express"}'
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="startsAt">Starts (optional)</Label>
          <Input id="startsAt" name="startsAt" type="date" defaultValue={toDateInputValue(rule?.startsAt)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endsAt">Ends (optional)</Label>
          <Input id="endsAt" name="endsAt" type="date" defaultValue={toDateInputValue(rule?.endsAt)} />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="isActive"
          defaultChecked={rule?.isActive ?? true}
          className="size-4 rounded border-input"
        />
        Active
      </label>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}

      <Button type="submit" variant="brand" disabled={pending}>
        {pending ? "Saving…" : rule ? "Save changes" : "Create rule"}
      </Button>
    </form>
  );
}
