import { desc, eq } from "drizzle-orm"
import type { Metadata } from "next"
import { headers } from "next/headers"
import { getTranslations } from "next-intl/server"
import { AddressBook } from "@/components/account/address-book"
import { address } from "@/db/schema"
import { auth } from "@/lib/auth"
import { db } from "@/lib/drizzle"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("account")
  return { title: t("settingsTitle"), robots: { index: false } }
}

export default async function SettingsPage() {
  const [session, t] = await Promise.all([auth.api.getSession({ headers: await headers() }), getTranslations("account")])
  if (!session?.user?.id) return null

  const addresses = await db
    .select({
      id: address.id,
      fullName: address.fullName,
      line1: address.line1,
      line2: address.line2,
      postalCode: address.postalCode,
      city: address.city,
      country: address.country,
      phone: address.phone,
    })
    .from(address)
    .where(eq(address.userId, session.user.id))
    .orderBy(desc(address.createdAt))

  return (
    <section>
      <h2 className="display text-2xl">{t("settingsTitle")}</h2>
      <p className="mt-2 text-muted-foreground">{t("settingsSubtitle")}</p>
      <div className="mt-8">
        <AddressBook addresses={addresses} defaultName={session.user.name ?? ""} />
      </div>
    </section>
  )
}
