"use client"

import { Minus, Plus } from "lucide-react"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"

export function QuantityStepper({
  value,
  onDecrease,
  onIncrease,
  min = 1,
  max = 10,
  size = "md",
  className,
}: {
  value: number
  onDecrease: () => void
  onIncrease: () => void
  min?: number
  max?: number
  size?: "sm" | "md"
  className?: string
}) {
  const t = useTranslations("product")
  const btn = cn(
    "grid cursor-pointer place-items-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/[0.07] hover:text-foreground disabled:pointer-events-none disabled:opacity-30",
    size === "sm" ? "size-7" : "size-9",
  )
  return (
    <div className={cn("inline-flex items-center rounded-full border border-input p-0.5", className)}>
      <button type="button" className={btn} onClick={onDecrease} disabled={value <= min} aria-label={t("decrease")}>
        <Minus className="size-3.5" />
      </button>
      <span aria-live="polite" className={cn("tabular text-center font-mono font-medium", size === "sm" ? "w-7 text-[13px]" : "w-9 text-sm")}>
        {value}
      </span>
      <button type="button" className={btn} onClick={onIncrease} disabled={value >= max} aria-label={t("increase")}>
        <Plus className="size-3.5" />
      </button>
    </div>
  )
}
