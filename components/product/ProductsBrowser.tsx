"use client"

import { useMemo, useState } from "react"
import ProductCard from "@/components/product/card-product"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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
            <h1 className="text-3xl font-bold text-center mb-10">Nos produits</h1>
            <div className="flex flex-wrap items-center gap-3 justify-center">
                <div className="min-w-60">
                    <Input placeholder="Rechercher un produit" value={query} onChange={e => setQuery(e.target.value)} />
                </div>
                <Select value={categoryId} onValueChange={v => setCategoryId(v as any)}>
                    <SelectTrigger className="w-52">
                        <SelectValue placeholder="Catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Toutes les catégories</SelectItem>
                        {categories.map(c => (
                            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select value={sort} onValueChange={v => setSort(v as any)}>
                    <SelectTrigger className="w-48">
                        <SelectValue placeholder="Trier" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="new">Nouveautés</SelectItem>
                        <SelectItem value="price-asc">Prix croissant</SelectItem>
                        <SelectItem value="price-desc">Prix décroissant</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map(p => (
                    <ProductCard key={p.id} {...p} />
                ))}
            </div>
        </div>
    )
}


