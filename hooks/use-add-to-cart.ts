"use client"

import { useCartStore } from "@/store/cart-store"
import { useCartUi } from "@/store/cart-ui"

type Addable = { id: string; slug: string; name: string; priceCents: number; currency: string; imageUrl?: string | null }

/** Ajoute au panier puis ouvre le tiroir : le retour visuel, c'est la lampe qui arrive dans le panier */
export function useAddToCart() {
  const addItem = useCartStore((s) => s.addItem)
  const setOpen = useCartUi((s) => s.setOpen)
  return (p: Addable, quantity = 1) => {
    addItem({
      productId: p.id,
      slug: p.slug,
      name: p.name,
      unitPriceCents: p.priceCents,
      currency: p.currency,
      imageUrl: p.imageUrl ?? undefined,
      quantity,
    })
    setOpen(true)
  }
}
