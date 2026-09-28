"use client"

import { Search, X } from "lucide-react"
import { useTranslations } from "next-intl"
import { useMemo, useState } from "react"
import { ProductCard } from "@/components/product/product-card"
import { getModel } from "@/lib/catalog"
import type { ProductView } from "@/lib/products"
import { cn } from "@/lib/utils"

type Sort = "new" | "price-asc" | "price-desc" | "power"

export function ProductsBrowser({ products }: { products: ProductView[] }) {
  const t = useTranslations("products")
  const [query, setQuery] = useState("")
  const [sort, setSort] = useState<Sort>("new")

  const list = useMemo(() => {
    const q = query.trim().toLowerCase()
    const matches = products.filter((p) => {
      const model = getModel(p.slug)
      return !q || [p.name, model?.name, model?.tagline.fr, model?.tagline.en].some((v) => v?.toLowerCase().includes(q))
    })
    const lumens = (p: ProductView) => getModel(p.slug)?.lumens ?? 0
    if (sort === "price-asc") return [...matches].sort((a, b) => a.priceCents - b.priceCents)
    if (sort === "price-desc") return [...matches].sort((a, b) => b.priceCents - a.priceCents)
    if (sort === "power") return [...matches].sort((a, b) => lumens(b) - lumens(a))
    return [...matches].sort((a, b) => b.createdAt - a.createdAt)
  }, [products, query, sort])

  const sorts: { value: Sort; label: string }[] = [
    { value: "new", label: t("sortNew") },
    { value: "price-asc", label: t("sortPriceAsc") },
    { value: "price-desc", label: t("sortPriceDesc") },
    { value: "power", label: t("sortPower") },
  ]

  return (
    <div>
      <div className="flex flex-col gap-4 border-y py-4 md:flex-row md:items-center md:justify-between">
        <label className="relative block w-full md:max-w-xs">
          <span className="sr-only">{t("search")}</span>
          <Search aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-faint" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("search")}
            className="h-10 w-full rounded-full border border-input bg-card/60 pl-10 pr-4 text-sm outline-none transition-[border-color,box-shadow] placeholder:text-faint focus-visible:border-beam focus-visible:shadow-[0_0_0_3px_var(--glow)] [&::-webkit-search-cancel-button]:hidden"
          />
        </label>
        <div className="flex min-w-0 items-center gap-3">
          <span className="eyebrow hidden shrink-0 text-faint sm:inline" aria-live="polite">
            {t("count", { count: list.length })}
          </span>
          <div role="group" aria-label={t("sort")} className="flex min-w-0 gap-1 overflow-x-auto rounded-full border p-1 [scrollbar-width:none]">
            {sorts.map((s) => (
              <button
                key={s.value}
                type="button"
                aria-pressed={sort === s.value}
                onClick={() => setSort(s.value)}
                className={cn(
                  "h-8 shrink-0 cursor-pointer whitespace-nowrap rounded-full px-3 text-[13px] font-medium transition-colors",
                  sort === s.value ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {list.length > 0 ? (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="mt-8 flex flex-col items-center gap-4 rounded-xl border border-dashed px-6 py-16 text-center">
          <p className="text-muted-foreground">{t("empty", { query: query.trim() })}</p>
          <button type="button" onClick={() => setQuery("")} className="inline-flex cursor-pointer items-center gap-1.5 text-sm font-semibold underline decoration-foreground/25 underline-offset-4 hover:decoration-beam">
            <X className="size-3.5" />
            {t("reset")}
          </button>
        </div>
      )}
    </div>
  )
}
