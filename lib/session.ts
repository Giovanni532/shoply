import { headers } from "next/headers"
import { cache } from "react"
import { auth } from "@/lib/auth"

/** Session de la requête en cours, lue une seule fois (layout + page partagent le résultat) */
export const getServerSession = cache(async () => auth.api.getSession({ headers: await headers() }))
