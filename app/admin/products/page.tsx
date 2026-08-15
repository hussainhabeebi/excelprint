import type { Metadata } from "next";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/current-user";
import { requireStaffSection } from "@/lib/auth/rbac";
import { adminListProducts } from "@/lib/catalog/admin-queries";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatMoneyAed } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Products" };

export default async function AdminProductsPage() {
  const user = await getCurrentUser();
  requireStaffSection(user, "products");

  const products = await adminListProducts();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Products</h1>
          <p className="mt-1 text-muted-foreground">Manage the print product catalog.</p>
        </div>
        <Button asChild variant="brand">
          <Link href="/admin/products/new">New Product</Link>
        </Button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 text-left text-xs font-medium uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Starting price</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-4 py-3 font-medium">
                  {product.name}
                  {product.isFeatured && (
                    <Badge variant="brand" className="ml-2">
                      Featured
                    </Badge>
                  )}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{product.categoryName}</td>
                <td className="px-4 py-3 text-muted-foreground">{formatMoneyAed(product.startingPriceCents)}</td>
                <td className="px-4 py-3">
                  <Badge variant={product.isActive ? "success" : "secondary"}>
                    {product.isActive ? "Active" : "Inactive"}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/products/${product.id}/edit`} className="text-brand hover:underline">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">
                  No products yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
