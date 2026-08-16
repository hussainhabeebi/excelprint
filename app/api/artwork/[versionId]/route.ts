import { NextResponse, type NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth/current-user";
import { getArtworkVersionWithOwner } from "@/lib/artwork/queries";
import { getArtworkBucket } from "@/lib/r2/client";

/**
 * The only path that ever reads an artwork file back out of R2 — the
 * bucket itself is never public. Access is limited to the order's own
 * customer or any authenticated staff member; AGENTS.md: "customer must
 * not gain access to another customer's artwork."
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ versionId: string }> }) {
  const { versionId } = await params;
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const record = await getArtworkVersionWithOwner(versionId);
  if (!record) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const isOwningCustomer = user.type === "customer" && user.id === record.order.customerId;
  const isStaff = user.type === "staff";
  if (!isOwningCustomer && !isStaff) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const bucket = getArtworkBucket();
  const object = await bucket.get(record.version.fileKey);
  if (!object) {
    return NextResponse.json({ error: "File not found in storage." }, { status: 404 });
  }

  return new NextResponse(object.body, {
    headers: {
      "Content-Type": record.version.mimeType,
      "Content-Disposition": `inline; filename="${record.version.fileName.replace(/"/g, "")}"`,
      "Cache-Control": "private, max-age=3600",
    },
  });
}
