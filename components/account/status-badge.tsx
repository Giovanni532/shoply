import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"

const TONE: Record<string, string> = {
  paid: "text-beam-ink border-beam/35",
  shipped: "text-foreground border-foreground/25",
  delivered: "text-success border-success/35",
  cancelled: "text-destructive border-destructive/35",
  pending: "text-muted-foreground border-foreground/15",
}

export function StatusBadge({ status }: { status: string }) {
  const t = useTranslations("account.status")
  const known = status in TONE
  return (
    <span className={cn("eyebrow inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1", TONE[status] ?? TONE.pending)}>
      <span className="size-1.5 rounded-full bg-current" />
      {known ? t(status as "paid") : status}
    </span>
  )
}
