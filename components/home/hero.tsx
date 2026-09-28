"use client"

import { ArrowRight } from "lucide-react"
import { useTranslations } from "next-intl"
import { useEffect, useRef } from "react"
import { Flashlight } from "@/components/lamp/flashlight"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/navigation"
import { formatNumber } from "@/lib/format"
import { paths } from "@/paths"

// Proportions du dessin de la Pro (voir Flashlight) : position de la lentille
// et demi-hauteur de la lentille, rapportées à la largeur du SVG.
const LENS_X = 0.977
const LENS_HALF = 0.094
const RATIO = 104 / 352

// Le faisceau reste dans un cône vraisemblable : de la gauche vers le haut
const MIN_ANGLE = Math.PI * 0.9
const MAX_ANGLE = Math.PI * 1.62

// Marge autour du titre allumé : son halo ne doit pas être coupé par le bord du masque
const GLOW_PAD = 64

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))

export function Hero({ maxLumens, maxRange, locale }: { maxLumens: number; maxRange: number; locale: string }) {
  const t = useTranslations("hero")
  const sectionRef = useRef<HTMLElement>(null)
  const headlineRef = useRef<HTMLDivElement>(null)
  const litRef = useRef<HTMLDivElement>(null)
  const lampRef = useRef<HTMLDivElement>(null)
  const dockRef = useRef<HTMLDivElement>(null)
  const coneRef = useRef<SVGPolygonElement>(null)
  const coreRef = useRef<SVGPolygonElement>(null)
  const spotRef = useRef<SVGCircleElement>(null)
  const gradRef = useRef<SVGLinearGradientElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const headline = headlineRef.current
    const lit = litRef.current
    const lamp = lampRef.current
    if (!section || !headline || !lit || !lamp) return

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    let frame = 0
    let running = false
    let pointer: { x: number; y: number } | null = null
    const aim = { x: 0, y: 0, ready: false }
    let g = { w: 0, h: 0, L: 0, px: 0, py: 0, R: 0 }
    let box = { left: 0, top: 0, width: 0, height: 0 }

    const measure = () => {
      const w = section.clientWidth
      const h = section.clientHeight
      const mobile = w < 768
      const L = clamp(w * (mobile ? 0.56 : 0.32), 200, 470)
      const s = section.getBoundingClientRect()
      // Mobile : la lampe a sa propre place sous les boutons, pour ne rien masquer
      const dock = dockRef.current?.getBoundingClientRect()
      const py = mobile && dock ? dock.top - s.top + dock.height * 0.78 : h * 0.82
      g = { w, h, L, px: w * (mobile ? 0.96 : 0.9), py, R: clamp(w * 0.15, 90, 240) }
      lamp.style.width = `${L}px`
      const r = headline.getBoundingClientRect()
      box = { left: r.left - s.left, top: r.top - s.top, width: r.width, height: r.height }
    }

    // Sans souris : la lampe balaie le titre lentement
    const sweep = (time: number) => ({
      x: box.left + box.width * (0.5 + 0.42 * Math.sin(time * 0.00032)),
      y: box.top + box.height * (0.5 + 0.34 * Math.sin(time * 0.00051 + 1.2)),
    })

    const render = (time: number) => {
      const target = pointer ?? (reduce ? { x: box.left + box.width * 0.34, y: box.top + box.height * 0.5 } : sweep(time))
      if (!aim.ready) {
        aim.x = target.x
        aim.y = target.y
        aim.ready = true
      } else {
        const k = pointer ? 0.16 : 0.06
        aim.x += (target.x - aim.x) * k
        aim.y += (target.y - aim.y) * k
      }

      let a = Math.atan2(aim.y - g.py, aim.x - g.px)
      if (a < 0) a += Math.PI * 2
      a = clamp(a, MIN_ANGLE, MAX_ANGLE)
      const cos = Math.cos(a)
      const sin = Math.sin(a)
      const dist = Math.max(Math.hypot(aim.x - g.px, aim.y - g.py), g.L + 120)
      const sx = g.px + cos * dist
      const sy = g.py + sin * dist
      const hx = g.px + cos * g.L * LENS_X
      const hy = g.py + sin * g.L * LENS_X
      const nx = -sin
      const ny = cos
      const hw = g.L * LENS_HALF

      // La lampe tourne autour de son culot ; retournée pour garder le bouton au-dessus
      lamp.style.transform = `translate(${g.px}px, ${g.py}px) rotate(${a}rad) scaleY(-1) translateY(-50%)`
      lamp.style.opacity = "1"

      const pts = (w: number, r: number) =>
        `${hx + nx * w},${hy + ny * w} ${sx + nx * r},${sy + ny * r} ${sx - nx * r},${sy - ny * r} ${hx - nx * w},${hy - ny * w}`
      coneRef.current?.setAttribute("points", pts(hw, g.R))
      coreRef.current?.setAttribute("points", pts(hw * 0.55, g.R * 0.45))
      const grad = gradRef.current
      if (grad) {
        grad.setAttribute("x1", String(hx))
        grad.setAttribute("y1", String(hy))
        grad.setAttribute("x2", String(sx))
        grad.setAttribute("y2", String(sy))
      }
      const spot = spotRef.current
      if (spot) {
        spot.setAttribute("cx", String(sx))
        spot.setAttribute("cy", String(sy))
        spot.setAttribute("r", String(g.R * 1.35))
      }
      // Le titre « allumé » n'est visible que dans la tache de lumière
      lit.style.setProperty("--mx", `${sx - box.left + GLOW_PAD}px`)
      lit.style.setProperty("--my", `${sy - box.top + GLOW_PAD}px`)
      lit.style.setProperty("--mr", `${g.R * 1.1}px`)
    }

    const loop = (time: number) => {
      render(time)
      frame = requestAnimationFrame(loop)
    }
    const start = () => {
      if (running || document.hidden) return
      running = true
      frame = requestAnimationFrame(loop)
    }
    const stop = () => {
      running = false
      cancelAnimationFrame(frame)
    }

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return
      const s = section.getBoundingClientRect()
      pointer = { x: e.clientX - s.left, y: e.clientY - s.top }
      if (reduce) render(performance.now())
    }
    const onLeave = () => {
      pointer = null
      if (reduce) render(performance.now())
    }

    measure()
    render(performance.now())
    const ro = new ResizeObserver(() => {
      measure()
      render(performance.now())
    })
    ro.observe(section)
    section.addEventListener("pointermove", onMove)
    section.addEventListener("pointerleave", onLeave)

    // Animation uniquement quand le hero est à l'écran (et jamais en mouvement réduit)
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !reduce) start()
      else stop()
    })
    io.observe(section)
    const onVisibility = () => (document.hidden ? stop() : !reduce && start())
    document.addEventListener("visibilitychange", onVisibility)

    return () => {
      stop()
      ro.disconnect()
      io.disconnect()
      section.removeEventListener("pointermove", onMove)
      section.removeEventListener("pointerleave", onLeave)
      document.removeEventListener("visibilitychange", onVisibility)
    }
  }, [])

  const title = t("title")
  const stats = [
    { value: formatNumber(maxLumens, locale), label: t("stats.lumens") },
    { value: `${maxRange} m`, label: t("stats.range") },
    { value: "IPX8", label: t("stats.ipx") },
    { value: locale === "en" ? "5 years" : "5 ans", label: t("stats.warranty") },
  ]

  return (
    <section ref={sectionRef} className="night grain relative isolate flex min-h-[max(100svh,680px)] flex-col overflow-hidden bg-background text-foreground">
      {/* Faisceau et tache de lumière, sous le texte */}
      <svg aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 h-full w-full">
        <defs>
          <linearGradient ref={gradRef} id="hero-beam" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#ffe6b8" stopOpacity="0.5" />
            <stop offset="0.6" stopColor="#ffc266" stopOpacity="0.14" />
            <stop offset="1" stopColor="#ffb53d" stopOpacity="0.06" />
          </linearGradient>
          <radialGradient id="hero-spot">
            <stop offset="0" stopColor="#ffd592" stopOpacity="0.2" />
            <stop offset="0.55" stopColor="#ffc266" stopOpacity="0.07" />
            <stop offset="1" stopColor="#ffb53d" stopOpacity="0" />
          </radialGradient>
          <filter id="hero-soft" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="14" />
          </filter>
        </defs>
        <circle ref={spotRef} fill="url(#hero-spot)" />
        <polygon ref={coneRef} fill="url(#hero-beam)" filter="url(#hero-soft)" />
        <polygon ref={coreRef} fill="url(#hero-beam)" filter="url(#hero-soft)" opacity="0.7" />
      </svg>

      {/* La lampe, orientée à chaque image */}
      <div ref={lampRef} aria-hidden="true" className="pointer-events-none absolute left-0 top-0 origin-top-left opacity-0 transition-opacity duration-700" style={{ aspectRatio: `${1 / RATIO}` }}>
        <Flashlight slug="lampe-de-poche-pro" on />
      </div>

      <div className="relative mx-auto flex w-full max-w-[1320px] flex-1 flex-col px-5 pb-10 pt-32 md:px-8 md:pt-40">
        <p className="eyebrow flex items-center gap-2.5 text-muted-foreground">
          <span className="size-1.5 rounded-full bg-beam shadow-[0_0_10px_var(--beam)]" />
          {t("eyebrow")}
        </p>

        {/* Deux calques identiques : l'un dans la pénombre, l'autre révélé par le faisceau */}
        <div ref={headlineRef} className="relative mt-6 grid max-w-[14ch] md:mt-8">
          <h1 className="display col-start-1 row-start-1 text-[clamp(3.25rem,9.4vw,9.75rem)] leading-[0.9] text-faint">{title}</h1>
          <div
            ref={litRef}
            aria-hidden="true"
            className="display pointer-events-none col-start-1 row-start-1 -m-16 p-16 text-[clamp(3.25rem,9.4vw,9.75rem)] leading-[0.9] text-[#fff6e3] [text-shadow:0_0_40px_rgb(255_194_102/0.45)]"
            style={{
              ["--mx" as string]: "30%",
              ["--my" as string]: "50%",
              ["--mr" as string]: "220px",
              maskImage: "radial-gradient(circle var(--mr) at var(--mx) var(--my), #000 0%, rgb(0 0 0 / 0.85) 38%, transparent 100%)",
              WebkitMaskImage: "radial-gradient(circle var(--mr) at var(--mx) var(--my), #000 0%, rgb(0 0 0 / 0.85) 38%, transparent 100%)",
            }}
          >
            {title}
          </div>
        </div>

        <p className="mt-8 max-w-md text-[17px] leading-relaxed text-muted-foreground">{t("subtitle")}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href={paths.products.list}>
              {t("ctaPrimary")}
              <ArrowRight />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/#portee">{t("ctaSecondary")}</Link>
          </Button>
        </div>

        <div ref={dockRef} aria-hidden="true" className="h-[30svh] min-h-52 md:hidden" />

        <div className="mt-auto pt-16 md:pt-16">
          <p className="eyebrow mb-5 text-faint">
            <span className="hidden [@media(hover:hover)]:inline">{t("hint")}</span>
            <span className="[@media(hover:hover)]:hidden">{t("hintTouch")}</span>
          </p>
          <dl className="grid max-w-3xl grid-cols-2 gap-x-6 gap-y-5 border-t pt-5 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col-reverse">
                <dt className="mt-1 text-[13px] text-muted-foreground">{s.label}</dt>
                <dd className="display tabular text-2xl md:text-3xl">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
