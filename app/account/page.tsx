import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "My Account" };

export default function AccountDashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      <p className="mt-1 text-muted-foreground">Your active orders and proofs will appear here.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Active orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">0</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Proofs awaiting approval</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">0</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Saved designs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">0</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
