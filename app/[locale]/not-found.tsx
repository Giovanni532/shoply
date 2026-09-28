import { useTranslations } from "next-intl"
import { StagedLamp } from "@/components/lamp/staged-lamp"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/navigation"
import { paths } from "@/paths"

export default function NotFound() {
  const t = useTranslations("notFound")
  return (
    <div className="mx-auto max-w-[1320px] px-5 pb-24 pt-28 md:px-8 md:pb-32 md:pt-32">
      <div className="night grain relative grid min-h-[70svh] overflow-hidden rounded-2xl border bg-background lg:grid-cols-2">
        <div className="relative z-10 flex flex-col justify-center px-6 py-14 md:px-12">
          <p className="eyebrow text-beam-ink">{t("eyebrow")}</p>
          <h1 className="display mt-5 max-w-[18ch] text-[clamp(2.25rem,4.4vw,3.75rem)] leading-[0.95]">{t("title")}</h1>
          <p className="mt-5 max-w-md leading-relaxed text-muted-foreground">{t("text")}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href={paths.home}>{t("cta")}</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href={paths.products.list}>{t("products")}</Link>
            </Button>
          </div>
        </div>
        {/* Le faisceau fouille le vide : un « 404 » à peine visible au fond */}
        <div aria-hidden="true" className="relative min-h-72 overflow-hidden">
          <span className="display absolute right-[4%] top-1/2 -translate-y-1/2 text-[clamp(7rem,16vw,15rem)] leading-none text-foreground/[0.07]">404</span>
          <StagedLamp slug="lampe-de-poche-classic" on beam width={48} anchor={24} tilt={-4} />
        </div>
      </div>
    </div>
  )
}
