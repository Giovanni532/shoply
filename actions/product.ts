"use server";
import { db } from "@/lib/drizzle";
import { product, productImage, category } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function getHomeProducts() {
    const rows = await db
        .select({
            id: product.id,
            name: product.name,
            priceCents: product.priceCents,
            currency: product.currency,
            createdAt: product.createdAt,
            imageUrl: productImage.url,
        })
        .from(product)
        .leftJoin(productImage, eq(productImage.productId, product.id))
        .orderBy(desc(product.createdAt));

    const byId = new Map<string, { id: string; name: string; priceCents: number; currency: string; imageUrl?: string }>();
    for (const row of rows) {
        if (!byId.has(row.id)) {
            byId.set(row.id, {
                id: row.id,
                name: row.name,
                priceCents: row.priceCents,
                currency: row.currency,
                imageUrl: row.imageUrl ?? "/lampe-de-poche.png",
            });
        }
    }

    return Array.from(byId.values()).slice(0, 3);
}

export async function getProductsAndCategories() {
    const rows = await db
        .select({
            id: product.id,
            name: product.name,
            priceCents: product.priceCents,
            currency: product.currency,
            createdAt: product.createdAt,
            categoryId: product.categoryId,
            imageUrl: productImage.url,
        })
        .from(product)
        .leftJoin(productImage, eq(productImage.productId, product.id))
        .orderBy(desc(product.createdAt));

    const byId = new Map<string, any>();
    for (const r of rows) {
        if (!byId.has(r.id)) {
            byId.set(r.id, {
                id: r.id,
                name: r.name,
                priceCents: r.priceCents,
                currency: r.currency,
                categoryId: r.categoryId,
                imageUrl: r.imageUrl ?? "/lampe-de-poche.png",
            });
        }
    }

    const cats = await db.select({ id: category.id, name: category.name }).from(category).orderBy(category.name);
    return { products: Array.from(byId.values()), categories: cats };
}