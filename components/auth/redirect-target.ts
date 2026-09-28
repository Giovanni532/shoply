import { safeRedirect } from "@/lib/format"

/**
 * Où revenir après connexion : `from` (posé par le proxy ou le checkout), sinon l'accueil.
 * Le proxy transmet le chemin complet (/fr/account/…) : on retire la langue, le routeur la remet.
 */
export function redirectTarget(from: string | null) {
  return safeRedirect(from).replace(/^\/(fr|en)(?=\/|$)/, "") || "/"
}
