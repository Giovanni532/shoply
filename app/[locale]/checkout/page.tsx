import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { CheckoutView } from "@/components/checkout/checkout-view"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/navigation"
import { getServerSession } from "@/lib/session"
import { paths } from "@/paths"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("checkout")
  return { title: t("title"), robots: { index: false } }
}

export default async function CheckoutPage() {
  const [session, t] = await Promise.all([getServerSession(), getTranslations("checkout")])
  const from = encodeURIComponent(paths.checkout)

  return (
    <div className="mx-auto max-w-[1320px] px-5 pb-24 pt-32 md:px-8 md:pb-32 md:pt-40">
      <p className="eyebrow text-beam-ink">{t("eyebrow")}</p>
      <h1 className="display mb-10 mt-4 text-[clamp(2.5rem,5.5vw,4.5rem)] leading-[0.92]">{t("title")}</h1>

      {session?.user ? (
        <CheckoutView userName={session.user.name ?? ""} />
      ) : (
        // La commande exige un compte : on garde le panier et on revient ici après connexion
        <div className="night grain relative overflow-hidden rounded-2xl border bg-background px-6 py-14 md:px-12">
          <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-20 size-96 rounded-full bg-[radial-gradient(circle,rgb(255_194_102/0.18),transparent_65%)]" />
          <h2 className="display relative max-w-lg text-3xl md:text-4xl">{t("loginRequired.title")}</h2>
          <p className="relative mt-4 max-w-md leading-relaxed text-muted-foreground">{t("loginRequired.text")}</p>
          <div className="relative mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href={`${paths.auth.login}?from=${from}`}>{t("loginRequired.login")}</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href={`${paths.auth.signup}?from=${from}`}>{t("loginRequired.signup")}</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
