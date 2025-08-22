"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/store/cart-store"

export type ProductCardProps = {
    id: string
    name: string
    priceCents: number
    currency: string
    imageUrl?: string
}

export default function ProductCard({ id, name, priceCents, currency, imageUrl }: ProductCardProps) {
    const addItem = useCartStore(s => s.addItem)

    const handleAdd = () => {
        addItem({
            productId: id,
            name,
            unitPriceCents: priceCents,
            currency,
            imageUrl,
            quantity: 1,
        })
    }

    return (
        <motion.article
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            whileHover={{ y: -4 }}
            className="group relative overflow-hidden rounded-xl border bg-background shadow-sm w-84 h-84"
        >
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={name}
                        fill
                        sizes="(min-width: 768px) 33vw, 100vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        priority={false}
                    />
                ) : null}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/60 via-background/0 to-transparent"
                />
            </div>
            <div className="flex items-center justify-between gap-4 p-4">
                <div className="min-w-0">
                    <h3 className="truncate text-base font-semibold">{name}</h3>
                    <p className="text-sm text-muted-foreground">{(priceCents / 100).toFixed(2)} {currency}</p>
                </div>
                <motion.div whileTap={{ scale: 0.96 }}>
                    <Button onClick={handleAdd} size="sm" className="whitespace-nowrap">
                        Ajouter
                    </Button>
                </motion.div>
            </div>
        </motion.article>
    )
}


