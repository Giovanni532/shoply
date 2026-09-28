import { getLocale, getTranslations } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import { getModel, MAX_LUMENS, MAX_RANGE, type Locale, type Model } from "@/lib/catalog"
import { formatNumber, formatPrice } from "@/lib/format"
import type { ProductView } from "@/lib/products"
import { paths } from "@/paths"

// Comparatif : une colonne par lampe, des barres de lumière pour les deux chiffres qui comptent
export async function CompareTable({ products }: { products: ProductView[] }) {
  const t = await getTranslations("product")
  const locale = (await getLocale()) as Locale
  const rows = products.map((p) => ({ product: p, model: getModel(p.slug) })).filter((r): r is { product: ProductView; model: Model } => Boolean(r.model))
  if (rows.length < 2) return null

  const bar = (value: number, max: number) => (
    <span aria-hidden="true" className="mt-2 block h-1 overflow-hidden rounded-full bg-foreground/[0.07]">
      <span className="block h-full rounded-full bg-beam shadow-[0_0_10px_var(--beam)]" style={{ width: `${(value / max) * 100}%` }} />
    </span>
  )

  const specs: { label: string; render: (m: Model, p: ProductView) => React.ReactNode }[] = [
    { label: t("price"), render: (_m, p) => formatPrice(p.priceCents, p.currency, locale) },
    { label: t("lumens"), render: (m) => <>{t("unitLumens", { count: formatNumber(m.lumens, locale) })}{bar(m.lumens, MAX_LUMENS)}</> },
    { label: t("range"), render: (m) => <>{t("unitMeters", { count: m.range })}{bar(m.range, MAX_RANGE)}</> },
    { label: t("runtime"), render: (m) => t("unitHours", { count: m.runtime }) },
    { label: t("ipx"), render: (m) => m.ipx },
    { label: t("weight"), render: (m) => t("unitGrams", { count: m.weight }) },
    { label: t("length"), render: (m) => t("unitMm", { count: m.length }) },
    { label: t("battery"), render: (m) => m.battery[locale] },
    { label: t("charge"), render: (m) => m.charge[locale] },
    { label: t("finish"), render: (m) => m.finish.name[locale] },
  ]

  return (
    <div className="overflow-x-auto rounded-xl border">
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b bg-card/50">
            <th scope="col" className="w-[22%] px-5 py-4 font-normal">
              <span className="sr-only">{t("specs")}</span>
            </th>
            {rows.map(({ product, model }) => (
              <th key={product.id} scope="col" className="px-5 py-4 align-bottom">
                <span className="eyebrow block font-normal text-faint">{model.code}</span>
                <Link href={paths.products.details(product.slug)} className="display mt-1 block text-xl hover:text-beam-ink">
                  {model.name}
                </Link>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {specs.map((spec) => (
            <tr key={spec.label} className="border-b last:border-b-0">
              <th scope="row" className="px-5 py-3.5 font-normal text-muted-foreground">
                {spec.label}
              </th>
              {rows.map(({ product, model }) => (
                <td key={product.id} className="tabular px-5 py-3.5 font-mono text-[13px]">
                  {spec.render(model, product)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
