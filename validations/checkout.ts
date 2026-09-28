import { z } from "zod";

export const checkoutItemSchema = z.object({
    productId: z.string().min(1),
    quantity: z.number().int().min(1).max(999),
});

export const checkoutSchema = z.object({
    items: z.array(checkoutItemSchema).min(1),
    shipping: z.object({
        fullName: z.string().min(2, { message: "fullNameMin" }),
        line1: z.string().min(3, { message: "addressMin" }),
        line2: z.string().optional().nullable(),
        city: z.string().min(2, { message: "cityMin" }),
        postalCode: z.string().min(2, { message: "postalMin" }),
        country: z.string().min(2, { message: "countryMin" }),
        phone: z.string().regex(/^\+[1-9]\d{6,14}$/, { message: "phoneInvalid" }).optional().nullable(),
    }),
});



// Formulaire côté client : les articles viennent du panier au moment de l'envoi,
// et le téléphone peut rester vide ou ne contenir que l'indicatif.
const E164 = /^\+[1-9]\d{6,14}$/;
export const checkoutFormSchema = z.object({
    shipping: checkoutSchema.shape.shipping.extend({
        line2: z.string().optional(),
        phone: z.string().optional().refine((v) => {
            const compact = (v ?? "").replace(/[\s.-]/g, "");
            return compact === "" || /^\+\d{1,4}$/.test(compact) || E164.test(compact);
        }, { message: "phoneInvalid" }),
    }),
});

/** Téléphone normalisé pour le serveur : sans espaces, ou null s'il n'y a que l'indicatif */
export function normalizePhone(v: string | undefined | null) {
    const compact = (v ?? "").replace(/[\s.-]/g, "");
    return E164.test(compact) ? compact : null;
}
