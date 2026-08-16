"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/current-user";
import {
  CartError,
  addToCart as addToCartMutation,
  removeCartItem as removeCartItemMutation,
  updateCartItemQuantity as updateCartItemQuantityMutation,
} from "./mutations";
import type { ConfiguratorSelections } from "@/lib/pricing/configurator";

export interface CartActionState {
  error: string | null;
}

async function requireCustomer(returnTo: string) {
  const user = await getCurrentUser();
  if (!user || user.type !== "customer") {
    redirect(`/login?redirect=${encodeURIComponent(returnTo)}`);
  }
  return user;
}

export async function addToCartAction(
  productSlug: string,
  selections: ConfiguratorSelections,
): Promise<CartActionState> {
  const user = await requireCustomer(`/configure/${productSlug}`);

  try {
    await addToCartMutation(user.id, productSlug, selections);
  } catch (error) {
    if (error instanceof CartError) return { error: error.message };
    throw error;
  }

  redirect("/cart");
}

export async function changeCartItemQuantityAction(cartItemId: string, quantity: number): Promise<void> {
  const user = await requireCustomer("/cart");

  if (quantity < 1) {
    await removeCartItemMutation(user.id, cartItemId);
  } else {
    await updateCartItemQuantityMutation(user.id, cartItemId, quantity);
  }

  revalidatePath("/cart");
}

export async function removeCartItemAction(cartItemId: string): Promise<void> {
  const user = await requireCustomer("/cart");
  await removeCartItemMutation(user.id, cartItemId);
  revalidatePath("/cart");
}
