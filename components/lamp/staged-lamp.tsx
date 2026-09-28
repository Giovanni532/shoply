"use client"

import { Flashlight, lampFrame, lampLength } from "@/components/lamp/flashlight"
import { lampLook } from "@/lib/catalog"

// La plus longue lampe de la gamme sert d'étalon : une Mini paraît plus petite qu'une Pro
const REFERENCE = 340

/**
 * Lampe centrée dans un conteneur `relative overflow-hidden`, à l'échelle de sa taille réelle.
 * Le faisceau part vers la droite et déborde du cadre, comme une vraie lumière.
 */
export function StagedLamp({
  slug,
  on = "hover",
  beam = true,
  width = 62,
  tilt = -7,
  anchor = 50,
  intensity,
}: {
  slug?: string | null
  on?: boolean | "hover"
  beam?: boolean
  /** Largeur de la plus grande lampe, en % du conteneur */
  width?: number
  tilt?: number
  /** Position horizontale du centre de la lampe, en % (à gauche = plus de place pour le faisceau) */
  anchor?: number
  intensity?: number
}) {
  const { shape } = lampLook(slug)
  const frame = lampFrame(shape, beam)
  const lampPct = width * Math.sqrt(lampLength(shape) / REFERENCE)
  const svgPct = (lampPct * frame.W) / frame.L
  const left = anchor - svgPct * (frame.center / frame.W)

  return (
    <div
      className="pointer-events-none absolute top-1/2 transition-transform duration-700 ease-out-expo group-hover:scale-[1.03]"
      style={{
        left: `${left}%`,
        width: `${svgPct}%`,
        transform: `translateY(-50%) rotate(${tilt}deg)`,
        transformOrigin: `${(frame.center / frame.W) * 100}% 50%`,
      }}
    >
      <Flashlight slug={slug} on={on} beam={beam} shadow intensity={intensity} />
    </div>
  )
}
