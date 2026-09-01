import Image from "next/image";
import { cn } from "@/lib/utils";

export function SiteLogo({ className, priority = false }: { className?: string; priority?: boolean }) {
  return (
    <span className={cn("inline-flex h-12 items-center overflow-hidden", className)}>
      <Image
        src="/logo/logo.png"
        alt="Excel Printing"
        width={1324}
        height={809}
        priority={priority}
        sizes="(min-width: 640px) 72px, 66px"
        className="h-10 w-auto max-w-none shrink-0 object-contain sm:h-11"
      />
    </span>
  );
}
