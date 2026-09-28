import { getLocale } from "next-intl/server"
import { redirect } from "@/i18n/navigation"
import { paths } from "@/paths"

// /account n'a pas de contenu propre : on ouvre l'historique des commandes
export default async function AccountIndex() {
  return redirect({ href: paths.account.orders, locale: await getLocale() })
}
