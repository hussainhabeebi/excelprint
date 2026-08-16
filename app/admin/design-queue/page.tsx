import type { Metadata } from "next";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/current-user";
import { requireStaffSection } from "@/lib/auth/rbac";
import { listDesignQueue } from "@/lib/proofing/design-queue-queries";
import { Badge } from "@/components/ui/badge";
import type { ArtworkStatus } from "@/lib/orders/constants";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Design Queue" };

const ARTWORK_STATUS_LABELS: Record<ArtworkStatus, string> = {
  ARTWORK_REQUIRED: "Awaiting Customer",
  ARTWORK_RECEIVED: "Ready for Review",
  DESIGN_IN_PROGRESS: "In Progress",
  PROOF_READY: "Proof Sent",
  CHANGE_REQUESTED: "Changes Requested",
  REVISION_IN_PROGRESS: "Revision In Progress",
  FINAL_PROOF_READY: "Final Proof Sent",
  APPROVED: "Approved",
  PRINT_READY: "Print Ready",
};

function queueBadgeVariant(status: ArtworkStatus) {
  if (status === "CHANGE_REQUESTED") return "warning" as const;
  if (status === "ARTWORK_RECEIVED") return "brand" as const;
  return "secondary" as const;
}

export default async function AdminDesignQueuePage() {
  const user = await getCurrentUser();
  requireStaffSection(user, "design-queue");

  const queue = await listDesignQueue();

  return (
    <div>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Design Queue</h1>
        <p className="mt-1 text-muted-foreground">Order items waiting on design work or customer review.</p>
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 text-left text-xs font-medium uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Method</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Updated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {queue.map((row) => (
              <tr key={row.item.id} className="hover:bg-accent/30">
                <td className="px-4 py-3 font-medium">
                  <Link href={`/admin/design-queue/${row.item.id}`} className="text-brand hover:underline">
                    {row.orderNumber}
                  </Link>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{row.item.productNameSnapshot}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {row.customerFirstName} {row.customerLastName}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {row.item.designMethod === "UPLOAD" ? "Customer Upload" : "Design Request"}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={queueBadgeVariant(row.item.artworkStatus)}>
                    {ARTWORK_STATUS_LABELS[row.item.artworkStatus]}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {new Date(row.item.updatedAt).toLocaleString()}
                </td>
              </tr>
            ))}
            {queue.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                  Nothing in the design queue right now.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
