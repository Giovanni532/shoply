import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { Suspense } from "react"
import { AuthShell } from "@/components/auth/auth-shell"
import { LoginForm } from "@/components/auth"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("auth")
  return { title: t("signIn"), robots: { index: false } }
}

export default function LoginPage() {
  return (
    <AuthShell>
      {/* useSearchParams (retour après connexion) exige une frontière Suspense */}
      <Suspense>
        <LoginForm />
      </Suspense>
    </AuthShell>
  )
}
