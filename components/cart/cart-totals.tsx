"use client"

import { useLocale, useTranslations } from "next-intl"
import { formatPrice } from "@/lib/format"
import { cn } from "@/lib/utils"

// Sous-total / livraison / total : la livraison est offerte sur toute la boutique
export function CartTotals({ subtotalCents, currency, className }: { subtotalCents: number; currency: string; className?: string }) {
  const t = useTranslations("cart")
  const locale = useLocale()
  return (
    <dl className={cn("space-y-2 text-sm", className)}>
      <div className="flex justify-between">
        <dt className="text-muted-foreground">{t("subtotal")}</dt>
        <dd className="tabular font-mono">{formatPrice(subtotalCents, currency, locale)}</dd>
      </div>
      <div className="flex justify-between">
        <dt className="text-muted-foreground">{t("shipping")}</dt>
        <dd className="font-medium text-beam-ink">{t("shippingFree")}</dd>
      </div>
      <div className="flex items-baseline justify-between border-t pt-3">
        <dt className="font-semibold">
          {t("total")} <span className="ml-1 text-xs font-normal text-faint">{t("taxes")}</span>
        </dt>
        <dd className="tabular font-mono text-lg font-semibold">{formatPrice(subtotalCents, currency, locale)}</dd>
      </div>
    </dl>
  )
}
