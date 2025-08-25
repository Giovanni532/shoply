"use server";

import { authActionClient } from "@/lib/safe-action";
import { z } from "zod";
import { db } from "@/lib/drizzle";
import { user, address } from "@/db/schema";
import { eq } from "drizzle-orm";

const updateProfileSchema = z.object({ name: z.string().min(2) });
export const updateProfile = authActionClient
    .schema(updateProfileSchema)
    .action(async ({ parsedInput, ctx }) => {
        await db.update(user).set({ name: parsedInput.name }).where(eq(user.id, ctx.userId));
        return { ok: true as const };
    });

const upsertAddressSchema = z.object({
    id: z.string().optional(),
    fullName: z.string().min(2),
    line1: z.string().min(3),
    line2: z.string().optional().nullable(),
    city: z.string().min(2),
    postalCode: z.string().min(2),
    country: z.string().min(2),
    phone: z.string().optional().nullable(),
});

export const upsertAddress = authActionClient
    .schema(upsertAddressSchema)
    .action(async ({ parsedInput, ctx }) => {
        if (parsedInput.id) {
            await db.update(address).set({
                fullName: parsedInput.fullName,
                line1: parsedInput.line1,
                line2: parsedInput.line2 ?? null,
                city: parsedInput.city,
                postalCode: parsedInput.postalCode,
                country: parsedInput.country,
                phone: parsedInput.phone ?? null,
            }).where(eq(address.id, parsedInput.id));
            return { ok: true as const };
        }
        await db.insert(address).values({
            id: crypto.randomUUID(),
            userId: ctx.userId,
            fullName: parsedInput.fullName,
            line1: parsedInput.line1,
            line2: parsedInput.line2 ?? null,
            city: parsedInput.city,
            postalCode: parsedInput.postalCode,
            country: parsedInput.country,
            phone: parsedInput.phone ?? null,
        });
        return { ok: true as const };
    });

const deleteAddressSchema = z.object({ id: z.string().min(1) });
export const deleteAddress = authActionClient
    .schema(deleteAddressSchema)
    .action(async ({ parsedInput, ctx }) => {
        await db.delete(address).where(eq(address.id, parsedInput.id));
        return { ok: true as const };
    });

export const getAccountInfo = authActionClient.action(async ({ ctx }) => {
    const rows = await db.select({
        email: user.email,
        createdAt: user.createdAt,
        name: user.name,
    }).from(user).where(eq(user.id, ctx.userId));
    const info = rows[0];
    return { email: info?.email ?? null, createdAt: info?.createdAt ?? null, name: info?.name ?? null } as const;
});


