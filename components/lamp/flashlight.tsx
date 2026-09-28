"use client"

import { useId } from "react"
import { lampLook, type Finish, type LampShape } from "@/lib/catalog"
import { cn } from "@/lib/utils"

// Lampe de poche dessinée en SVG, de profil, tête à droite.
// `on` allume la lentille ; `beam` ajoute le cône de lumière dans le dessin ;
// "hover" réserve l'allumage au survol du parent `.group`.
export type FlashlightProps = {
  slug?: string | null
  shape?: LampShape
  finish?: Finish
  on?: boolean | "hover"
  beam?: boolean
  /** 0 → 1 : force du faisceau (modes éco / normal / turbo) */
  intensity?: number
  shadow?: boolean
  className?: string
  title?: string
}

const BEZEL = 8

export function lampLength(shape: LampShape) {
  return shape.tail + shape.body + shape.neck + shape.head + BEZEL
}

/** Cadre du dessin : largeur totale, et où se trouve la lampe dedans (pour la centrer malgré le faisceau) */
export function lampFrame(shape: LampShape, beam: boolean) {
  const pad = shape.ring ? 30 : 6
  const L = lampLength(shape)
  const W = pad + L + 6 + (beam ? Math.round(L * 1.7) : 0)
  return { W, L, center: pad + L / 2 }
}

