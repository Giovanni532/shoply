"use client"

import { useLocale, useTranslations } from "next-intl"
import { useTransition } from "react"
import { usePathname, useRouter } from "@/i18n/navigation"
import { routing } from "@/i18n/routing"
import { cn } from "@/lib/utils"

// FR · EN : même page, autre langue (les paramètres de recherche sont conservés)
export function LanguageSwitch({ className }: { className?: string }) {
  const t = useTranslations("common")
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  const switchTo = (next: string) => {
    if (next === locale) return
    const query = window.location.search.slice(1)
    startTransition(() => {
      router.replace(query ? `${pathname}?${query}` : pathname, { locale: next })
    })
  }

  return (
    <div role="group" aria-label={t("language")} className={cn("flex items-center rounded-full p-0.5 font-mono text-[11px]", pending && "opacity-60", className)}>
      {routing.locales.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => switchTo(l)}
          aria-pressed={l === locale}
          lang={l}
          className={cn(
            "h-7 cursor-pointer rounded-full px-2 uppercase tracking-[0.12em] transition-colors",
            l === locale ? "text-foreground" : "text-faint hover:text-foreground",
          )}
        >
          {l}
        </button>
      ))}
    </div>
  )
}
