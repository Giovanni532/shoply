import { db } from "@/lib/drizzle";
import { order, orderItem } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { getTranslations } from "next-intl/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { paths } from "@/paths";

type OrderItemRow = {
    itemId: string | null;
    productName: string | null;
    quantity: number | null;
    unitPriceCents: number | null;
};

export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const t = await getTranslations("account");
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
        return null;
    }
    const { id } = await params;

    const rows = await db
        .select({
            orderId: order.id,
            status: order.status,
            createdAt: order.createdAt,
            currency: order.currency,
            subtotalCents: order.subtotalCents,
            totalCents: order.totalCents,
            itemId: orderItem.id,
            productName: orderItem.name,
            quantity: orderItem.quantity,
            unitPriceCents: orderItem.unitPriceCents,
        })
        .from(order)
        .leftJoin(orderItem, eq(orderItem.orderId, order.id))
        .where(and(eq(order.id, id), eq(order.userId, session.user.id)));

    if (rows.length === 0) {
        return (
            <div className="mx-auto w-full max-w-4xl px-4 py-12 mt-20">
                <h1 className="text-3xl font-bold">{t("orders.details.title")} #{id}</h1>
                <p className="text-muted-foreground">{t("orders.empty")}</p>
                <div className="mt-6">
                    <Link href={paths.account.orders} className="text-primary underline">{t("orders.details.back")}</Link>
                </div>
            </div>
        );
    }

    const header = rows[0];
    const items: OrderItemRow[] = rows
        .filter(r => r.itemId)
        .map(r => ({
            itemId: r.itemId,
            productName: r.productName,
            quantity: r.quantity,
            unitPriceCents: r.unitPriceCents,
        }));

    const fmt = (cents: number | null | undefined, currency: string | null | undefined) =>
        `${(((cents ?? 0) as number) / 100).toFixed(2)} ${currency ?? ""}`;

    return (
        <div className="mx-auto w-full max-w-4xl px-4 py-12 mt-20">
            <h1 className="text-3xl font-bold">{t("orders.details.title")} #{id}</h1>
            <p className="text-muted-foreground">{new Date(header.createdAt as unknown as string).toLocaleString()}</p>

            <div className="mt-8 rounded-xl border bg-background">
                <div className="grid grid-cols-12 gap-2 border-b px-4 py-3 text-sm font-medium">
                    <div className="col-span-6">{t("orders.details.items")}</div>
                    <div className="col-span-3 text-right">{t("orders.details.quantity")}</div>
                    <div className="col-span-3 text-right">{t("orders.details.price")}</div>
                </div>
                {items.map((it) => (
                    <div key={it.itemId!} className="grid grid-cols-12 gap-2 px-4 py-2 text-sm">
                        <div className="col-span-6 truncate">{it.productName}</div>
                        <div className="col-span-3 text-right">{it.quantity}</div>
                        <div className="col-span-3 text-right">{fmt((it.unitPriceCents ?? 0) * (it.quantity ?? 0), header.currency)}</div>
                    </div>
                ))}
                <div className="border-t px-4 py-3 text-right text-sm font-semibold">
                    {fmt(header.totalCents, header.currency)}
                </div>
            </div>

            <div className="mt-6">
                <Link href={paths.account.orders} className="text-primary underline">{t("orders.details.back")}</Link>
            </div>
        </div>
    );
}



