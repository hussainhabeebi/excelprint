import Link from "next/link";
import { Button } from "@/components/ui/button";

export function MobileStickyCta() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 p-3 backdrop-blur supports-[backdrop-filter]:bg-background/85 sm:hidden">
      <Button asChild variant="brand" size="lg" className="w-full">
        <Link href="/products">Start Your Order</Link>
      </Button>
    </div>
  );
}
