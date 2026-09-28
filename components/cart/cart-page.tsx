"use client"

import { ArrowLeft } from "lucide-react"
import { useTranslations } from "next-intl"
import { CartLineItem } from "@/components/cart/cart-line"
import { CartTotals } from "@/components/cart/cart-totals"
import { Flashlight } from "@/components/lamp/flashlight"
import { Button } from "@/components/ui/button"
import { useMounted } from "@/hooks/use-mounted"
import { Link } from "@/i18n/navigation"
import { paths } from "@/paths"
import { selectCartCurrency, selectCartLines, selectCartSubtotalCents, selectCartTotalQuantity, useCartStore } from "@/store/cart-store"

export function CartPageView() {
  const t = useTranslations("cart")
  const mounted = useMounted()
  const lines = useCartStore(selectCartLines)
  const count = useCartStore(selectCartTotalQuantity)
  const subtotal = useCartStore(selectCartSubtotalCents)
  const currency = useCartStore(selectCartCurrency)

  if (!mounted) return <div className="min-h-[40vh]" />

  if (lines.length === 0) {
    return (
      <div className="flex flex-col items-center gap-6 rounded-2xl border border-dashed px-6 py-20 text-center">
        <div className="night w-56 rounded-xl bg-background px-6 py-8">
          <Flashlight slug="lampe-de-poche-classic" />
        </div>
        <div>
          <p className="display text-2xl">{t("empty")}</p>
          <p className="mt-2 text-muted-foreground">{t("emptyText")}</p>
        </div>
        <Button asChild size="lg">
          <Link href={paths.products.list}>{t("emptyCta")}</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid gap-10 lg:grid-cols-12">
      <div className="lg:col-span-7">
        <p className="eyebrow text-faint">{t("count", { count })}</p>
        <ul className="mt-3 divide-y border-y">
          {lines.map((line) => (
            <CartLineItem key={line.productId} line={line} />
          ))}
        </ul>
        <Link href={paths.products.list} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" />
          {t("continue")}
        </Link>
      </div>
      <aside className="lg:col-span-5">
        <div className="rounded-xl border bg-card p-6 lg:sticky lg:top-24">
          <CartTotals subtotalCents={subtotal} currency={currency} />
          <Button asChild size="lg" className="mt-6 w-full">
            <Link href={paths.checkout}>{t("checkout")}</Link>
          </Button>
        </div>
      </aside>
    </div>
  )
}
