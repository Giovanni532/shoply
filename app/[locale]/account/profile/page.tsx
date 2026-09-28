import type { Metadata } from "next"
import { headers } from "next/headers"
import { getTranslations } from "next-intl/server"
import { ProfileForm } from "@/components/account/profile-form"
import { auth } from "@/lib/auth"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("account")
  return { title: t("profileTitle"), robots: { index: false } }
}

export default async function ProfilePage() {
  const [session, t] = await Promise.all([auth.api.getSession({ headers: await headers() }), getTranslations("account")])
  if (!session?.user) return null
  return (
    <section>
      <h2 className="display text-2xl">{t("profileTitle")}</h2>
      <p className="mt-2 text-muted-foreground">{t("profileSubtitle")}</p>
      <div className="mt-8">
        <ProfileForm name={session.user.name ?? ""} email={session.user.email} />
      </div>
    </section>
  )
}
