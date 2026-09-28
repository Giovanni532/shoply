"use client"

import { ArrowUpRight, Plus } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { StagedLamp } from "@/components/lamp/staged-lamp"
import { Button } from "@/components/ui/button"
import { useAddToCart } from "@/hooks/use-add-to-cart"
import { Link } from "@/i18n/navigation"
import { getModel, type Locale } from "@/lib/catalog"
import { formatNumber, formatPrice } from "@/lib/format"
import type { ProductView } from "@/lib/products"
import { cn } from "@/lib/utils"
import { paths } from "@/paths"

// Carte produit : la lampe s'allume au survol et son faisceau déborde de la vitrine.
export function ProductCard({ product, className }: { product: ProductView; className?: string }) {
  const t = useTranslations("product")
  const locale = useLocale() as Locale
  const add = useAddToCart()
  const model = getModel(product.slug)
  const href = paths.products.details(product.slug)
  const title = model?.name ?? product.name
  const soldOut = product.stock <= 0

  return (
    <article className={cn("group relative flex flex-col overflow-hidden rounded-xl border bg-card transition-[border-color,box-shadow] duration-500 hover:border-beam/30 hover:shadow-[0_30px_80px_-40px_var(--glow)]", className)}>
      <Link href={href} tabIndex={-1} aria-hidden="true" className="night grain relative block aspect-[4/3] overflow-hidden bg-background">
        {/* Lumière de studio, très douce, pour détacher la lampe du noir */}
        <span aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(55%_45%_at_50%_52%,rgb(255_255_255/0.06),transparent_70%)]" />
        <StagedLamp slug={product.slug} width={70} anchor={44} />
        {model && (
          <>
            <span className="eyebrow absolute left-4 top-4 text-faint">{model.code}</span>
            <span className="eyebrow tabular absolute right-4 top-4 rounded-full border px-2.5 py-1 text-muted-foreground transition-colors duration-500 group-hover:border-beam/40 group-hover:text-beam-ink">
              {formatNumber(model.lumens, locale)} lm
            </span>
          </>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="display text-2xl">
            <Link href={href} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
              {title}
            </Link>
          </h3>
          <span className="tabular font-mono text-[15px]">{formatPrice(product.priceCents, product.currency, locale)}</span>
        </div>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{model?.tagline[locale] ?? product.description}</p>

        {model && (
          <dl className="mt-5 grid grid-cols-3 border-t pt-4 font-mono text-[12px]">
            <div>
              <dt className="text-faint">{t("range")}</dt>
              <dd className="tabular mt-0.5 text-foreground">{t("unitMeters", { count: model.range })}</dd>
            </div>
            <div>
              <dt className="text-faint">{t("runtime")}</dt>
              <dd className="tabular mt-0.5 text-foreground">{t("unitHours", { count: model.runtime })}</dd>
            </div>
            <div>
              <dt className="text-faint">{t("ipx")}</dt>
              <dd className="mt-0.5 text-foreground">{model.ipx}</dd>
            </div>
          </dl>
        )}

        {/* Au-dessus du lien étiré de la carte */}
        <div className="relative z-10 mt-5 flex gap-2 pt-1">
          <Button
            variant="outline"
            className="flex-1 hover:border-transparent hover:bg-primary hover:text-primary-foreground hover:shadow-[0_0_28px_2px_var(--glow)]"
            disabled={soldOut}
            onClick={() => add(product)}
          >
            {soldOut ? t("outOfStock") : (
              <>
                <Plus />
                {t("addShort")}
              </>
            )}
          </Button>
          <Button asChild variant="outline" size="icon" aria-label={`${t("view")} — ${title}`}>
            <Link href={href}>
              <ArrowUpRight />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  )
}
