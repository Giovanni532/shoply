import { Clock, Mail, MapPin } from "lucide-react"
import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import ContactForm from "@/components/contact/contact-form"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("contact")
  return { title: t("eyebrow"), description: t("subtitle") }
}

export default async function ContactPage() {
  const t = await getTranslations("contact")
  const info = [
    { icon: Mail, value: "atelier@shoply.demo" },
    { icon: Clock, value: t("hours") },
    { icon: MapPin, value: t("place") },
  ]
  return (
    <div className="mx-auto max-w-[1320px] px-5 pb-24 pt-32 md:px-8 md:pb-32 md:pt-40">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <p className="eyebrow text-beam-ink">{t("eyebrow")}</p>
          <h1 className="display mt-4 text-[clamp(2.5rem,5.5vw,4.75rem)] leading-[0.92]">{t("title")}</h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">{t("subtitle")}</p>
          <div className="mt-10 border-t pt-6">
            <h2 className="eyebrow text-faint">{t("infoTitle")}</h2>
            <ul className="mt-4 space-y-3">
              {info.map(({ icon: Icon, value }) => (
                <li key={value} className="flex items-center gap-3 text-sm">
                  <Icon aria-hidden="true" className="size-4 text-beam-ink" />
                  {value}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="rounded-2xl border bg-card p-6 md:p-10 lg:col-span-7">
          <ContactForm />
        </div>
      </div>
    </div>
  )
}
