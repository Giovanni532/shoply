import { Check, RotateCcw, ShieldCheck, Truck } from "lucide-react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getLocale, getTranslations } from "next-intl/server"
import { ProductCard } from "@/components/product/product-card"
import { ProductStage } from "@/components/product/product-stage"
import { PurchasePanel } from "@/components/product/purchase-panel"
import { Link } from "@/i18n/navigation"
import { getModel, type Locale } from "@/lib/catalog"
import { formatNumber, formatPrice } from "@/lib/format"
import { getProductBySlug, listProducts } from "@/lib/products"
import { paths } from "@/paths"

type Params = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const [product, locale] = await Promise.all([getProductBySlug(slug), getLocale()])
  if (!product) return {}
  const model = getModel(slug)
  return {
    title: model ? `Shoply ${model.name}` : product.name,
    description: model?.tagline[locale as Locale] ?? product.description ?? undefined,
  }
}

export default async function ProductPage({ params }: Params) {
  const { slug } = await params
  const [product, all, locale, t] = await Promise.all([getProductBySlug(slug), listProducts(), getLocale(), getTranslations("product")])
  if (!product) notFound()

  const l = locale as Locale
  const model = getModel(slug)
  const others = all.filter((p) => p.id !== product.id).slice(0, 2)
  const title = model?.name ?? product.name

  const specs = model
    ? [
        { label: t("lumens"), value: t("unitLumens", { count: formatNumber(model.lumens, l) }) },
        { label: t("range"), value: t("unitMeters", { count: model.range }) },
        { label: t("runtime"), value: t("unitHours", { count: model.runtime }) },
        { label: t("ipx"), value: model.ipx },
        { label: t("weight"), value: t("unitGrams", { count: model.weight }) },
        { label: t("length"), value: t("unitMm", { count: model.length }) },
        { label: t("battery"), value: model.battery[l] },
        { label: t("charge"), value: model.charge[l] },
        { label: t("finish"), value: model.finish.name[l] },
      ]
    : []

  const promises = [
    { icon: Truck, label: t("freeShipping") },
    { icon: RotateCcw, label: t("returns") },
    { icon: ShieldCheck, label: t("warranty") },
  ]

  return (
    <div className="mx-auto max-w-[1320px] px-5 pb-24 pt-28 md:px-8 md:pb-32 md:pt-32">
      <nav aria-label="Fil d'Ariane" className="eyebrow mb-6 flex items-center gap-2 text-faint">
        <Link href={paths.products.list} className="hover:text-foreground">
          {t("breadcrumb")}
        </Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page" className="text-muted-foreground">{title}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-7">
          <div className="lg:sticky lg:top-24">
            <ProductStage slug={slug} modes={model?.modes ?? []} code={model?.code} />
          </div>
        </div>

        <div className="lg:col-span-5">
          <p className="eyebrow text-beam-ink">
            {t("category")}
            {model && ` · ${model.finish.name[l]}`}
          </p>
          <h1 className="display mt-3 text-[clamp(3rem,7vw,6rem)] leading-[0.9]">{title}</h1>
          {model && <p className="mt-5 text-xl leading-snug">{model.tagline[l]}</p>}
          <p className="tabular mt-6 font-mono text-2xl">{formatPrice(product.priceCents, product.currency, l)}</p>

          <div className="mt-6">
            <PurchasePanel product={product} />
          </div>

          <ul className="mt-6 space-y-2.5 border-t pt-6">
            {promises.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-3 text-sm text-muted-foreground">
                <Icon aria-hidden="true" className="size-4 text-beam-ink" />
                {label}
              </li>
            ))}
          </ul>

          <p className="mt-8 text-[16px] leading-relaxed text-muted-foreground">{model?.description[l] ?? product.description}</p>

          {specs.length > 0 && (
            <section className="mt-10">
              <h2 className="eyebrow text-faint">{t("specs")}</h2>
              <dl className="mt-3 divide-y border-y">
                {specs.map((s) => (
                  <div key={s.label} className="flex items-baseline justify-between gap-6 py-3 text-sm">
                    <dt className="text-muted-foreground">{s.label}</dt>
                    <dd className="tabular text-right font-mono text-[13px]">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          {model && (
            <section className="mt-10">
              <h2 className="eyebrow text-faint">{t("inBox")}</h2>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {model.inBox.map((item) => (
                  <li key={item.fr} className="flex items-center gap-2.5 text-sm">
                    <Check aria-hidden="true" className="size-4 text-beam-ink" />
                    {item[l]}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>

      {others.length > 0 && (
        <section className="mt-24 border-t pt-14 md:mt-32">
          <h2 className="display text-[clamp(2rem,4vw,3.25rem)] leading-none">{t("others")}</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {others.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
