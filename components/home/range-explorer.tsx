"use client"

import { animate, motion, useMotionValue, useTransform } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useEffect, useState } from "react"
import { Flashlight } from "@/components/lamp/flashlight"
import { Link } from "@/i18n/navigation"
import { getModel, MAX_RANGE, type Model } from "@/lib/catalog"
import { formatNumber } from "@/lib/format"
import { cn } from "@/lib/utils"
import { paths } from "@/paths"

const EASE = [0.16, 1, 0.3, 1] as const
// Le faisceau part de 12 % (après la lampe) et peut aller jusqu'à 97 % de la scène
const START = 12
const SPAN = 85
const TICKS = [0, 50, 100, 150, 200, 250, 300]

function Counter({ value, locale }: { value: number; locale: string }) {
  const mv = useMotionValue(value)
  const text = useTransform(mv, (v) => formatNumber(Math.round(v), locale))
  useEffect(() => {
    const controls = animate(mv, value, { duration: 0.9, ease: EASE })
    return () => controls.stop()
  }, [mv, value])
  return <motion.span>{text}</motion.span>
}

// « Jusqu'où porte votre lampe ? » : le faisceau s'étend à l'échelle de la portée réelle.
export function RangeExplorer({ slugs }: { slugs: string[] }) {
  const t = useTranslations("home.explorer")
  const locale = useLocale()
  const models = slugs.map((s) => getModel(s)).filter((m): m is Model => Boolean(m))
  const [active, setActive] = useState(() => models.find((m) => m.name === "Classic")?.slug ?? models[0]?.slug)
  const model = models.find((m) => m.slug === active) ?? models[0]
  if (!model) return null

  const reach = (model.range / MAX_RANGE) * SPAN
  const maxRuntime = Math.max(...model.modes.map((m) => m.hours))

  return (
    <section id="portee" className="scroll-mt-24">
      <div className="mx-auto max-w-[1320px] px-5 py-24 md:px-8 md:py-32">
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <p className="eyebrow text-beam-ink">{t("eyebrow")}</p>
            <h2 className="display mt-4 text-[clamp(2.25rem,5vw,4.25rem)] leading-[0.95]">{t("title")}</h2>
          </div>
          <p className="max-w-md text-[17px] leading-relaxed text-muted-foreground md:col-span-5">{t("lede")}</p>
        </div>

        <div role="tablist" aria-label={t("title")} className="mt-10 flex flex-wrap gap-2">
          {models.map((m) => (
            <button
              key={m.slug}
              role="tab"
              type="button"
              aria-selected={m.slug === model.slug}
              aria-controls="portee-stage"
              onClick={() => setActive(m.slug)}
              className={cn(
                "flex cursor-pointer items-baseline gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
                m.slug === model.slug ? "border-beam bg-primary text-primary-foreground" : "text-muted-foreground hover:border-foreground/30 hover:text-foreground",
              )}
            >
              <span className="font-mono text-[11px] font-normal opacity-70">{m.code}</span>
              {m.name}
            </button>
          ))}
        </div>

        <div id="portee-stage" role="tabpanel" className="night grain relative mt-6 overflow-hidden rounded-xl border bg-background">
          <div className="relative h-[240px] md:h-[340px]">
            {/* Quadrillage de mesure, tous les 50 m */}
            {TICKS.map((m) => (
              <span key={m} aria-hidden="true" className="absolute inset-y-0 w-px bg-foreground/[0.06]" style={{ left: `${START + (m / MAX_RANGE) * SPAN}%` }} />
            ))}

            {/* Faisceau */}
            <motion.div
              aria-hidden="true"
              className="absolute top-1/2 h-[88%] -translate-y-1/2 blur-[6px]"
              style={{
                left: `${START - 1}%`,
                clipPath: "polygon(0 44%, 100% 0, 100% 100%, 0 56%)",
                background: "linear-gradient(90deg, rgb(255 230 184 / 0.7), rgb(255 194 102 / 0.22) 55%, rgb(255 181 61 / 0.04))",
              }}
              initial={false}
              animate={{ width: `${reach + 1}%` }}
              transition={{ duration: 0.9, ease: EASE }}
            />
            {/* Marqueur de portée */}
            <motion.div
              className="absolute inset-y-6 flex w-px flex-col items-center"
              initial={false}
              animate={{ left: `${START + reach}%` }}
              transition={{ duration: 0.9, ease: EASE }}
            >
              <span className="h-full w-px border-l border-dashed border-beam/70" />
              <span className="eyebrow tabular absolute -top-1 -translate-y-full whitespace-nowrap text-beam-ink md:top-0 md:translate-y-0 md:translate-x-3 md:self-start">
                {t("meters", { count: model.range })}
              </span>
            </motion.div>

            <div className="absolute left-[2%] top-1/2 w-[11%] -translate-y-1/2">
              <Flashlight slug={model.slug} on intensity={0.8} />
            </div>
          </div>

          {/* Règle graduée */}
          <div className="relative h-10 border-t">
            {TICKS.map((m) => (
              <span key={m} className="tabular absolute top-3 -translate-x-1/2 font-mono text-[11px] text-faint" style={{ left: `${START + (m / MAX_RANGE) * SPAN}%` }}>
                {m}
                {m === MAX_RANGE ? " m" : ""}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-4 sm:items-end">
          <dl className="contents">
            {[
              { label: t("lumens"), value: <><Counter value={model.lumens} locale={locale} /> lm</> },
              { label: t("range"), value: <><Counter value={model.range} locale={locale} /> m</> },
              { label: t("runtime"), value: <><Counter value={maxRuntime} locale={locale} /> h</> },
            ].map((s) => (
              <div key={s.label} className="flex flex-col-reverse border-t pt-4">
                <dt className="mt-1 text-[13px] text-muted-foreground">{s.label}</dt>
                <dd className="display tabular text-3xl md:text-4xl">{s.value}</dd>
              </div>
            ))}
          </dl>
          <Link href={paths.products.details(model.slug)} className="group inline-flex items-center gap-2 justify-self-start text-sm font-semibold sm:justify-self-end">
            <span className="underline decoration-foreground/25 underline-offset-4 group-hover:decoration-beam">{t("see", { name: model.name })}</span>
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
