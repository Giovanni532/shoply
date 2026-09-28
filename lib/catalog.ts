// Fiches produit enrichies, indexées par slug.
// La base (Turso) garde le prix, le stock et le nom ; tout ce qui raconte la
// lampe — accroche, fiche technique, dessin — vit ici, sans migration.

export type Locale = "fr" | "en"
type L = Record<Locale, string>

export type Finish = {
  name: L
  /** Dégradé métal : reflet, teinte, ombre */
  light: string
  mid: string
  dark: string
}

/** Géométrie du dessin (vue de profil, tête à droite), en unités SVG */
export type LampShape = {
  tail: number
  body: number
  neck: number
  head: number
  tailH: number
  bodyH: number
  headH: number
  /** Zone moletée sur le corps, en fraction [début, fin] */
  knurl?: [number, number]
  fins?: number
  clip?: boolean
  ring?: boolean
  /** Position du bouton sur le corps, en fraction */
  button?: number
  /** Bague colorée entre le corps et la tête */
  band?: string
}

export type Mode = { key: "eco" | "normal" | "turbo"; lumens: number; hours: number }

export type Model = {
  slug: string
  code: string
  name: string
  tagline: L
  description: L
  finish: Finish
  shape: LampShape
  lumens: number
  range: number
  runtime: number
  ipx: string
  weight: number
  length: number
  battery: L
  charge: L
  modes: Mode[]
  inBox: L[]
}

