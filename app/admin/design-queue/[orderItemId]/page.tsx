import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { requireStaffSection } from "@/lib/auth/rbac";
import { getDesignQueueItem } from "@/lib/proofing/design-queue-queries";
import { ProofUploadForm } from "@/components/admin/proof-upload-form";
import { submitProofAction } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Design Item" };

export default async function AdminDesignQueueItemPage({ params }: { params: Promise<{ orderItemId: string }> }) {
  const user = await getCurrentUser();
  requireStaffSection(user, "design-queue");

  const { orderItemId } = await params;
  const result = await getDesignQueueItem(orderItemId);
  if (!result) notFound();

  const { item, order, customerEmail, customerFirstName, customerLastName, versions, designRequest, comments } =
    result;

  return (
    <div>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{item.productNameSnapshot}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Order {order.orderNumber} · {customerFirstName} {customerLastName} ({customerEmail})
        </p>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {designRequest && (
            <div className="rounded-lg border border-border p-4">
              <h2 className="text-sm font-semibold text-muted-foreground">Design Brief</h2>
              <dl className="mt-3 space-y-2 text-sm">
                {designRequest.companyName && (
                  <div>
                    <dt className="text-xs uppercase text-muted-foreground">Company</dt>
                    <dd>{designRequest.companyName}</dd>
                  </div>
                )}
                {designRequest.contentText && (
                  <div>
                    <dt className="text-xs uppercase text-muted-foreground">Text / content</dt>
                    <dd className="whitespace-pre-wrap">{designRequest.contentText}</dd>
                  </div>
                )}
                {designRequest.contactInfo && (
                  <div>
                    <dt className="text-xs uppercase text-muted-foreground">Contact info to display</dt>
                    <dd>{designRequest.contactInfo}</dd>
                  </div>
                )}
                {designRequest.preferredColors && (
                  <div>
                    <dt className="text-xs uppercase text-muted-foreground">Preferred colors</dt>
                    <dd>{designRequest.preferredColors}</dd>
                  </div>
                )}
                {designRequest.stylePreference && (
                  <div>
                    <dt className="text-xs uppercase text-muted-foreground">Style</dt>
                    <dd>{designRequest.stylePreference}</dd>
                  </div>
                )}
                {designRequest.designNotes && (
                  <div>
                    <dt className="text-xs uppercase text-muted-foreground">Notes</dt>
                    <dd className="whitespace-pre-wrap">{designRequest.designNotes}</dd>
                  </div>
                )}
              </dl>
            </div>
          )}

          <div className="rounded-lg border border-border p-4">
            <h2 className="text-sm font-semibold text-muted-foreground">Version History</h2>
            <ul className="mt-3 divide-y divide-border">
              {versions.map((version) => (
                <li key={version.id} className="flex items-center justify-between py-2 text-sm">
                  <div>
                    <a
                      href={`/api/artwork/${version.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-brand hover:underline"
                    >
                      v{version.versionNumber} — {version.fileName}
                    </a>
                    <p className="text-xs text-muted-foreground">
                      {version.source === "CUSTOMER_UPLOAD" ? "Customer upload" : "Designer upload"} ·{" "}
                      {new Date(version.createdAt).toLocaleString()}
                    </p>
                  </div>
                </li>
              ))}
              {versions.length === 0 && <li className="py-2 text-sm text-muted-foreground">No files yet.</li>}
            </ul>
          </div>

          {comments.length > 0 && (
            <div className="rounded-lg border border-border p-4">
              <h2 className="text-sm font-semibold text-muted-foreground">Customer Feedback</h2>
              <ul className="mt-3 space-y-3">
                {comments.map((comment) => (
                  <li key={comment.id} className="text-sm">
                    <span className="font-medium">
                      {comment.authorType === "CUSTOMER" ? "Customer" : "Staff"}:
                    </span>{" "}
                    {comment.comment}
                    <span className="ml-2 text-xs text-muted-foreground">
                      {new Date(comment.createdAt).toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border border-border p-4">
            <h2 className="text-sm font-semibold text-muted-foreground">Send Proof</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Uploading a file here sends it to the customer as the current proof for review.
            </p>
            <div className="mt-3">
              <ProofUploadForm action={submitProofAction.bind(null, orderItemId)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
