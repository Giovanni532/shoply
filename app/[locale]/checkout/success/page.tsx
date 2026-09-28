import { and, eq } from "drizzle-orm"
import type { Metadata } from "next"
import { headers } from "next/headers"
import { getLocale, getTranslations } from "next-intl/server"
import { StagedLamp } from "@/components/lamp/staged-lamp"
import { Button } from "@/components/ui/button"
import { order } from "@/db/schema"
import { Link } from "@/i18n/navigation"
import { auth } from "@/lib/auth"
import { db } from "@/lib/drizzle"
import { formatPrice, orderRef } from "@/lib/format"
import { paths } from "@/paths"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("checkout")
  return { title: t("successEyebrow"), robots: { index: false } }
}

export default async function CheckoutSuccessPage({ searchParams }: { searchParams: Promise<{ order?: string }> }) {
  const [{ order: orderId }, session, t, locale] = await Promise.all([searchParams, auth.api.getSession({ headers: await headers() }), getTranslations("checkout"), getLocale()])

  // La commande n'est affichée qu'à son propriétaire
  const placed =
    orderId && session?.user?.id
      ? (await db.select({ id: order.id, totalCents: order.totalCents, currency: order.currency }).from(order).where(and(eq(order.id, orderId), eq(order.userId, session.user.id))).limit(1))[0]
      : undefined

  return (
    <div className="mx-auto max-w-[1320px] px-5 pb-24 pt-32 md:px-8 md:pb-32 md:pt-40">
      <div className="night grain relative grid overflow-hidden rounded-2xl border bg-background md:grid-cols-2">
        <div className="relative z-10 px-6 py-14 md:px-12 md:py-20">
          <p className="eyebrow flex items-center gap-2 text-success">
            <span className="size-1.5 rounded-full bg-success shadow-[0_0_8px_var(--success)]" />
            {t("successEyebrow")}
          </p>
          <h1 className="display mt-5 text-[clamp(2.25rem,4.6vw,3.75rem)] leading-[0.95]">{t("successTitle")}</h1>
          <p className="mt-5 max-w-md leading-relaxed text-muted-foreground">{t("successSubtitle")}</p>
          {placed && (
            <dl className="mt-8 flex gap-10 border-t pt-5">
              <div>
                <dt className="eyebrow text-faint">{t("successRef")}</dt>
                <dd className="tabular mt-1 font-mono text-lg">#{orderRef(placed.id)}</dd>
              </div>
              <div>
                <dt className="eyebrow text-faint">{t("total")}</dt>
                <dd className="tabular mt-1 font-mono text-lg">{formatPrice(placed.totalCents, placed.currency, locale)}</dd>
              </div>
            </dl>
          )}
          <div className="mt-10 flex flex-wrap gap-3">
            {placed && (
              <Button asChild size="lg">
                <Link href={`${paths.account.orders}/${placed.id}`}>{t("successOrder")}</Link>
              </Button>
            )}
            <Button asChild size="lg" variant="outline">
              <Link href={paths.products.list}>{t("successCta")}</Link>
            </Button>
          </div>
        </div>
        <div aria-hidden="true" className="relative hidden min-h-80 overflow-hidden md:block">
          <StagedLamp slug="lampe-de-poche-pro" on beam width={66} anchor={34} tilt={-10} />
        </div>
      </div>
    </div>
  )
}
