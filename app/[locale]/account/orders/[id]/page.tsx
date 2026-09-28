import { and, eq } from "drizzle-orm"
import { ArrowLeft } from "lucide-react"
import type { Metadata } from "next"
import { headers } from "next/headers"
import { getLocale, getTranslations } from "next-intl/server"
import { StatusBadge } from "@/components/account/status-badge"
import { LampThumb } from "@/components/cart/cart-line"
import { address, order, orderItem, product } from "@/db/schema"
import { Link } from "@/i18n/navigation"
import { auth } from "@/lib/auth"
import { getModel } from "@/lib/catalog"
import { db } from "@/lib/drizzle"
import { formatDate, formatPrice, orderRef } from "@/lib/format"
import { paths } from "@/paths"

type Params = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const [{ id }, t] = await Promise.all([params, getTranslations("account.orders.details")])
  return { title: `${t("title")} #${orderRef(id)}`, robots: { index: false } }
}

export default async function OrderDetailsPage({ params }: Params) {
  const [{ id }, session, t, tc, locale] = await Promise.all([params, auth.api.getSession({ headers: await headers() }), getTranslations("account"), getTranslations("cart"), getLocale()])
  if (!session?.user?.id) return null

  // Filtré sur le propriétaire : l'id d'une commande ne suffit pas à la lire
  const [header] = await db
    .select({
      id: order.id,
      status: order.status,
      createdAt: order.createdAt,
      currency: order.currency,
      subtotalCents: order.subtotalCents,
      shippingCents: order.shippingCents,
      totalCents: order.totalCents,
      fullName: address.fullName,
      line1: address.line1,
      line2: address.line2,
      postalCode: address.postalCode,
      city: address.city,
      country: address.country,
    })
    .from(order)
    .leftJoin(address, eq(address.id, order.shippingAddressId))
    .where(and(eq(order.id, id), eq(order.userId, session.user.id)))
    .limit(1)

  const back = (
    <Link href={paths.account.orders} className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground">
      <ArrowLeft className="size-4" />
      {t("orders.details.back")}
    </Link>
  )

  if (!header) {
    return (
      <div className="space-y-6">
        <p className="text-muted-foreground">{t("orders.notFound")}</p>
        {back}
      </div>
    )
  }

  const items = await db
    .select({ id: orderItem.id, name: orderItem.name, quantity: orderItem.quantity, unitPriceCents: orderItem.unitPriceCents, slug: product.slug })
    .from(orderItem)
    .leftJoin(product, eq(product.id, orderItem.productId))
    .where(eq(orderItem.orderId, header.id))

  const fmt = (cents: number) => formatPrice(cents, header.currency, locale)

  return (
    <div className="space-y-8">
      {back}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="display text-3xl">
            {t("orders.details.title")} <span className="tabular font-mono text-2xl font-normal">#{orderRef(header.id)}</span>
          </h2>
          <p className="mt-2 text-muted-foreground">{t("orders.details.placed", { date: formatDate(header.createdAt, locale, true) })}</p>
        </div>
        <StatusBadge status={header.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="rounded-xl border lg:col-span-8">
          <ul className="divide-y">
            {items.map((it) => {
              const model = getModel(it.slug)
              return (
                <li key={it.id} className="flex items-center gap-4 px-5 py-4">
                  <LampThumb slug={it.slug} className="h-14 w-20" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{model ? `Shoply ${model.name}` : it.name}</p>
                    <p className="tabular font-mono text-[12px] text-muted-foreground">
                      {it.quantity} × {fmt(it.unitPriceCents)}
                    </p>
                  </div>
                  <span className="tabular font-mono text-sm">{fmt(it.unitPriceCents * it.quantity)}</span>
                </li>
              )
            })}
          </ul>
          <dl className="space-y-2 border-t px-5 py-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">{t("orders.details.subtotal")}</dt>
              <dd className="tabular font-mono">{fmt(header.subtotalCents)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">{t("orders.details.shipping")}</dt>
              <dd className="tabular font-mono">{header.shippingCents === 0 ? <span className="font-sans font-medium text-beam-ink">{tc("shippingFree")}</span> : fmt(header.shippingCents)}</dd>
            </div>
            <div className="flex justify-between border-t pt-3 font-semibold">
              <dt>{t("orders.details.total")}</dt>
              <dd className="tabular font-mono text-base">{fmt(header.totalCents)}</dd>
            </div>
          </dl>
        </div>

        {header.line1 && (
          <aside className="rounded-xl border p-5 lg:col-span-4">
            <h3 className="eyebrow text-faint">{t("orders.details.address")}</h3>
            <address className="mt-3 text-sm not-italic leading-relaxed">
              <span className="font-semibold">{header.fullName}</span>
              <br />
              {header.line1}
              {header.line2 && (
                <>
                  <br />
                  {header.line2}
                </>
              )}
              <br />
              {header.postalCode} {header.city}
              <br />
              {header.country}
            </address>
          </aside>
        )}
      </div>
    </div>
  )
}
