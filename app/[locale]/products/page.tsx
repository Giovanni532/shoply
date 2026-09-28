import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { SectionHeading } from "@/components/home/section-heading"
import { CompareTable } from "@/components/product/compare-table"
import { ProductsBrowser } from "@/components/product/products-browser"
import { listProducts } from "@/lib/products"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("products")
  return { title: t("title"), description: t("lede") }
}

export default async function ProductsPage() {
  const [products, t] = await Promise.all([listProducts(), getTranslations("products")])
  return (
    <div className="mx-auto max-w-[1320px] px-5 pb-24 pt-32 md:px-8 md:pb-32 md:pt-40">
      <header className="mb-12 grid gap-6 md:grid-cols-12 md:items-end">
        <div className="md:col-span-7">
          <p className="eyebrow text-beam-ink">{t("eyebrow")}</p>
          <h1 className="display mt-4 text-[clamp(2.75rem,7vw,6rem)] leading-[0.92]">{t("title")}</h1>
        </div>
        <p className="max-w-md text-[17px] leading-relaxed text-muted-foreground md:col-span-5">{t("lede")}</p>
      </header>

      <ProductsBrowser products={products} />

      <section className="mt-24 md:mt-32">
        <SectionHeading eyebrow={t("compare.eyebrow")} title={t("compare.title")} lede={t("compare.lede")} className="mb-10" />
        <CompareTable products={products} />
      </section>
    </div>
  )
}
