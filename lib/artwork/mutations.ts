import "server-only";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { artworks, artworkVersions, orderItems } from "@/db/schema";
import { listArtworkVersions } from "./queries";
import { writeAuditLog } from "@/lib/security/audit";
import type { ArtworkSource, ArtworkStatus } from "@/lib/orders/constants";

export class ArtworkError extends Error {}

interface AddArtworkVersionInput {
  artworkId: string;
  source: ArtworkSource;
  fileKey: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  uploadedByType: "CUSTOMER" | "STAFF" | "SYSTEM";
  uploadedById?: string;
  notes?: string;
  status: ArtworkStatus;
}

/**
 * Appends a new artwork_versions row and repoints artworks.currentVersionId
 * at it. Never updates or deletes an existing artwork_versions row —
 * AGENTS.md rule "never overwrite artwork versions."
 */
export async function addArtworkVersion(input: AddArtworkVersionInput) {
  const db = getDb();
  const existingVersions = await listArtworkVersions(input.artworkId);
  const versionNumber = existingVersions.length + 1;

  const versionId = crypto.randomUUID();
  await db.insert(artworkVersions).values({
    id: versionId,
    artworkId: input.artworkId,
    versionNumber,
    source: input.source,
    fileKey: input.fileKey,
    fileName: input.fileName,
    mimeType: input.mimeType,
    sizeBytes: input.sizeBytes,
    uploadedByType: input.uploadedByType,
    uploadedById: input.uploadedById,
    notes: input.notes,
    status: input.status,
  });

  await db.update(artworks).set({ currentVersionId: versionId, status: input.status }).where(eq(artworks.id, input.artworkId));

  await writeAuditLog({
    actorType: input.uploadedByType,
    actorId: input.uploadedById,
    action: "ARTWORK_VERSION_ADDED",
    entityType: "artwork_version",
    entityId: versionId,
    newValue: { artworkId: input.artworkId, versionNumber, source: input.source, status: input.status },
  });

  return versionId;
}

export async function updateOrderItemArtworkStatus(orderItemId: string, status: ArtworkStatus) {
  const db = getDb();
  await db.update(orderItems).set({ artworkStatus: status }).where(eq(orderItems.id, orderItemId));
}
