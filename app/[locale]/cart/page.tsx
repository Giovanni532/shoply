import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { CartPageView } from "@/components/cart/cart-page"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("cart")
  return { title: t("pageTitle") }
}

export default async function CartPage() {
  const t = await getTranslations("cart")
  return (
    <div className="mx-auto max-w-[1320px] px-5 pb-24 pt-32 md:px-8 md:pb-32 md:pt-40">
      <h1 className="display mb-10 text-[clamp(2.75rem,6vw,5rem)] leading-[0.92]">{t("pageTitle")}</h1>
      <CartPageView />
    </div>
  )
}
