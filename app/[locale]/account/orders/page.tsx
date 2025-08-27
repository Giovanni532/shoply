import { db } from "@/lib/drizzle";
import { order } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

export default async function OrdersPage() {
    const t = await getTranslations("account")
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user?.id) return null

    const rows = await db.select({
        id: order.id,
        createdAt: order.createdAt,
        status: order.status,
        totalCents: order.totalCents,
        currency: order.currency,
    }).from(order).where(eq(order.userId, session.user.id)).orderBy(desc(order.createdAt))

    return (
        <div className="mx-auto w-full max-w-4xl px-4 py-12 mt-20">
            <h1 className="text-3xl font-bold">{t("ordersTitle")}</h1>
            <p className="text-muted-foreground">{t("ordersSubtitle")}</p>
            {rows.length === 0 ? (
                <div className="mt-6 text-sm text-muted-foreground">{t("orders.empty")}</div>
            ) : (
                <div className="mt-6 overflow-hidden rounded-xl border">
                    <div className="grid grid-cols-12 gap-2 border-b bg-muted/30 px-4 py-3 text-sm font-medium">
                        <div className="col-span-4">{t("orders.table.id")}</div>
                        <div className="col-span-3">{t("orders.table.date")}</div>
                        <div className="col-span-2">{t("orders.table.status")}</div>
                        <div className="col-span-3 text-right">{t("orders.table.total")}</div>
                    </div>
                    {rows.map((r) => (
                        <Link key={r.id} href={`/account/orders/${r.id}`} className="grid grid-cols-12 gap-2 px-4 py-3 text-sm hover:bg-muted/30">
                            <div className="col-span-4 truncate">#{r.id}</div>
                            <div className="col-span-3">{new Date(r.createdAt as unknown as string).toLocaleString()}</div>
                            <div className="col-span-2 capitalize">{r.status}</div>
                            <div className="col-span-3 text-right">{((r.totalCents as number) / 100).toFixed(2)} {r.currency}</div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}


