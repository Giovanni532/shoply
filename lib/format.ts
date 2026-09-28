// Prix et dates au format suisse, dans la langue de l'interface
const intlLocale = (locale: string) => (locale === "en" ? "en-CH" : "fr-CH")

export function formatPrice(cents: number, currency = "CHF", locale = "fr") {
  return new Intl.NumberFormat(intlLocale(locale), { style: "currency", currency, minimumFractionDigits: 2 }).format(cents / 100)
}

export function formatDate(value: Date | string | number, locale = "fr", withTime = false) {
  const date = value instanceof Date ? value : new Date(value)
  return new Intl.DateTimeFormat(intlLocale(locale), {
    day: "numeric",
    month: "long",
    year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  }).format(date)
}

export function formatNumber(value: number, locale = "fr") {
  return new Intl.NumberFormat(intlLocale(locale)).format(value)
}

/** Référence courte et lisible d'une commande (8 premiers caractères de l'UUID) */
export const orderRef = (id: string) => id.slice(0, 8).toUpperCase()

/** Chemin de retour après connexion : uniquement interne, jamais une URL externe */
export function safeRedirect(from: string | null | undefined, fallback = "/") {
  if (!from || !from.startsWith("/") || from.startsWith("//") || from.includes("\\") || /[\u0000-\u001f\u007f]/.test(from)) return fallback
  return from
}
