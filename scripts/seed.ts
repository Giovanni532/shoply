import { db } from "@/lib/drizzle";
import { category, product, productImage } from "@/db/schema";
import { inArray } from "drizzle-orm";

async function main() {
    const slugList = [
        "lampe-de-poche-classic",
        "lampe-de-poche-pro",
        "lampe-de-poche-mini",
    ];

    // Ensure category exists
    const categoryId = crypto.randomUUID();
    try {
        await db.insert(category).values({
            id: categoryId,
            name: "Éclairage",
            slug: "eclairage",
            description: "Catégorie des lampes et éclairages",
            isActive: true,
        }).onConflictDoNothing?.();
    } catch {
        // ignore if already exists
    }

    // Clean existing products with same slugs
    await db.delete(product).where(inArray(product.slug, slugList));

    const products = [
        {
            id: crypto.randomUUID(),
            name: "Lampe de poche Classic",
            slug: "lampe-de-poche-classic",
            description: "Lampe de poche compacte et fiable pour un usage quotidien.",
            priceCents: 1990,
            currency: "CHF",
            stock: 100,
            isActive: true,
            categoryId,
        },
        {
            id: crypto.randomUUID(),
            name: "Lampe de poche Pro",
            slug: "lampe-de-poche-pro",
            description: "Puissance élevée et autonomie prolongée pour les professionnels.",
            priceCents: 2990,
            currency: "CHF",
            stock: 100,
            isActive: true,
            categoryId,
        },
        {
            id: crypto.randomUUID(),
            name: "Lampe de poche Mini",
            slug: "lampe-de-poche-mini",
            description: "Ultra-légère, idéale pour les voyages et le quotidien.",
            priceCents: 1490,
            currency: "CHF",
            stock: 100,
            isActive: true,
            categoryId,
        },
    ];

    await db.insert(product).values(products);

    const images = products.map((p, idx) => ({
        id: crypto.randomUUID(),
        productId: p.id,
        url: "/lampe-de-poche.png",
        alt: p.name,
        position: 0,
    }));

    await db.insert(productImage).values(images);

    console.log(`Seeded ${products.length} products with images.`);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});


