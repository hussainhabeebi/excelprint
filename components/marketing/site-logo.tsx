import Image from "next/image";
import { cn } from "@/lib/utils";

export function SiteLogo({ className, iconSize = 32 }: { className?: string; iconSize?: number }) {
  return (
    <span className={cn("flex items-center gap-2", className)}>
      <Image
        src="/logo-mark.png"
        alt=""
        width={iconSize}
        height={iconSize}
        priority
        className="shrink-0"
      />
      <span className="text-lg font-semibold tracking-tight">
        Excel<span className="text-brand">Print</span>
      </span>
    </span>
  );
}
