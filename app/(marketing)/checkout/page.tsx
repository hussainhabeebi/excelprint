import type { Metadata } from "next";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/current-user";
import { getActiveCart, listCartItems } from "@/lib/cart/queries";
import { listActiveDeliveryMethods } from "@/lib/checkout/delivery";
import { listAddresses } from "@/lib/customer/addresses";
import { LoginForm } from "@/components/auth/login-form";
import { Button } from "@/components/ui/button";
import { CheckoutForm } from "@/components/checkout/checkout-form";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Checkout" };

export default async function CheckoutPage() {
  const user = await getCurrentUser();

  if (!user || user.type !== "customer") {
    return (
      <div className="mx-auto max-w-sm px-4 py-16">
        <h1 className="mb-6 text-xl font-semibold">Log in to check out</h1>
        <LoginForm />
      </div>
    );
  }

  const cart = await getActiveCart(user.id);
  const items = cart ? await listCartItems(cart.id) : [];

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="text-2xl font-semibold">Your cart is empty</h1>
        <p className="mt-2 text-muted-foreground">Add a product before checking out.</p>
        <Button asChild variant="brand" className="mt-6">
          <Link href="/products">Browse products</Link>
        </Button>
      </div>
    );
  }

  const [deliveryOptions, savedAddresses] = await Promise.all([listActiveDeliveryMethods(), listAddresses(user.id)]);
  const subtotalCents = items.reduce((sum, item) => sum + item.totalPriceCents, 0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-2 text-2xl font-semibold tracking-tight">Checkout</h1>
      <p className="mb-8 text-muted-foreground">
        {items.length} item{items.length === 1 ? "" : "s"} ·{" "}
        <Link href="/cart" className="text-brand hover:underline">
          Edit cart
        </Link>
      </p>

      {deliveryOptions.length === 0 ? (
        <p className="text-muted-foreground">
          No delivery methods are configured yet. Please{" "}
          <Link href="/quote" className="text-brand hover:underline">
            contact us
          </Link>{" "}
          to complete your order.
        </p>
      ) : (
        <CheckoutForm deliveryOptions={deliveryOptions} savedAddresses={savedAddresses} subtotalCents={subtotalCents} />
      )}
    </div>
  );
}
