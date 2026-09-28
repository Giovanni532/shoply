import { useTranslations } from "next-intl"
import { StagedLamp } from "@/components/lamp/staged-lamp"

// Mise en page connexion / inscription : le formulaire à gauche, la nuit à droite
export function AuthShell({ children }: { children: React.ReactNode }) {
  const t = useTranslations("auth")
  return (
    <div className="mx-auto grid min-h-[100svh] max-w-[1320px] gap-10 px-5 pb-16 pt-28 md:px-8 lg:grid-cols-2 lg:items-center lg:gap-16 lg:pt-24">
      <div className="mx-auto w-full max-w-md">{children}</div>
      <div aria-hidden="true" className="night grain relative hidden aspect-[4/5] overflow-hidden rounded-2xl border bg-background lg:block">
        <StagedLamp slug="lampe-de-poche-classic" on beam width={62} anchor={34} tilt={-12} />
        <div className="absolute inset-x-0 bottom-0 p-10">
          <p className="display max-w-sm text-3xl leading-tight">{t("panelTitle")}</p>
          <p className="mt-3 text-muted-foreground">{t("panelText")}</p>
        </div>
      </div>
    </div>
  )
}
