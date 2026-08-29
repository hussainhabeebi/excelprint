import Image from "next/image";
import { cn } from "@/lib/utils";

export function SiteLogo({ className, priority = false }: { className?: string; priority?: boolean }) {
  return (
    <span className={cn("inline-flex items-center", className)}>
      <Image
        src="/logo/logo.png"
        alt="Excel Printing"
        width={1324}
        height={809}
        priority={priority}
        sizes="(min-width: 640px) 124px, 104px"
        className="h-auto w-[104px] shrink-0 sm:w-[124px]"
      />
    </span>
  );
}
