"use client"

import { useMemo, useState } from "react"
import { ShoppingCart, Minus, Plus, Trash2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { paths } from "@/paths"
import { useCartStore, selectCartLines, selectCartTotalQuantity, selectCartSubtotalCents, selectCartCurrency } from "@/store/cart-store"

export function CartButton() {
    const t = useTranslations("cart")
    const [open, setOpen] = useState(false)
    const lines = useCartStore(selectCartLines)
    const totalQuantity = useCartStore(selectCartTotalQuantity)
    const subtotalCents = useCartStore(selectCartSubtotalCents)
    const currency = useCartStore(selectCartCurrency)
    const increment = useCartStore(state => state.increment)
    const decrement = useCartStore(state => state.decrement)
    const removeItem = useCartStore(state => state.removeItem)

    const subtotalFormatted = useMemo(() => `${(subtotalCents / 100).toFixed(2)} ${currency}`, [subtotalCents, currency])

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative h-9 w-9 rounded-full transition-transform hover:scale-105 active:scale-95"
                    aria-label={t("open")}
                >
                    <AnimatePresence initial={false}>
                        <motion.span
                            key={totalQuantity}
                            initial={{ scale: 0.7, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.7, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 18 }}
                        >
                            <ShoppingCart className="size-5" />
                        </motion.span>
                    </AnimatePresence>
                    {totalQuantity > 0 && (
                        <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 400, damping: 20 }}
                            className="absolute -right-1 -top-1 grid min-h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground shadow"
                        >
                            {totalQuantity}
                        </motion.span>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
                <SheetHeader className="px-4 py-3">
                    <SheetTitle>{t("title")}</SheetTitle>
                </SheetHeader>
                <Separator />
                <div className="flex-1 overflow-y-auto p-4">
                    {lines.length === 0 ? (
                        <p className="text-sm text-muted-foreground">{t("empty")}</p>
                    ) : (
                        <ul className="space-y-3">
                            {lines.map(item => (
                                <li key={item.productId} className="flex gap-3 rounded-md border p-3">
                                    <div className="size-14 shrink-0 overflow-hidden rounded bg-muted">
                                        {item.imageUrl ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={item.imageUrl} alt={item.name} className="h-full w-full object-contain" />
                                        ) : null}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-medium">{item.name}</p>
                                        <p className="text-xs text-muted-foreground">{(item.unitPriceCents / 100).toFixed(2)} {item.currency}</p>
                                        <div className="mt-2 flex items-center gap-2">
                                            <Button variant="outline" size="sm" onClick={() => decrement(item.productId, 1)}>
                                                <Minus className="size-3.5" />
                                            </Button>
                                            <span className="w-6 text-center text-sm">{item.quantity}</span>
                                            <Button variant="outline" size="sm" onClick={() => increment(item.productId, 1)}>
                                                <Plus className="size-3.5" />
                                            </Button>
                                            <Button variant="ghost" size="sm" className="ml-auto text-red-500" onClick={() => removeItem(item.productId)}>
                                                <Trash2 className="size-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <Separator />
                <SheetFooter className="px-4 py-3">
                    <div className="flex w-full items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">{t("subtotal")}</p>
                            <p className="text-lg font-semibold">{subtotalFormatted}</p>
                        </div>
                        <Button className="min-w-32" onClick={() => setOpen(false)}>
                            <Link href={paths.checkout}>{t("checkout")}</Link>
                        </Button>
                    </div>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}

export default CartButton