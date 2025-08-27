"use client"

import { useMemo, useState } from "react"
import ProductCard from "@/components/product/card-product"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTranslations } from "next-intl"

type Product = {
    id: string
    name: string
    priceCents: number
    currency: string
    categoryId: string | null
    imageUrl?: string
}

type Category = { id: string; name: string }

export default function ProductsBrowser({ products, categories }: { products: Product[]; categories: Category[] }) {
    const t = useTranslations("products")
    const [query, setQuery] = useState("")
    const [categoryId, setCategoryId] = useState<string | "all">("all")
    const [sort, setSort] = useState<"new" | "price-asc" | "price-desc">("new")

    const filtered = useMemo(() => {
        let list = products.filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
        if (categoryId !== "all") list = list.filter(p => p.categoryId === categoryId)
        if (sort === "price-asc") list = [...list].sort((a, b) => a.priceCents - b.priceCents)
        if (sort === "price-desc") list = [...list].sort((a, b) => b.priceCents - a.priceCents)
        return list
    }, [products, query, categoryId, sort])

    return (
        <div className="mx-auto w-full max-w-6xl px-4 py-10 mt-20">
            <h1 className="text-3xl font-bold text-center mb-10">{t("title")}</h1>
            <div className="flex flex-wrap items-center gap-3 justify-center">
                <div className="min-w-60">
                    <Input placeholder={t("search")} value={query} onChange={e => setQuery(e.target.value)} />
                </div>
                <Select value={categoryId} onValueChange={v => setCategoryId(v as any)}>
                    <SelectTrigger className="w-52">
                        <SelectValue placeholder={t("category")} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">{t("allCategories")}</SelectItem>
                        {categories.map(c => (
                            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select value={sort} onValueChange={v => setSort(v as any)}>
                    <SelectTrigger className="w-48">
                        <SelectValue placeholder={t("sort")} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="new">{t("sortNew")}</SelectItem>
                        <SelectItem value="price-asc">{t("sortPriceAsc")}</SelectItem>
                        <SelectItem value="price-desc">{t("sortPriceDesc")}</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="mt-8 flex flex-wrap gap-8 justify-center items-center">
                {filtered.map(p => (
                    <ProductCard key={p.id} {...p} />
                ))}
            </div>
        </div>
    )
}


