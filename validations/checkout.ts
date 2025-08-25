import { z } from "zod";

export const checkoutItemSchema = z.object({
    productId: z.string().min(1),
    quantity: z.number().int().min(1).max(999),
});

export const checkoutSchema = z.object({
    items: z.array(checkoutItemSchema).min(1),
    shipping: z.object({
        fullName: z.string().min(2),
        line1: z.string().min(3),
        line2: z.string().optional().nullable(),
        city: z.string().min(2),
        postalCode: z.string().min(2),
        country: z.string().min(2),
        phone: z.string().regex(/^\+[1-9]\d{6,14}$/, { message: "Invalid phone (E.164)" }).optional().nullable(),
    }),
});


