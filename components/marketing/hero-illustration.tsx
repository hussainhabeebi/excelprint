import { CheckCircle2 } from "lucide-react";

/**
 * A hand-built illustration standing in for real product photography,
 * which we don't have yet (no photoshoot / uploaded assets exist). Echoes
 * the logo's CMYK-dot flourish rather than using stock imagery, which
 * would misrepresent Excel Printing's actual work.
 */
export function HeroIllustration() {
  return (
    <div className="relative mx-auto flex h-72 w-full max-w-sm items-center justify-center sm:h-80">
      <svg viewBox="0 0 320 260" className="h-full w-full" aria-hidden="true">
        {/* back card */}
        <rect x="70" y="40" width="180" height="112" rx="14" className="fill-secondary" transform="rotate(-8 160 96)" />
        {/* middle card */}
        <rect
          x="70"
          y="50"
          width="180"
          height="112"
          rx="14"
          className="fill-background stroke-border"
          strokeWidth="1.5"
          transform="rotate(4 160 106)"
        />
        {/* front card */}
        <g>
          <rect x="60" y="70" width="200" height="124" rx="16" className="fill-primary" />
          <rect x="84" y="98" width="90" height="10" rx="5" className="fill-primary-foreground/70" />
          <rect x="84" y="118" width="130" height="8" rx="4" className="fill-primary-foreground/40" />
          <rect x="84" y="134" width="70" height="8" rx="4" className="fill-primary-foreground/40" />
          {/* CMYK dots, matching the logo's paper-fold flourish */}
          <circle cx="216" cy="100" r="6" fill="#22D3EE" />
          <circle cx="232" cy="100" r="6" fill="#EC4899" />
          <circle cx="216" cy="116" r="6" fill="#FACC15" />
          <circle cx="232" cy="116" r="6" className="fill-primary-foreground" />
        </g>
      </svg>

      <div className="absolute -top-2 right-2 flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold shadow-sm sm:right-8">
        <span className="text-brand">AED 45.00</span>
        <span className="text-muted-foreground">live price</span>
      </div>

      <div className="absolute -bottom-2 left-2 flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold shadow-sm sm:left-8">
        <CheckCircle2 className="size-3.5 text-emerald-600" />
        Proof approved
      </div>
    </div>
  );
}
