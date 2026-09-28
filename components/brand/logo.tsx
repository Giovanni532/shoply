import { cn } from "@/lib/utils"

// Le monogramme : une lentille allumée et son faisceau. Même dessin que l'icône de l'app.
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 34 24" aria-hidden="true" className={cn("h-6 w-[34px] shrink-0", className)}>
      <defs>
        <linearGradient id="shoply-logo-beam" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="var(--beam)" stopOpacity="0.95" />
          <stop offset="1" stopColor="var(--beam)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M10 8.6 33 1.5v21L10 15.4Z" fill="url(#shoply-logo-beam)" />
      <circle cx="7.5" cy="12" r="6.5" fill="var(--beam)" />
      <circle cx="7.5" cy="12" r="2.6" fill="#fff8e8" />
    </svg>
  )
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LogoMark />
      <span className="display text-[19px] leading-none tracking-[-0.04em]">Shoply</span>
    </span>
  )
}
