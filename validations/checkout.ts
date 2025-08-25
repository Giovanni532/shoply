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


