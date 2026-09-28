import { ArrowRight, MessageCircle, RotateCcw, ShieldCheck, Truck } from "lucide-react"
import { getLocale, getTranslations } from "next-intl/server"
import { Hero } from "@/components/home/hero"
import { RangeExplorer } from "@/components/home/range-explorer"
import { SectionHeading } from "@/components/home/section-heading"
import { ProductCard } from "@/components/product/product-card"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/navigation"
import { MAX_LUMENS, MAX_RANGE } from "@/lib/catalog"
import { listProducts } from "@/lib/products"
import { paths } from "@/paths"

export default async function Home() {
  const [products, locale, t] = await Promise.all([listProducts(), getLocale(), getTranslations("home")])
  const range = products.slice(0, 3)

  const pillars = ["aluminium", "usbc", "waterproof", "warranty"] as const
  const services = [
    { key: "shipping", icon: Truck },
    { key: "returns", icon: RotateCcw },
    { key: "secure", icon: ShieldCheck },
    { key: "support", icon: MessageCircle },
  ] as const

  return (
    <>
      <Hero maxLumens={MAX_LUMENS} maxRange={MAX_RANGE} locale={locale} />

      {/* La gamme */}
      <section className="mx-auto max-w-[1320px] px-5 py-24 md:px-8 md:py-32">
        <SectionHeading eyebrow={t("range.eyebrow")} title={t("range.title")} lede={t("range.lede")}>
          <Link href={paths.products.list} className="group inline-flex items-center gap-2 text-sm font-semibold">
            <span className="underline decoration-foreground/25 underline-offset-4 group-hover:decoration-beam">{t("range.all")}</span>
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </SectionHeading>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {range.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <div className="border-y bg-card/40">
        <RangeExplorer slugs={products.map((p) => p.slug)} />
      </div>

      {/* Fabrication */}
      <section className="mx-auto max-w-[1320px] px-5 py-24 md:px-8 md:py-32">
        <SectionHeading eyebrow={t("pillars.eyebrow")} title={t("pillars.title")} />
        <ol className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((key, i) => (
            <li key={key} className="border-t pt-5">
              <span className="eyebrow tabular text-beam-ink">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="display mt-4 text-xl">{t(`pillars.${key}.title`)}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{t(`pillars.${key}.desc`)}</p>
            </li>
          ))}
        </ol>

        <ul className="mt-20 grid gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {services.map(({ key, icon: Icon }) => (
            <li key={key} className="flex items-center gap-4 bg-background px-5 py-5">
              <Icon aria-hidden="true" className="size-5 shrink-0 text-beam-ink" />
              <div>
                <p className="text-sm font-semibold">{t(`services.${key}.title`)}</p>
                <p className="text-[13px] text-muted-foreground">{t(`services.${key}.desc`)}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Appel final : une bande de nuit traversée par un faisceau */}
      <section className="px-5 pb-24 md:px-8 md:pb-32">
        <div className="night grain relative mx-auto max-w-[1320px] overflow-hidden rounded-2xl bg-background px-6 py-20 text-center md:py-28">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 -top-10 mx-auto h-[140%] w-[70%] blur-2xl"
            style={{ background: "radial-gradient(50% 60% at 50% 0%, rgb(255 194 102 / 0.28), transparent 70%)" }}
          />
          <h2 className="display relative mx-auto max-w-[16ch] text-[clamp(2.25rem,5.4vw,4.75rem)] leading-[0.95]">{t("cta.title")}</h2>
          <p className="relative mx-auto mt-5 max-w-md text-[17px] leading-relaxed text-muted-foreground">{t("cta.subtitle")}</p>
          <Button asChild size="lg" className="relative mt-9">
            <Link href={paths.products.list}>
              {t("cta.primary")}
              <ArrowRight />
            </Link>
          </Button>
        </div>
      </section>
    </>
  )
}
