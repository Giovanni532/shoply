"use server";
import { db } from "@/lib/drizzle";
import { product, productImage } from "@/db/schema";
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