import { db } from "@/lib/drizzle";
import { category, product, productImage } from "@/db/schema";
import { eq } from "drizzle-orm";

// Idempotent : relançable sans rien casser. Les produits sont mis à jour par slug
// (jamais supprimés : des commandes peuvent y faire référence), le stock n'est
// réinitialisé qu'à la création. Les fiches (specs, dessin) vivent dans lib/catalog.ts.
const PRODUCTS = [
    {
        name: "Lampe de poche Classic",
        slug: "lampe-de-poche-classic",
        description: "Lampe de poche compacte et fiable pour un usage quotidien.",
        priceCents: 1990,
    },
    {
        name: "Lampe de poche Pro",
        slug: "lampe-de-poche-pro",
        description: "Puissance élevée et autonomie prolongée pour les professionnels.",
        priceCents: 2990,
    },
    {
        name: "Lampe de poche Mini",
        slug: "lampe-de-poche-mini",
        description: "Ultra-légère, idéale pour les voyages et le quotidien.",
        priceCents: 1490,
    },
];

async function main() {
    await db
        .insert(category)
        .values({ id: crypto.randomUUID(), name: "Éclairage", slug: "eclairage", description: "Lampes de poche et éclairage", isActive: true })
        .onConflictDoNothing({ target: category.slug });
    const [cat] = await db.select({ id: category.id }).from(category).where(eq(category.slug, "eclairage")).limit(1);

    for (const p of PRODUCTS) {
        const [existing] = await db.select({ id: product.id }).from(product).where(eq(product.slug, p.slug)).limit(1);
        if (existing) {
            await db
                .update(product)
                .set({ name: p.name, description: p.description, priceCents: p.priceCents, isActive: true, categoryId: cat.id, updatedAt: new Date() })
                .where(eq(product.id, existing.id));
            continue;
        }
        const id = crypto.randomUUID();
        await db.insert(product).values({ id, ...p, currency: "CHF", stock: 100, isActive: true, categoryId: cat.id });
        await db.insert(productImage).values({ id: crypto.randomUUID(), productId: id, url: "/lampe-de-poche.png", alt: p.name, position: 0 });
    }

    console.log(`Seeded ${PRODUCTS.length} products.`);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
