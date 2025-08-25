"use server";
import { authActionClient, ActionError } from "@/lib/safe-action";
import { checkoutSchema } from "@/validations/checkout";
import { db } from "@/lib/drizzle";
import { address, order, orderItem, payment, product as productTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export const createCheckout = authActionClient
    .schema(checkoutSchema)
    .action(async ({ parsedInput, ctx }) => {
        const { items, shipping } = parsedInput;

        // Validate products and compute totals
        // Build product map by fetching each referenced product
        const productMap = new Map<string, any>();
        for (const i of items) {
            const p = await db.select().from(productTable).where(eq(productTable.id, i.productId)).limit(1);
            if (!p[0]) throw new ActionError("PRODUCT_NOT_FOUND");
            productMap.set(i.productId, p[0]);
        }

        let subtotalCents = 0;
        for (const i of items) {
            const p = productMap.get(i.productId);
            subtotalCents += p.priceCents * i.quantity;
        }
        const shippingCents = 0;
        const totalCents = subtotalCents + shippingCents;
        const currency = "CHF";

        // Create or reuse shipping address
        const shippingId = crypto.randomUUID();
        await db.insert(address).values({
            id: shippingId,
            userId: ctx.userId,
            fullName: shipping.fullName,
            line1: shipping.line1,
            line2: shipping.line2 ?? null,
            city: shipping.city,
            postalCode: shipping.postalCode,
            country: shipping.country,
            phone: shipping.phone ?? null,
        });

        const orderId = crypto.randomUUID();
        await db.insert(order).values({
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

        for (const i of items) {
            const p = productMap.get(i.productId);
            await db.insert(orderItem).values({
                id: crypto.randomUUID(),
                orderId,
                productId: p.id,
                name: p.name,
                unitPriceCents: p.priceCents,
                quantity: i.quantity,
            });
            // reduce stock
            // Note: optimistic, no concurrent control
            await db.update(productTable).set({ stock: (p.stock ?? 0) - i.quantity }).where(eq(productTable.id, p.id));
        }

        const paymentId = crypto.randomUUID();
        await db.insert(payment).values({
            id: paymentId,
            orderId,
            provider: "mock",
            providerPaymentId: null,
            status: "succeeded",
            amountCents: totalCents,
            currency,
        });

        return { ok: true as const, orderId };
    });


