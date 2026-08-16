import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { getOwnedProofForOrderItem } from "@/lib/proofing/customer-queries";
import { ProofReview } from "@/components/proofing/proof-review";
import { approveProofAction, requestProofChangesAction } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Review Your Proof" };

export default async function ProofReviewPage({
  params,
}: {
  params: Promise<{ orderNumber: string; orderItemId: string }>;
}) {
  const user = await getCurrentUser();
  if (!user || user.type !== "customer") redirect("/orders");

  const { orderNumber, orderItemId } = await params;
  const result = await getOwnedProofForOrderItem(orderItemId, user.id);
  if (!result || result.order.orderNumber !== orderNumber) notFound();

  const { item, version, proof, comments } = result;

  if (!version || !proof) {
    return (
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">No proof yet</h1>
        <p className="mt-2 text-muted-foreground">
          We haven&apos;t sent a proof for {item.productNameSnapshot} yet. We&apos;ll email you as soon as it&apos;s
          ready to review.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Review Your Proof</h1>
      <p className="mt-1 text-muted-foreground">{item.productNameSnapshot}</p>

      <div className="mt-8">
        <ProofReview
          fileUrl={`/api/artwork/${version.id}`}
          fileName={version.fileName}
          versionNumber={version.versionNumber}
          proofStatus={proof.status}
          comments={comments}
          approveAction={approveProofAction.bind(null, orderNumber, orderItemId)}
          requestChangesAction={requestProofChangesAction.bind(null, orderNumber, orderItemId)}
        />
      </div>
    </div>
  );
}