const MODELS: Model[] = [
  {
    slug: "lampe-de-poche-classic",
    code: "N°01",
    name: "Classic",
    tagline: {
      fr: "La lampe qu'on garde dans la boîte à gants pendant dix ans.",
      en: "The torch that lives in your glovebox for ten years.",
    },
    description: {
      fr: "Corps en aluminium anodisé, LED haute efficacité et un seul bouton : la Classic fait une chose, et la fait bien. Assez compacte pour une poche de veste, assez puissante pour éclairer un sentier.",
      en: "Anodised aluminium body, a high-efficiency LED and a single button: the Classic does one thing and does it well. Compact enough for a jacket pocket, bright enough for a trail.",
    },
    finish: { name: { fr: "Anodisé noir", en: "Black anodised" }, light: "#86868e", mid: "#2e2e33", dark: "#0e0e10" },
    shape: { tail: 26, body: 150, neck: 26, head: 76, tailH: 46, bodyH: 42, headH: 62, knurl: [0.12, 0.62], button: 0.82, band: "#1b1b1e" },
    lumens: 450,
    range: 120,
    runtime: 6,
    ipx: "IPX4",
    weight: 98,
    length: 128,
    battery: { fr: "Li-ion 18650 · 2600 mAh", en: "Li-ion 18650 · 2600 mAh" },
    charge: { fr: "USB-C, 2 h", en: "USB-C, 2 h" },
    modes: [
      { key: "eco", lumens: 40, hours: 40 },
      { key: "normal", lumens: 180, hours: 12 },
      { key: "turbo", lumens: 450, hours: 6 },
    ],
    inBox: [
      { fr: "Lampe Classic", en: "Classic torch" },
      { fr: "Batterie 18650", en: "18650 battery" },
      { fr: "Câble USB-C", en: "USB-C cable" },
      { fr: "Dragonne", en: "Lanyard" },
    ],
  },
  {
    slug: "lampe-de-poche-pro",
    code: "N°02",
    name: "Pro",
    tagline: {
      fr: "1 200 lumens pour ceux dont le travail commence à la tombée de la nuit.",
      en: "1,200 lumens for people whose work starts at nightfall.",
    },
    description: {
      fr: "Tête à ailettes pour dissiper la chaleur, moletage profond pour la prise en main avec des gants, étanchéité IPX8 : la Pro est pensée pour les secours, les chantiers et les longues sorties.",
      en: "A finned head to shed heat, deep knurling for a gloved grip and IPX8 waterproofing: the Pro is built for rescue teams, job sites and long nights out.",
    },
    finish: { name: { fr: "Titane brossé", en: "Brushed titanium" }, light: "#c9ccd2", mid: "#7c8088", dark: "#3b3e44" },
    shape: { tail: 30, body: 176, neck: 30, head: 96, tailH: 50, bodyH: 46, headH: 76, knurl: [0.06, 0.7], fins: 5, clip: true, button: 0.86, band: "#ffb53d" },
    lumens: 1200,
    range: 300,
    runtime: 4,
    ipx: "IPX8",
    weight: 186,
    length: 158,
    battery: { fr: "Li-ion 21700 · 5000 mAh", en: "Li-ion 21700 · 5000 mAh" },
    charge: { fr: "USB-C rapide, 2 h 30", en: "Fast USB-C, 2.5 h" },
    modes: [
      { key: "eco", lumens: 60, hours: 60 },
      { key: "normal", lumens: 500, hours: 9 },
      { key: "turbo", lumens: 1200, hours: 4 },
    ],
    inBox: [
      { fr: "Lampe Pro", en: "Pro torch" },
      { fr: "Batterie 21700", en: "21700 battery" },
      { fr: "Câble USB-C", en: "USB-C cable" },
      { fr: "Étui de ceinture", en: "Belt holster" },
      { fr: "Joints de rechange", en: "Spare O-rings" },
    ],
  },
  {
    slug: "lampe-de-poche-mini",
    code: "N°03",
    name: "Mini",
    tagline: {
      fr: "28 grammes, accrochée à vos clés, toujours là quand la lumière s'éteint.",
      en: "28 grams on your keyring, always there when the lights go out.",
    },
    description: {
      fr: "La Mini tient entre deux doigts et se recharge en USB-C. Son boîtier en cuivre patine avec le temps : chaque lampe finit par vous ressembler.",
      en: "The Mini fits between two fingers and charges over USB-C. Its copper body patinas over time, so every one ends up looking like its owner.",
    },
    finish: { name: { fr: "Cuivre brut", en: "Raw copper" }, light: "#f0b184", mid: "#b8683d", dark: "#6b3419" },
    shape: { tail: 18, body: 70, neck: 14, head: 40, tailH: 34, bodyH: 32, headH: 40, knurl: [0.1, 0.55], ring: true, band: "#3a1d0f" },
    lumens: 150,
    range: 40,
    runtime: 3,
    ipx: "IPX6",
    weight: 28,
    length: 72,
    battery: { fr: "Li-ion intégrée · 500 mAh", en: "Built-in Li-ion · 500 mAh" },
    charge: { fr: "USB-C, 45 min", en: "USB-C, 45 min" },
    modes: [
      { key: "eco", lumens: 15, hours: 20 },
      { key: "normal", lumens: 60, hours: 7 },
      { key: "turbo", lumens: 150, hours: 3 },
    ],
    inBox: [
      { fr: "Lampe Mini", en: "Mini torch" },
      { fr: "Anneau porte-clés", en: "Key ring" },
      { fr: "Câble USB-C", en: "USB-C cable" },
    ],
  },
]

const BY_SLUG = new Map(MODELS.map((m) => [m.slug, m]))

// Produit ajouté en base sans fiche : un dessin neutre, sans fiche technique inventée
const FALLBACK_SHAPE: LampShape = { tail: 24, body: 140, neck: 24, head: 70, tailH: 44, bodyH: 40, headH: 58, knurl: [0.15, 0.6], button: 0.8 }
const FALLBACK_FINISH: Finish = { name: { fr: "Aluminium", en: "Aluminium" }, light: "#8d8f95", mid: "#4a4b50", dark: "#1c1c1f" }

export function getModel(slug: string | null | undefined): Model | undefined {
  return slug ? BY_SLUG.get(slug) : undefined
}

export function lampLook(slug: string | null | undefined): { shape: LampShape; finish: Finish } {
  const model = getModel(slug)
  return { shape: model?.shape ?? FALLBACK_SHAPE, finish: model?.finish ?? FALLBACK_FINISH }
}

export const MAX_RANGE = Math.max(...MODELS.map((m) => m.range))
export const MAX_LUMENS = Math.max(...MODELS.map((m) => m.lumens))
