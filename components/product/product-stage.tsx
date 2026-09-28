"use client"

import { Power } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useState } from "react"
import { StagedLamp } from "@/components/lamp/staged-lamp"
import type { Mode } from "@/lib/catalog"
import { formatNumber } from "@/lib/format"
import { cn } from "@/lib/utils"

const INTENSITY: Record<Mode["key"], number> = { eco: 0.32, normal: 0.62, turbo: 1 }

// La vitrine de la fiche produit : on allume la lampe et on essaie ses modes.
export function ProductStage({ slug, modes, code }: { slug: string; modes: Mode[]; code?: string }) {
  const t = useTranslations("product")
  const locale = useLocale()
  const [on, setOn] = useState(true)
  const [modeKey, setModeKey] = useState<Mode["key"]>(modes.at(-1)?.key ?? "turbo")
  const mode = modes.find((m) => m.key === modeKey) ?? modes.at(-1)

  return (
    <div className="night grain relative overflow-hidden rounded-2xl border bg-background">
      <div className="relative aspect-[4/3] md:aspect-[16/11]">
        <span aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(50%_45%_at_38%_52%,rgb(255_255_255/0.06),transparent_70%)]" />
        <StagedLamp slug={slug} on={on} width={54} anchor={33} tilt={-6} intensity={mode ? INTENSITY[mode.key] : 1} />

        {code && <span className="eyebrow absolute left-5 top-5 text-faint">{code}</span>}
        {mode && (
          <p className={cn("absolute bottom-5 left-5 transition-opacity duration-500", on ? "opacity-100" : "opacity-40")} aria-live="polite">
            <span className="display tabular block text-3xl md:text-4xl">{formatNumber(on ? mode.lumens : 0, locale)}</span>
            <span className="eyebrow text-muted-foreground">lumens</span>
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3">
        <button
          type="button"
          onClick={() => setOn((v) => !v)}
          aria-pressed={on}
          className={cn(
            "inline-flex h-9 cursor-pointer items-center gap-2 rounded-full border px-4 text-[13px] font-semibold transition-[background-color,border-color,color,box-shadow]",
            on ? "border-transparent bg-primary text-primary-foreground shadow-[0_0_24px_var(--glow)]" : "text-muted-foreground hover:text-foreground",
          )}
        >
          <Power className="size-3.5" />
          {on ? t("lightOff") : t("lightOn")}
        </button>

        {modes.length > 1 && (
          <div role="group" aria-label={t("modes")} className="flex gap-1 rounded-full border p-1">
            {modes.map((m) => (
              <button
                key={m.key}
                type="button"
                aria-pressed={m.key === modeKey}
                onClick={() => {
                  setModeKey(m.key)
                  setOn(true)
                }}
                className={cn(
                  "cursor-pointer rounded-full px-3 py-1.5 text-left transition-colors",
                  m.key === modeKey ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <span className="block text-[13px] font-semibold leading-tight">{t(`mode.${m.key}`)}</span>
                <span className="tabular hidden whitespace-nowrap font-mono text-[10.5px] leading-tight opacity-70 sm:block">{t("modeDetail", { lumens: formatNumber(m.lumens, locale), hours: m.hours })}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
