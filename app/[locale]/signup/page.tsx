import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { Suspense } from "react"
import { AuthShell } from "@/components/auth/auth-shell"
import { SignupForm } from "@/components/auth"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("auth")
  return { title: t("signUp"), robots: { index: false } }
}

export default function SignupPage() {
  return (
    <AuthShell>
      {/* useSearchParams (retour après connexion) exige une frontière Suspense */}
      <Suspense>
        <SignupForm />
      </Suspense>
    </AuthShell>
  )
}
