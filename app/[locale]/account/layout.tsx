import { headers } from "next/headers"
import { getLocale, getTranslations } from "next-intl/server"
import { AccountNav } from "@/components/account/account-nav"
import { redirect } from "@/i18n/navigation"
import { auth } from "@/lib/auth"
import { formatDate } from "@/lib/format"
import { paths } from "@/paths"

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const [session, t, locale] = await Promise.all([auth.api.getSession({ headers: await headers() }), getTranslations("account"), getLocale()])
  // Le proxy redirige déjà sans cookie ; ici on couvre une session expirée
  if (!session?.user) return redirect({ href: `${paths.auth.login}?from=${encodeURIComponent(paths.account.orders)}`, locale })

  const firstName = session.user.name?.split(" ")[0] ?? ""
  return (
    <div className="mx-auto max-w-[1100px] px-5 pb-24 pt-32 md:px-8 md:pb-32 md:pt-40">
      <p className="eyebrow text-beam-ink">{t("eyebrow")}</p>
      <h1 className="display mt-4 text-[clamp(2.5rem,5.5vw,4.5rem)] leading-[0.92]">{t("greeting", { name: firstName })}</h1>
      <p className="mt-3 text-muted-foreground">{t("memberSince", { date: formatDate(session.user.createdAt, locale) })}</p>
      <div className="mt-10">
        <AccountNav />
      </div>
      <div className="mt-10">{children}</div>
    </div>
  )
}
