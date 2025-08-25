"use client"

import Link from "next/link"
import { useCartStore, selectCartLines, selectCartSubtotalCents, selectCartCurrency } from "@/store/cart-store"

export default function CheckoutSummary() {
    const lines = useCartStore(selectCartLines)
    const subtotalCents = useCartStore(selectCartSubtotalCents)
    const currency = useCartStore(selectCartCurrency)

    const format = (cents: number) => `${(cents / 100).toFixed(2)} ${currency}`
    const shippingCents = 0
    const totalCents = subtotalCents + shippingCents

    return (
        <aside className="rounded-xl border bg-background p-4 md:p-6">
            <h2 className="text-xl font-semibold mb-4">Votre commande</h2>
            {lines.length === 0 ? (
                <p className="text-sm text-muted-foreground">Votre panier est vide.</p>
            ) : (
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
            )}

            <div className="mt-6 space-y-2 text-sm">
                <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Sous-total</span>
                    <span className="font-medium">{format(subtotalCents)}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Livraison</span>
                    <span className="font-medium">{format(shippingCents)}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-base font-semibold">Total</span>
                    <span className="text-base font-semibold">{format(totalCents)}</span>
                </div>
            </div>

            <div className="mt-4 text-xs text-muted-foreground">
                Paiement simulé, aucune donnée de carte n'est enregistrée.
            </div>

            <div className="mt-4 text-sm">
                <Link href="/cart" className="text-primary underline">Modifier le panier</Link>
            </div>
        </aside>
    )
}


