"use server";
import { authActionClient, ActionError } from "@/lib/safe-action";
import { checkoutSchema } from "@/validations/checkout";
import { db } from "@/lib/drizzle";
import { address, order, orderItem, payment, product as productTable } from "@/db/schema";
import { and, eq, gte, inArray, sql } from "drizzle-orm";

export const createCheckout = authActionClient
    .schema(checkoutSchema)
    .action(async ({ parsedInput, ctx }) => {
        const { shipping } = parsedInput;

        // Fusionne les lignes d'un même produit (un panier modifié à la main ne doit rien casser)
        const quantities = new Map<string, number>();
        for (const i of parsedInput.items) quantities.set(i.productId, Math.min(999, (quantities.get(i.productId) ?? 0) + i.quantity));
        const ids = [...quantities.keys()];

        // Prix et stock viennent toujours de la base, jamais du client
        const products = await db.select().from(productTable).where(inArray(productTable.id, ids));
        const byId = new Map(products.map((p) => [p.id, p]));
        for (const [id, quantity] of quantities) {
            const p = byId.get(id);
            if (!p || !p.isActive) throw new ActionError("PRODUCT_NOT_FOUND");
            if (p.stock < quantity) throw new ActionError(`OUT_OF_STOCK|${p.name}`);
        }

        const subtotalCents = ids.reduce((sum, id) => sum + byId.get(id)!.priceCents * quantities.get(id)!, 0);
        const shippingCents = 0;
        const totalCents = subtotalCents + shippingCents;
        const currency = "CHF";
        const orderId = crypto.randomUUID();

        await db.transaction(async (tx) => {
            // Réutilise une adresse identique déjà enregistrée plutôt que de la dupliquer
            const fields = {
                fullName: shipping.fullName.trim(),
                line1: shipping.line1.trim(),
                line2: shipping.line2?.trim() || null,
                city: shipping.city.trim(),
                postalCode: shipping.postalCode.trim(),
                country: shipping.country.trim(),
                phone: shipping.phone?.trim() || null,
            };
            const existing = await tx
                .select({ id: address.id })
                .from(address)
                .where(and(
                    eq(address.userId, ctx.userId),
                    eq(address.fullName, fields.fullName),
                    eq(address.line1, fields.line1),
                    eq(address.postalCode, fields.postalCode),
                    eq(address.city, fields.city),
                    eq(address.country, fields.country),
                ))
                .limit(1);
            const shippingId = existing[0]?.id ?? crypto.randomUUID();
            if (!existing[0]) await tx.insert(address).values({ id: shippingId, userId: ctx.userId, ...fields });

            await tx.insert(order).values({
                id: orderId,
                userId: ctx.userId,
                status: "paid",
                subtotalCents,
                shippingCents,
                totalCents,
                currency,
                shippingAddressId: shippingId,
                billingAddressId: shippingId,
            });

            for (const id of ids) {
                const p = byId.get(id)!;
                const quantity = quantities.get(id)!;
                await tx.insert(orderItem).values({
                    id: crypto.randomUUID(),
                    orderId,
                    productId: p.id,
                    name: p.name,
                    unitPriceCents: p.priceCents,
                    quantity,
                });
                // Décrément atomique : échoue (et annule tout) si le stock a bougé entre-temps
                const updated = await tx
                    .update(productTable)
                    .set({ stock: sql`${productTable.stock} - ${quantity}`, updatedAt: new Date() })
                    .where(and(eq(productTable.id, p.id), gte(productTable.stock, quantity)));
                if (updated.rowsAffected === 0) throw new ActionError(`OUT_OF_STOCK|${p.name}`);
            }

            await tx.insert(payment).values({
                id: crypto.randomUUID(),
                orderId,
                provider: "mock",
                providerPaymentId: null,
                status: "succeeded",
                amountCents: totalCents,
                currency,
            });
        });

        return { ok: true as const, orderId };
    });
