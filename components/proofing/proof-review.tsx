"use client";

import { useActionState, useState } from "react";
import { CheckCircle2, FileText, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { ProofActionState } from "@/app/orders/[orderNumber]/proof/[orderItemId]/actions";
import { PROOF_APPROVAL_STATEMENT } from "@/lib/proofing/constants";

interface ProofComment {
  id: string;
  authorType: "CUSTOMER" | "STAFF";
  comment: string;
  createdAt: Date;
}

interface ProofReviewProps {
  fileUrl: string;
  fileName: string;
  versionNumber: number;
  proofStatus: "PENDING" | "SENT" | "CHANGES_REQUESTED" | "APPROVED";
  comments: ProofComment[];
  approveAction: (state: ProofActionState, formData: FormData) => Promise<ProofActionState>;
  requestChangesAction: (state: ProofActionState, formData: FormData) => Promise<ProofActionState>;
}

export function ProofReview({
  fileUrl,
  fileName,
  versionNumber,
  proofStatus,
  comments,
  approveAction,
  requestChangesAction,
}: ProofReviewProps) {
  const [mode, setMode] = useState<"view" | "changes">("view");
  const [approveState, approveFormAction, approvePending] = useActionState<ProofActionState, FormData>(
    approveAction,
    { error: null },
  );
  const [changesState, changesFormAction, changesPending] = useActionState<ProofActionState, FormData>(
    requestChangesAction,
    { error: null },
  );

  if (proofStatus === "APPROVED") {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-900">
        <CheckCircle2 className="size-6" />
        <p className="mt-2 font-medium">You&apos;ve approved this artwork.</p>
        <p className="mt-1 text-sm text-emerald-800">We&apos;ll be in touch about payment and production next.</p>
      </div>
    );
  }

  if (proofStatus === "CHANGES_REQUESTED") {
    return (
      <div className="space-y-4">
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-amber-900">
          <MessageSquare className="size-6" />
          <p className="mt-2 font-medium">We received your requested changes.</p>
          <p className="mt-1 text-sm text-amber-800">
            Our designer is working on a revised proof — we&apos;ll email you as soon as it&apos;s ready to review.
          </p>
        </div>
        {comments.length > 0 && (
          <div className="rounded-xl border border-border p-6">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <MessageSquare className="size-4" /> Conversation
            </h2>
            <ul className="mt-3 space-y-3">
              {comments.map((comment) => (
                <li key={comment.id} className="text-sm">
                  <span className="font-medium">{comment.authorType === "CUSTOMER" ? "You" : "Excel Printing"}:</span>{" "}
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
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        <div className="rounded-xl border border-border p-6">
          <div className="flex items-center gap-3">
            <FileText className="size-6 text-brand" />
            <div>
              <p className="font-medium">{fileName}</p>
              <p className="text-xs text-muted-foreground">Proof version {versionNumber}</p>
            </div>
          </div>
          <Button asChild variant="outline" className="mt-4">
            <a href={fileUrl} target="_blank" rel="noopener noreferrer">
              View / Download Proof
            </a>
          </Button>
        </div>

        {comments.length > 0 && (
          <div className="rounded-xl border border-border p-6">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <MessageSquare className="size-4" /> Conversation
            </h2>
            <ul className="mt-3 space-y-3">
              {comments.map((comment) => (
                <li key={comment.id} className="text-sm">
                  <span className="font-medium">{comment.authorType === "CUSTOMER" ? "You" : "Excel Printing"}:</span>{" "}
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

      <div className="space-y-4">
        {mode === "view" && (
          <div className="space-y-3 rounded-xl border border-border p-6">
            <h2 className="text-sm font-semibold text-muted-foreground">Ready to decide?</h2>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => setMode("changes")}
            >
              Request Changes
            </Button>
          </div>
        )}

        <div className="rounded-xl border border-border p-6">
          <form action={approveFormAction} className="space-y-3">
            <label className="flex items-start gap-2 text-xs text-muted-foreground">
              <input type="checkbox" name="confirmed" required className="mt-0.5 size-4 rounded border-input" />
              {PROOF_APPROVAL_STATEMENT}
            </label>
            {approveState.error && <p className="text-sm text-destructive">{approveState.error}</p>}
            <Button type="submit" variant="brand" className="w-full" disabled={approvePending}>
              {approvePending ? "Approving…" : "Approve Artwork"}
            </Button>
          </form>
        </div>

        {mode === "changes" && (
          <form action={changesFormAction} className="space-y-3 rounded-xl border border-border p-6">
            <h2 className="text-sm font-semibold text-muted-foreground">What needs to change?</h2>
            <Textarea name="comment" rows={4} required placeholder="Describe the changes you'd like…" />
            {changesState.error && <p className="text-sm text-destructive">{changesState.error}</p>}
            <div className="flex gap-2">
              <Button type="submit" variant="brand" disabled={changesPending}>
                {changesPending ? "Sending…" : "Send Request"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setMode("view")}>
                Cancel
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
