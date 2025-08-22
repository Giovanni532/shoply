"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { ShoppingCart, Minus, Plus, Trash2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { useTranslations } from "next-intl"

type CartItem = {
    id: string
    name: string
    price: number
    image?: string
    quantity: number
}

export function CartButton() {
    const t = useTranslations("cart")
    const [items, setItems] = useState<CartItem[]>([])
    const [open, setOpen] = useState(false)

    // Demo placeholder items (replace with real state later)
    useEffect(() => {
        setItems([
            { id: "1", name: "Wireless Headphones", price: 129.9, quantity: 1, image: "/vercel.svg" },
            { id: "2", name: "Smart Watch", price: 89.5, quantity: 2, image: "/next.svg" },
        ])
    }, [])

    const totalQuantity = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items])
    const totalPrice = useMemo(() => items.reduce((sum, i) => sum + i.quantity * i.price, 0), [items])

    const updateQuantity = (id: string, delta: number) => {
        setItems(prev => prev.map(i => i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i))
    }
    const removeItem = (id: string) => setItems(prev => prev.filter(i => i.id !== id))

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
                    {items.length === 0 ? (
                        <p className="text-sm text-muted-foreground">{t("empty")}</p>
                    ) : (
                        <ul className="space-y-3">
                            {items.map(item => (
                                <li key={item.id} className="flex gap-3 rounded-md border p-3">
                                    <div className="size-14 shrink-0 overflow-hidden rounded bg-muted">
                                        {item.image ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={item.image} alt={item.name} className="h-full w-full object-contain" />
                                        ) : null}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-medium">{item.name}</p>
                                        <p className="text-xs text-muted-foreground">{item.price.toFixed(2)} CHF</p>
                                        <div className="mt-2 flex items-center gap-2">
                                            <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, -1)}>
                                                <Minus className="size-3.5" />
                                            </Button>
                                            <span className="w-6 text-center text-sm">{item.quantity}</span>
                                            <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, 1)}>
                                                <Plus className="size-3.5" />
                                            </Button>
                                            <Button variant="ghost" size="sm" className="ml-auto text-red-500" onClick={() => removeItem(item.id)}>
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
                            <p className="text-lg font-semibold">{totalPrice.toFixed(2)} CHF</p>
                        </div>
                        <Button className="min-w-32" onClick={() => setOpen(false)}>
                            {t("checkout")}
                        </Button>
                    </div>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}

export default CartButton

// legacy placeholder removed