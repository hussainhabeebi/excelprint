import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "Admin Dashboard" };

const SUMMARY_TILES = [
  "Orders today",
  "Revenue today",
  "Revenue this month",
  "Awaiting artwork",
  "Design pending",
  "Proof approval pending",
  "Ready for production",
  "Printing",
  "Ready for delivery",
  "Failed payments",
  "Average order value",
];

/**
 * Placeholder dashboard shell — Phase 9 (admin operations) wires these
 * tiles to real aggregate queries against orders/order_items/payments.
 */
export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      <p className="mt-1 text-muted-foreground">Business overview — live metrics arrive in a later phase.</p>

      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {SUMMARY_TILES.map((label) => (
          <Card key={label}>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">—</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
