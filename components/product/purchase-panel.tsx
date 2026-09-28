"use client"

import { ShoppingBag } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { QuantityStepper } from "@/components/cart/quantity-stepper"
import { Button } from "@/components/ui/button"
import { useAddToCart } from "@/hooks/use-add-to-cart"
import type { ProductView } from "@/lib/products"
import { cn } from "@/lib/utils"

const LOW_STOCK = 10

export function PurchasePanel({ product }: { product: ProductView }) {
  const t = useTranslations("product")
  const add = useAddToCart()
  const [quantity, setQuantity] = useState(1)
  const soldOut = product.stock <= 0
  const max = Math.max(1, Math.min(99, product.stock))

  return (
    <div className="space-y-4">
      <p className={cn("flex items-center gap-2 text-sm", soldOut ? "text-destructive" : "text-muted-foreground")}>
        <span className={cn("size-2 rounded-full", soldOut ? "bg-destructive" : "bg-success shadow-[0_0_8px_var(--success)]")} />
        {soldOut ? t("outOfStock") : product.stock <= LOW_STOCK ? t("lowStock", { count: product.stock }) : t("inStock")}
      </p>
      <div className="flex gap-3">
        <QuantityStepper
          value={quantity}
          max={max}
          onDecrease={() => setQuantity((q) => Math.max(1, q - 1))}
          onIncrease={() => setQuantity((q) => Math.min(max, q + 1))}
          className="h-12"
        />
        <Button size="lg" className="flex-1" disabled={soldOut} onClick={() => add(product, quantity)}>
          <ShoppingBag />
          {t("add")}
        </Button>
      </div>
    </div>
  )
}
