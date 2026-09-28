"use client"

import { ShoppingBag } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { useTranslations } from "next-intl"
import { CartLineItem } from "@/components/cart/cart-line"
import { CartTotals } from "@/components/cart/cart-totals"
import { Flashlight } from "@/components/lamp/flashlight"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useMounted } from "@/hooks/use-mounted"
import { Link } from "@/i18n/navigation"
import { paths } from "@/paths"
import { selectCartCurrency, selectCartLines, selectCartSubtotalCents, selectCartTotalQuantity, useCartStore } from "@/store/cart-store"
import { useCartUi } from "@/store/cart-ui"

export function CartDrawer() {
  const t = useTranslations("cart")
  const mounted = useMounted()
  const { open, setOpen } = useCartUi()
  const lines = useCartStore(selectCartLines)
  const count = useCartStore(selectCartTotalQuantity)
  const subtotal = useCartStore(selectCartSubtotalCents)
  const currency = useCartStore(selectCartCurrency)
  // Le panier vit dans le localStorage : rien avant l'hydratation
  const shown = mounted ? count : 0
  const close = () => setOpen(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        aria-label={`${t("open")} (${t("count", { count: shown })})`}
        className="relative grid size-9 cursor-pointer place-items-center rounded-full text-foreground transition-colors hover:bg-foreground/[0.06]"
      >
        <ShoppingBag className="size-[18px]" />
        <AnimatePresence>
          {shown > 0 && (
            <motion.span
              key={shown}
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.4, opacity: 0 }}
              transition={{ type: "spring", stiffness: 420, damping: 22 }}
              className="tabular absolute -right-0.5 -top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-primary px-1 font-mono text-[10px] font-semibold text-primary-foreground shadow-[0_0_12px_var(--glow)]"
            >
              {shown}
            </motion.span>
          )}
        </AnimatePresence>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-full gap-0 border-l bg-background p-0 outline-none sm:max-w-[420px]"
        // Le focus va au panneau lui-même, pas au premier bouton « retirer »
        onOpenAutoFocus={(e) => {
          e.preventDefault()
          ;(e.currentTarget as HTMLElement | null)?.focus()
        }}
      >
        <div className="flex items-baseline gap-3 border-b px-6 pb-4 pt-5">
          <SheetTitle className="display text-xl">{t("title")}</SheetTitle>
          <SheetDescription className="eyebrow text-faint">{t("count", { count: shown })}</SheetDescription>
        </div>

        {mounted && lines.length > 0 ? (
          <>
            <ul className="flex-1 divide-y overflow-y-auto px-6">
              {lines.map((line) => (
                <CartLineItem key={line.productId} line={line} onNavigate={close} size="sm" />
              ))}
            </ul>
            <div className="space-y-4 border-t bg-card/40 px-6 pb-6 pt-5">
              <CartTotals subtotalCents={subtotal} currency={currency} />
              <div className="grid gap-2">
                <Button asChild size="lg" className="w-full">
                  <Link href={paths.checkout} onClick={close}>
                    {t("checkout")}
                  </Link>
                </Button>
                <Button asChild variant="ghost" className="w-full">
                  <Link href={paths.cart} onClick={close}>
                    {t("viewCart")}
                  </Link>
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 text-center">
            <div className="night w-44 rounded-lg bg-background px-4 py-6">
              <Flashlight slug="lampe-de-poche-classic" />
            </div>
            <div>
              <p className="font-semibold">{t("empty")}</p>
              <p className="mt-1 text-sm text-muted-foreground">{t("emptyText")}</p>
            </div>
            <Button asChild variant="outline" onClick={close}>
              <Link href={paths.products.list}>{t("emptyCta")}</Link>
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