export function Flashlight({ slug, shape: shapeProp, finish: finishProp, on = false, beam = false, intensity = 1, shadow = false, className, title }: FlashlightProps) {
  const look = lampLook(slug)
  const s = shapeProp ?? look.shape
  const f = finishProp ?? look.finish
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "")
  const id = (name: string) => `${uid}-${name}`

  const pad = s.ring ? 30 : 6
  const L = lampLength(s)
  const beamLen = beam ? Math.round(L * 1.7) : 0
  const spread = s.headH * 1.9
  const lampH = s.headH + 28
  const H = Math.max(lampH, beam ? spread * 2 + 8 : 0) + (shadow ? 22 : 0)
  const W = pad + L + 6 + beamLen
  const cy = (beam ? Math.max(lampH, spread * 2 + 8) : lampH) / 2

  const x1 = pad + s.tail
  const x2 = x1 + s.body
  const x3 = x2 + s.neck
  const x4 = x3 + s.head
  const lensX = x4 + BEZEL - 2
  const lensRy = s.headH / 2 - 5
  const hover = on === "hover"
  const lit = on === true

  // Allumage : visible si `on`, ou au survol du groupe parent
  const litClass = cn("transition-opacity duration-500 ease-out", hover ? "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100" : lit ? "opacity-100" : "opacity-0")

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={cn("block h-auto w-full overflow-visible", className)}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <defs>
        <linearGradient id={id("metal")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={f.dark} />
          <stop offset="0.16" stopColor={f.mid} />
          <stop offset="0.34" stopColor={f.light} />
          <stop offset="0.5" stopColor={f.mid} />
          <stop offset="0.86" stopColor={f.dark} />
          <stop offset="1" stopColor={f.dark} />
        </linearGradient>
        <linearGradient id={id("bezel")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={f.mid} />
          <stop offset="0.3" stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="0.55" stopColor={f.light} />
          <stop offset="1" stopColor={f.dark} />
        </linearGradient>
        <pattern id={id("knurl")} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="6" height="6" fill="transparent" />
          <path d="M0 0H6M0 0V6" stroke="#000" strokeOpacity="0.38" strokeWidth="1.4" />
        </pattern>
        <radialGradient id={id("lens-off")} cx="0.35" cy="0.35" r="0.8">
          <stop offset="0" stopColor="#6b6b70" />
          <stop offset="1" stopColor="#1a1a1c" />
        </radialGradient>
        <radialGradient id={id("lens-on")} cx="0.5" cy="0.5" r="0.6">
          <stop offset="0" stopColor="#fffaf0" />
          <stop offset="0.55" stopColor="#ffe2a8" />
          <stop offset="1" stopColor="#ffb53d" />
        </radialGradient>
        <radialGradient id={id("glow")}>
          <stop offset="0" stopColor="#ffd28a" stopOpacity={0.75 * intensity} />
          <stop offset="1" stopColor="#ffb53d" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={id("beam")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ffe3ad" stopOpacity={0.62 * intensity} />
          <stop offset="0.45" stopColor="#ffc266" stopOpacity={0.2 * intensity} />
          <stop offset="1" stopColor="#ffb53d" stopOpacity="0" />
        </linearGradient>
        <filter id={id("soft")} x="-20%" y="-50%" width="140%" height="200%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
        <filter id={id("shadow")} x="-10%" y="-200%" width="120%" height="500%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>

      {shadow && (
        <ellipse cx={pad + L * 0.5} cy={cy + s.headH / 2 + 14} rx={L * 0.44} ry={5} fill="#000" opacity="0.5" filter={`url(#${id("shadow")})`} />
      )}

      {/* Faisceau : derrière la lampe, flouté */}
      {beam && (
        <g className={litClass} style={{ mixBlendMode: "screen" }}>
          <polygon
            points={`${lensX},${cy - lensRy} ${W},${cy - spread} ${W},${cy + spread} ${lensX},${cy + lensRy}`}
            fill={`url(#${id("beam")})`}
            filter={`url(#${id("soft")})`}
          />
          {/* Cœur du faisceau, plus serré et plus dense */}
          <polygon
            points={`${lensX},${cy - lensRy * 0.6} ${W},${cy - spread * 0.4} ${W},${cy + spread * 0.4} ${lensX},${cy + lensRy * 0.6}`}
            fill={`url(#${id("beam")})`}
            filter={`url(#${id("soft")})`}
            opacity="0.8"
          />
        </g>
      )}

      {/* Anneau porte-clés */}
      {s.ring && <circle cx={pad - 12} cy={cy} r={11} fill="none" stroke={`url(#${id("bezel")})`} strokeWidth="4" />}

      {/* Culot */}
      <rect x={pad} y={cy - s.tailH / 2} width={s.tail} height={s.tailH} rx={7} fill={`url(#${id("metal")})`} />
      <rect x={pad} y={cy - s.tailH / 2 + 3} width={3} height={s.tailH - 6} rx={1.5} fill="#000" opacity="0.35" />

      {/* Corps + moletage */}
      <rect x={x1} y={cy - s.bodyH / 2} width={s.body} height={s.bodyH} fill={`url(#${id("metal")})`} />
      {s.knurl && (
        <rect
          x={x1 + s.body * s.knurl[0]}
          y={cy - s.bodyH / 2}
          width={s.body * (s.knurl[1] - s.knurl[0])}
          height={s.bodyH}
          fill={`url(#${id("knurl")})`}
        />
      )}

      <rect x={x1} y={cy - s.bodyH / 2 + s.bodyH * 0.26} width={s.body} height={1.5} fill="#fff" opacity="0.14" />

      {/* Clip de poche */}
      {s.clip && (
        <g>
          <rect x={x1 + s.body * 0.1} y={cy - s.bodyH / 2 - 7} width={s.body * 0.56} height={6} rx={3} fill={`url(#${id("bezel")})`} />
          <rect x={x1 + s.body * 0.62} y={cy - s.bodyH / 2 - 8} width={12} height={9} rx={2} fill={f.dark} />
        </g>
      )}

      {/* Bouton */}
      {s.button !== undefined && (
        <g>
          <rect x={x1 + s.body * s.button - 10} y={cy - s.bodyH / 2 - 6} width={20} height={9} rx={4} fill="#131315" />
          <rect x={x1 + s.body * s.button - 7} y={cy - s.bodyH / 2 - 5} width={14} height={2} rx={1} fill="#fff" opacity="0.18" />
        </g>
      )}

      {/* Col évasé et bague */}
      <polygon
        points={`${x2},${cy - s.bodyH / 2} ${x3},${cy - s.headH / 2} ${x3},${cy + s.headH / 2} ${x2},${cy + s.bodyH / 2}`}
        fill={`url(#${id("metal")})`}
      />
      {s.band && <rect x={x2 - 3} y={cy - s.bodyH / 2 - 1} width={6} height={s.bodyH + 2} rx={1} fill={s.band} />}

      {/* Tête, ailettes de dissipation */}
      <rect x={x3} y={cy - s.headH / 2} width={s.head} height={s.headH} rx={3} fill={`url(#${id("metal")})`} />
      <rect x={x3} y={cy - s.headH / 2 + s.headH * 0.26} width={s.head} height={1.5} fill="#fff" opacity="0.14" />
      {Array.from({ length: s.fins ?? 0 }, (_, i) => (
        <rect key={i} x={x3 + 10 + i * 11} y={cy - s.headH / 2 + 5} width={3.5} height={s.headH - 10} rx={1.75} fill="#000" opacity="0.32" />
      ))}

      {/* Couronne + lentille */}
      <rect x={x4} y={cy - s.headH / 2 - 2} width={BEZEL} height={s.headH + 4} rx={3} fill={`url(#${id("bezel")})`} />
      <ellipse cx={lensX} cy={cy} rx={4} ry={lensRy} fill={`url(#${id("lens-off")})`} />
      <g className={litClass}>
        <circle cx={lensX + s.headH * 0.3} cy={cy} r={s.headH * 0.75} fill={`url(#${id("glow")})`} style={{ mixBlendMode: "screen" }} />
        <ellipse cx={lensX} cy={cy} rx={4} ry={lensRy} fill={`url(#${id("lens-on")})`} />
      </g>
    </svg>
  )
}
