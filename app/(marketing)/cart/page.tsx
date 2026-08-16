import type { Metadata } from "next";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/current-user";
import { getActiveCart, listCartItems } from "@/lib/cart/queries";
import { changeCartItemQuantityAction, removeCartItemAction } from "@/lib/cart/actions";
import { ProductIllustration } from "@/components/products/product-illustration";
import { LoginForm } from "@/components/auth/login-form";
import { Button } from "@/components/ui/button";
import { formatMoneyAed } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Your Cart" };

export default async function CartPage() {
  const user = await getCurrentUser();

  if (!user || user.type !== "customer") {
    return (
      <div className="mx-auto max-w-sm px-4 py-16">
        <h1 className="mb-6 text-xl font-semibold">Log in to view your cart</h1>
        <LoginForm />
      </div>
    );
  }

  const cart = await getActiveCart(user.id);
  const items = cart ? await listCartItems(cart.id) : [];
  const subtotalCents = items.reduce((sum, item) => sum + item.totalPriceCents, 0);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="text-2xl font-semibold">Your cart is empty</h1>
        <p className="mt-2 text-muted-foreground">Configure a product to add it to your cart.</p>
        <Button asChild variant="brand" className="mt-6">
          <Link href="/products">Browse products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 pb-32 sm:px-6 lg:px-8 lg:pb-10">
      <h1 className="text-2xl font-semibold tracking-tight">Your Cart</h1>

      <ul className="mt-6 divide-y divide-border border-y border-border">
        {items.map((item) => (
          <li key={item.id} className="flex gap-4 py-5">
            <ProductIllustration slug={item.productSlug} className="size-20 shrink-0 rounded-lg" iconClassName="size-8" />
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Link href={`/product/${item.productSlug}`} className="font-medium hover:text-brand">
                    {item.productName}
                  </Link>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.configuration.displayLines.map((line, i) => (
                      <span key={line.label}>
                        {i > 0 && " · "}
                        {line.label}: {line.value}
                      </span>
                    ))}
                  </p>
                </div>
                <p className="whitespace-nowrap font-semibold">{formatMoneyAed(item.totalPriceCents)}</p>
              </div>

              <div className="mt-3 flex items-center gap-3">
                <form action={changeCartItemQuantityAction.bind(null, item.id, item.quantity - 1)}>
                  <button
                    type="submit"
                    className="flex size-8 items-center justify-center rounded-md border border-input hover:bg-secondary"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                </form>
                <span className="w-10 text-center text-sm">{item.quantity}</span>
                <form action={changeCartItemQuantityAction.bind(null, item.id, item.quantity + 1)}>
                  <button
                    type="submit"
                    className="flex size-8 items-center justify-center rounded-md border border-input hover:bg-secondary"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </form>
                <form action={removeCartItemAction.bind(null, item.id)} className="ml-auto">
                  <button type="submit" className="text-sm text-muted-foreground hover:text-destructive">
                    Remove
                  </button>
                </form>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex justify-end">
        <div className="w-full max-w-xs space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Subtotal</span>
            <span>{formatMoneyAed(subtotalCents)}</span>
          </div>
          <p className="text-xs text-muted-foreground">Delivery &amp; VAT calculated at checkout</p>
          <Button asChild variant="brand" size="lg" className="mt-2 w-full">
            <Link href="/checkout">Proceed to Checkout</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
