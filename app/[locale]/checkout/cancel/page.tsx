import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { Flashlight } from "@/components/lamp/flashlight"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/navigation"
import { paths } from "@/paths"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("checkout")
  return { title: t("cancelEyebrow"), robots: { index: false } }
}

export default async function CheckoutCancelPage() {
  const t = await getTranslations("checkout")
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-5 pb-24 pt-36 text-center md:pb-32 md:pt-44">
      {/* Lampe éteinte : rien n'est parti */}
      <div className="night w-56 rounded-xl bg-background px-6 py-8">
        <Flashlight slug="lampe-de-poche-classic" />
      </div>
      <p className="eyebrow mt-10 text-destructive">{t("cancelEyebrow")}</p>
      <h1 className="display mt-4 text-[clamp(2.25rem,5vw,3.75rem)] leading-[0.95]">{t("cancelTitle")}</h1>
      <p className="mt-5 max-w-md leading-relaxed text-muted-foreground">{t("cancelSubtitle")}</p>
      <div className="mt-9 flex flex-wrap justify-center gap-3">
        <Button asChild size="lg">
          <Link href={paths.cart}>{t("cancelCtaCart")}</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href={paths.products.list}>{t("cancelCtaProducts")}</Link>
        </Button>
      </div>
    </div>
  )
}
