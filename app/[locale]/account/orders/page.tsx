import { desc, eq, inArray } from "drizzle-orm"
import { ChevronRight } from "lucide-react"
import type { Metadata } from "next"
import { headers } from "next/headers"
import { getLocale, getTranslations } from "next-intl/server"
import { StatusBadge } from "@/components/account/status-badge"
import { LampThumb } from "@/components/cart/cart-line"
import { Button } from "@/components/ui/button"
import { order, orderItem, product } from "@/db/schema"
import { Link } from "@/i18n/navigation"
import { auth } from "@/lib/auth"
import { db } from "@/lib/drizzle"
import { formatDate, formatPrice, orderRef } from "@/lib/format"
import { paths } from "@/paths"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("account")
  return { title: t("ordersTitle"), robots: { index: false } }
}

export default async function OrdersPage() {
  const [session, t, locale] = await Promise.all([auth.api.getSession({ headers: await headers() }), getTranslations("account"), getLocale()])
  if (!session?.user?.id) return null

  const orders = await db
    .select({ id: order.id, createdAt: order.createdAt, status: order.status, totalCents: order.totalCents, currency: order.currency })
    .from(order)
    .where(eq(order.userId, session.user.id))
    .orderBy(desc(order.createdAt))

  // Articles des commandes, avec le slug pour dessiner les lampes
  const items = orders.length
    ? await db
        .select({ orderId: orderItem.orderId, quantity: orderItem.quantity, slug: product.slug })
        .from(orderItem)
        .leftJoin(product, eq(product.id, orderItem.productId))
        .where(inArray(orderItem.orderId, orders.map((o) => o.id)))
    : []
  const byOrder = new Map<string, { slugs: string[]; count: number }>()
  for (const it of items) {
    const entry = byOrder.get(it.orderId) ?? { slugs: [], count: 0 }
    if (it.slug && !entry.slugs.includes(it.slug)) entry.slugs.push(it.slug)
    entry.count += it.quantity
    byOrder.set(it.orderId, entry)
  }

  if (orders.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed px-6 py-16 text-center">
        <p className="text-muted-foreground">{t("orders.empty")}</p>
        <Button asChild className="mt-6">
          <Link href={paths.products.list}>{t("orders.emptyCta")}</Link>
        </Button>
      </div>
    )
  }

  return (
    <ul className="divide-y overflow-hidden rounded-xl border">
      {orders.map((o) => {
        const info = byOrder.get(o.id) ?? { slugs: [], count: 0 }
        return (
          <li key={o.id}>
            <Link href={`${paths.account.orders}/${o.id}`} className="group flex flex-wrap items-center gap-x-6 gap-y-3 px-5 py-4 transition-colors hover:bg-card md:flex-nowrap">
              <div className="flex -space-x-3">
                {info.slugs.slice(0, 3).map((slug) => (
                  <LampThumb key={slug} slug={slug} className="h-12 w-16 border-2 border-background" />
                ))}
              </div>
              <div className="min-w-0 flex-1">
                <p className="tabular font-mono text-sm">#{orderRef(o.id)}</p>
                <p className="text-[13px] text-muted-foreground">
                  {formatDate(o.createdAt, locale)} · {t("orders.itemsCount", { count: info.count })}
                </p>
              </div>
              <StatusBadge status={o.status} />
              <span className="tabular w-28 text-right font-mono text-sm">{formatPrice(o.totalCents, o.currency, locale)}</span>
              <ChevronRight aria-hidden="true" className="hidden size-4 text-faint transition-transform group-hover:translate-x-0.5 md:block" />
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
