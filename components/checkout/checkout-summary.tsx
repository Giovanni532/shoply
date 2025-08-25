"use client"

import Link from "next/link"
import { useCartStore, selectCartLines, selectCartSubtotalCents, selectCartCurrency } from "@/store/cart-store"
import { useTranslations } from "next-intl"

export default function CheckoutSummary() {
    const t = useTranslations("checkout")
    const lines = useCartStore(selectCartLines)
    const subtotalCents = useCartStore(selectCartSubtotalCents)
    const currency = useCartStore(selectCartCurrency)

    const format = (cents: number) => `${(cents / 100).toFixed(2)} ${currency}`
    const shippingCents = 0
    const totalCents = subtotalCents + shippingCents

    if (lines.length === 0) {
        return (
            <aside className="rounded-xl border bg-background p-4 md:p-6 text-center text-sm text-muted-foreground">
                {t("empty")}
            </aside>
        )
    }

    return (
        <aside className="rounded-xl border bg-background p-4 md:p-6">
            <h2 className="text-xl font-semibold mb-4">{t("summaryTitle")}</h2>
            <ul className="space-y-4">
                {lines.map((l) => (
                    <li key={l.productId} className="flex items-center gap-3">
                        <div className="size-14 shrink-0 overflow-hidden rounded bg-muted">
                            {l.imageUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={l.imageUrl} alt={l.name} className="h-full w-full object-cover" />
                            ) : null}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">{l.name}</p>
                            <p className="text-xs text-muted-foreground">
                                {l.quantity} × {format(l.unitPriceCents)}
                            </p>
                        </div>
                        <div className="text-sm font-medium">
                            {format(l.unitPriceCents * l.quantity)}
                        </div>
                    </li>
                ))}
            </ul>

            <div className="mt-6 space-y-2 text-sm">
                <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">{t("subtotal")}</span>
                    <span className="font-medium">{format(subtotalCents)}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">{t("shipping")}</span>
                    <span className="font-medium">{format(shippingCents)}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-base font-semibold">{t("total")}</span>
                    <span className="text-base font-semibold">{format(totalCents)}</span>
                </div>
            </div>

            <div className="mt-4 text-xs text-muted-foreground">
                {t("simulatedNote")}
            </div>

            <div className="mt-4 text-sm">
                <Link href="/cart" className="text-primary underline">{t("editCart")}</Link>
            </div>
        </aside>
    )
}


