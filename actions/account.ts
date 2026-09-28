"use server";

import { authActionClient } from "@/lib/safe-action";
import { z } from "zod";
import { db } from "@/lib/drizzle";
import { user, address } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const updateProfileSchema = z.object({ name: z.string().trim().min(2).max(120) });
export const updateProfile = authActionClient
    .schema(updateProfileSchema)
    .action(async ({ parsedInput, ctx }) => {
        await db.update(user).set({ name: parsedInput.name, updatedAt: new Date() }).where(eq(user.id, ctx.userId));
        return { ok: true as const };
    });

const upsertAddressSchema = z.object({
    id: z.string().optional(),
    fullName: z.string().trim().min(2).max(120),
    line1: z.string().trim().min(3).max(200),
    line2: z.string().trim().max(200).optional().nullable(),
    city: z.string().trim().min(2).max(120),
    postalCode: z.string().trim().min(2).max(20),
    country: z.string().trim().min(2).max(80),
    phone: z.string().trim().max(32).optional().nullable(),
});

export const upsertAddress = authActionClient
    .schema(upsertAddressSchema)
    .action(async ({ parsedInput, ctx }) => {
        const { id, ...fields } = parsedInput;
        const values = { ...fields, line2: fields.line2 || null, phone: fields.phone || null };
        if (id) {
            // Toujours filtrer sur le propriétaire : un id deviné ne suffit pas à modifier l'adresse d'un autre
            await db.update(address).set({ ...values, updatedAt: new Date() }).where(and(eq(address.id, id), eq(address.userId, ctx.userId)));
        } else {
            await db.insert(address).values({ id: crypto.randomUUID(), userId: ctx.userId, ...values });
        }
        revalidatePath("/[locale]/account/settings", "page");
        return { ok: true as const };
    });

const deleteAddressSchema = z.object({ id: z.string().min(1) });
export const deleteAddress = authActionClient
    .schema(deleteAddressSchema)
    .action(async ({ parsedInput, ctx }) => {
        // L'adresse est détachée du compte plutôt que supprimée : les commandes passées la gardent
        await db.update(address).set({ userId: null, updatedAt: new Date() }).where(and(eq(address.id, parsedInput.id), eq(address.userId, ctx.userId)));
        revalidatePath("/[locale]/account/settings", "page");
        return { ok: true as const };
    });
