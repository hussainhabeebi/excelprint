/**
 * R2 key conventions (spec section 26). Keyed by order/customer so access
 * control can be enforced by resolving the key back to an owning
 * order/customer — see app/api/artwork/[versionId]/route.ts, which is the
 * only path that ever reads these back out.
 */

export function artworkUploadKey(orderId: string, orderItemId: string, fileName: string): string {
  return `orders/${orderId}/uploads/${orderItemId}/${crypto.randomUUID()}-${sanitizeFileName(fileName)}`;
}

export function designReferenceKey(designRequestId: string, fileName: string): string {
  return `orders/design-requests/${designRequestId}/${crypto.randomUUID()}-${sanitizeFileName(fileName)}`;
}

function sanitizeFileName(fileName: string): string {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-150);
}
