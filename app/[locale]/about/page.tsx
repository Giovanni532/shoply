import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { Flashlight } from "@/components/lamp/flashlight"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("about")
  return { title: t("eyebrow"), description: t("lede") }
}

const SLUGS = ["lampe-de-poche-mini", "lampe-de-poche-classic", "lampe-de-poche-pro"]

export default async function AboutPage() {
  const t = await getTranslations("about")
  const principles = ["durable", "repairable", "rechargeable"] as const
  const figures = [
    { value: "3 400+", label: t("figures.tested") },
    { value: "5", label: t("figures.warranty") },
    { value: "100 %", label: t("figures.parts") },
  ]

  return (
    <div className="mx-auto max-w-[1320px] px-5 pb-24 pt-32 md:px-8 md:pb-32 md:pt-40">
      <header className="max-w-4xl">
        <p className="eyebrow text-beam-ink">{t("eyebrow")}</p>
        <h1 className="display mt-4 text-[clamp(2.75rem,6.6vw,6rem)] leading-[0.92]">{t("title")}</h1>
        <p className="mt-6 max-w-2xl text-xl leading-snug text-muted-foreground">{t("lede")}</p>
      </header>

      {/* L'établi : la gamme alignée, de la plus petite à la plus grande */}
      <div aria-hidden="true" className="night grain mt-14 overflow-hidden rounded-2xl border bg-background px-6 py-14 md:mt-20 md:px-16 md:py-20">
        <div className="mx-auto flex max-w-4xl flex-col gap-10">
          {SLUGS.map((slug, i) => (
            <div key={slug} style={{ width: `${[34, 62, 76][i]}%` }}>
              <Flashlight slug={slug} shadow on={i === 2} />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16 grid gap-10 md:mt-24 md:grid-cols-12">
        <div className="space-y-6 text-lg leading-relaxed md:col-span-7">
          <p>{t("p1")}</p>
          <p className="text-muted-foreground">{t("p2")}</p>
          <p className="text-muted-foreground">{t("p3")}</p>
        </div>
        <dl className="grid content-start gap-6 md:col-span-4 md:col-start-9">
          {figures.map((f) => (
            <div key={f.label} className="flex flex-col-reverse border-t pt-4">
              <dt className="mt-1 text-sm text-muted-foreground">{f.label}</dt>
              <dd className="display tabular text-4xl">{f.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <ol className="mt-20 grid gap-px overflow-hidden rounded-xl border bg-border md:mt-28 md:grid-cols-3">
        {principles.map((key, i) => (
          <li key={key} className="bg-background p-6 md:p-8">
            <span className="eyebrow tabular text-beam-ink">{String(i + 1).padStart(2, "0")}</span>
            <h2 className="display mt-4 text-2xl">{t(`principles.${key}.title`)}</h2>
            <p className="mt-2 text-muted-foreground">{t(`principles.${key}.desc`)}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}
