import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { getCustomerOrderByNumber } from "@/lib/orders/customer-queries";
import { DesignMethodPicker } from "@/components/design/design-method-picker";
import { uploadArtworkAction, requestDesignAction } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Choose Design Method" };

export default async function DesignMethodPage({
  params,
}: {
  params: Promise<{ orderNumber: string; orderItemId: string }>;
}) {
  const user = await getCurrentUser();
  if (!user || user.type !== "customer") redirect("/orders");

  const { orderNumber, orderItemId } = await params;
  const result = await getCustomerOrderByNumber(user.id, orderNumber);
  if (!result) notFound();

  const item = result.items.find((i) => i.id === orderItemId);
  if (!item) notFound();

  if (item.designMethod) {
    redirect(`/orders/${orderNumber}`);
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">How would you like to provide your design?</h1>
      <p className="mt-1 text-muted-foreground">For {item.productNameSnapshot} — order {orderNumber}</p>

      <div className="mt-8">
        <DesignMethodPicker
          uploadAction={uploadArtworkAction.bind(null, orderNumber, orderItemId)}
          requestAction={requestDesignAction.bind(null, orderNumber, orderItemId)}
        />
      </div>
    </div>
  );
}
