"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCartStore, selectCartLines } from "@/store/cart-store"
import { paths } from "@/paths"

export default function CheckoutGuard() {
    const router = useRouter()
    const lines = useCartStore(selectCartLines)

    useEffect(() => {
        if (lines.length === 0) {
            router.replace(paths.products.list)
        }
    }, [lines.length, router])

    return null
}


