"use client"

import { X } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { Flashlight } from "@/components/lamp/flashlight"
import { QuantityStepper } from "@/components/cart/quantity-stepper"
import { Link } from "@/i18n/navigation"
import { getModel } from "@/lib/catalog"
import { formatPrice } from "@/lib/format"
import { cn } from "@/lib/utils"
import { paths } from "@/paths"
import { useCartStore, type CartLine as Line } from "@/store/cart-store"

/** Vignette de nuit avec la lampe allumée : réutilisée dans le panier, la commande et le compte */
export function LampThumb({ slug, className }: { slug?: string | null; className?: string }) {
  return (
    <div className={cn("night grid shrink-0 place-items-center overflow-hidden rounded-md bg-background px-2", className)}>
      <Flashlight slug={slug} on className="w-full" />
    </div>
  )
}

export function CartLineItem({ line, onNavigate, size = "md" }: { line: Line; onNavigate?: () => void; size?: "sm" | "md" }) {
  const t = useTranslations("cart")
  const locale = useLocale()
  const increment = useCartStore((s) => s.increment)
  const decrement = useCartStore((s) => s.decrement)
  const removeItem = useCartStore((s) => s.removeItem)
  const model = getModel(line.slug)
  const title = model ? `Shoply ${model.name}` : line.name

  return (
    <li className="flex gap-4 py-4">
      <LampThumb slug={line.slug} className={size === "sm" ? "h-16 w-20" : "h-20 w-28"} />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            {line.slug ? (
              <Link href={paths.products.details(line.slug)} onClick={onNavigate} className="block truncate font-semibold hover:text-beam-ink">
                {title}
              </Link>
            ) : (
              <p className="truncate font-semibold">{title}</p>
            )}
            <p className="mt-0.5 text-[13px] text-muted-foreground">
              {model ? `${model.finish.name[locale as "fr" | "en"]} · ` : ""}
              {formatPrice(line.unitPriceCents, line.currency, locale)}
            </p>
          </div>
          <button
            type="button"
            onClick={() => removeItem(line.productId)}
            aria-label={t("remove", { name: title })}
            className="-mr-1 grid size-8 shrink-0 cursor-pointer place-items-center rounded-full text-faint transition-colors hover:bg-foreground/[0.06] hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          <QuantityStepper
            size="sm"
            value={line.quantity}
            onDecrease={() => decrement(line.productId)}
            onIncrease={() => increment(line.productId)}
          />
          <span className="tabular font-mono text-sm font-medium">{formatPrice(line.unitPriceCents * line.quantity, line.currency, locale)}</span>
        </div>
      </div>
    </li>
  )
}
