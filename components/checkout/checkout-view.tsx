"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Lock } from "lucide-react"
import { useAction } from "next-safe-action/hooks"
import { useLocale, useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import type { z } from "zod"
import { createCheckout } from "@/actions/checkout"
import { LampThumb } from "@/components/cart/cart-line"
import { CartTotals } from "@/components/cart/cart-totals"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useMounted } from "@/hooks/use-mounted"
import { Link, useRouter } from "@/i18n/navigation"
import { getModel } from "@/lib/catalog"
import { formatPrice } from "@/lib/format"
import { paths } from "@/paths"
import { selectCartCurrency, selectCartLines, selectCartSubtotalCents, useCartStore } from "@/store/cart-store"
import { checkoutFormSchema, normalizePhone } from "@/validations/checkout"
import AddressAutocomplete from "./address-autocomplete"
import { COUNTRY_NAME_TO_DIAL } from "./countries"
import CountrySelect from "./country-select"
import PhoneInput from "./phone-input"
import PostalLookup from "./postal-lookup"

type FormValues = z.infer<typeof checkoutFormSchema>

function Step({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border bg-card p-5 md:p-7">
      <h2 className="flex items-baseline gap-3">
        <span className="eyebrow tabular text-beam-ink">{n}</span>
        <span className="display text-xl">{title}</span>
      </h2>
      <div className="mt-6">{children}</div>
    </section>
  )
}

export function CheckoutView({ userName }: { userName: string }) {
  const t = useTranslations("checkout")
  const locale = useLocale()
  const router = useRouter()
  const mounted = useMounted()
  const lines = useCartStore(selectCartLines)
  const subtotal = useCartStore(selectCartSubtotalCents)
  const currency = useCartStore(selectCartCurrency)
  const clear = useCartStore((s) => s.clear)

  const form = useForm<FormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: { shipping: { fullName: userName, line1: "", line2: "", city: "", postalCode: "", country: "Suisse", phone: "" } },
  })
  const country = form.watch("shipping.country")
  const dial = COUNTRY_NAME_TO_DIAL[country?.trim() || ""] || "+41"
  const err = (key: string) => t(`errors.${key}`, { dial })

  const { execute, isPending } = useAction(createCheckout, {
    onSuccess: ({ data }) => {
      if (!data?.orderId) return
      clear()
      router.push(`${paths.success}?order=${data.orderId}`)
    },
    onError: ({ error }) => {
      const message = (error.serverError as { message?: string } | undefined)?.message ?? ""
      if (message.startsWith("OUT_OF_STOCK|")) toast.error(t("errorStock", { name: message.split("|")[1] }))
      else if (error.validationErrors) toast.error(t("errorGeneric"))
      else router.push(paths.cancel)
    },
  })

  const onSubmit = (values: FormValues) => {
    execute({
      items: lines.map((l) => ({ productId: l.productId, quantity: l.quantity })),
      shipping: { ...values.shipping, line2: values.shipping.line2 || null, phone: normalizePhone(values.shipping.phone) },
    })
  }

  if (!mounted) return <div className="min-h-[50vh]" />

  if (lines.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed px-6 py-16 text-center">
        <p className="text-muted-foreground">{t("empty")}</p>
        <Button asChild className="mt-6">
          <Link href={paths.products.list}>{t("cancelCtaProducts")}</Link>
        </Button>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="grid gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="space-y-5 lg:col-span-7">
          <Step n="01" title={t("shippingSection")}>
            <div className="grid gap-5 sm:grid-cols-6">
              <FormField control={form.control} name="shipping.fullName" render={({ field }) => (
                <FormItem className="sm:col-span-6">
                  <FormLabel>{t("fullName")}</FormLabel>
                  <FormControl><Input {...field} autoComplete="name" /></FormControl>
                  <FormMessage format={err} />
                </FormItem>
              )} />
              <FormField control={form.control} name="shipping.country" render={() => (
                <FormItem className="sm:col-span-6">
                  <FormLabel>{t("country")}</FormLabel>
                  <CountrySelect />
                  <FormMessage format={err} />
                </FormItem>
              )} />
              <FormField control={form.control} name="shipping.line1" render={({ field }) => (
                <FormItem className="relative sm:col-span-6">
                  <FormLabel>{t("address")}</FormLabel>
                  <FormControl><Input {...field} placeholder={t("addressPlaceholder")} autoComplete="address-line1" /></FormControl>
                  <FormMessage format={err} />
                  <AddressAutocomplete />
                </FormItem>
              )} />
              <FormField control={form.control} name="shipping.line2" render={({ field }) => (
                <FormItem className="sm:col-span-6">
                  <FormLabel>{t("line2")}</FormLabel>
                  <FormControl><Input {...field} value={field.value ?? ""} autoComplete="address-line2" /></FormControl>
                </FormItem>
              )} />
              <FormField control={form.control} name="shipping.postalCode" render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>{t("postalCode")}</FormLabel>
                  <FormControl><Input {...field} inputMode="numeric" autoComplete="postal-code" /></FormControl>
                  <FormMessage format={err} />
                </FormItem>
              )} />
              <FormField control={form.control} name="shipping.city" render={({ field }) => (
                <FormItem className="sm:col-span-4">
                  <FormLabel>{t("city")}</FormLabel>
                  <FormControl><Input {...field} autoComplete="address-level2" /></FormControl>
                  <FormMessage format={err} />
                </FormItem>
              )} />
              <FormField control={form.control} name="shipping.phone" render={() => (
                <FormItem className="sm:col-span-6">
                  <FormLabel>{t("phone")}</FormLabel>
                  <PhoneInput />
                  <FormMessage format={err} />
                </FormItem>
              )} />
            </div>
            <PostalLookup />
          </Step>

          <Step n="02" title={t("paymentSection")}>
            <div className="flex gap-4 rounded-lg border border-dashed border-beam/35 bg-glow/40 p-4">
              <Lock aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-beam-ink" />
              <p className="text-sm leading-relaxed text-muted-foreground">{t("paymentNote")}</p>
            </div>
          </Step>
        </div>

        <aside className="lg:col-span-5">
          <div className="rounded-xl border bg-card p-5 md:p-7 lg:sticky lg:top-24">
            <h2 className="display text-xl">{t("summaryTitle")}</h2>
            <ul className="mt-5 divide-y border-y">
              {lines.map((l) => {
                const model = getModel(l.slug)
                return (
                  <li key={l.productId} className="flex items-center gap-4 py-3">
                    <LampThumb slug={l.slug} className="h-12 w-16" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{model ? `Shoply ${model.name}` : l.name}</p>
                      <p className="tabular font-mono text-[12px] text-muted-foreground">
                        {l.quantity} × {formatPrice(l.unitPriceCents, l.currency, locale)}
                      </p>
                    </div>
                    <span className="tabular font-mono text-sm">{formatPrice(l.unitPriceCents * l.quantity, l.currency, locale)}</span>
                  </li>
                )
              })}
            </ul>
            <CartTotals subtotalCents={subtotal} currency={currency} className="mt-5" />
            <Button type="submit" size="lg" className="mt-6 w-full" disabled={isPending}>
              {isPending ? t("processing") : t("pay", { amount: formatPrice(subtotal, currency, locale) })}
            </Button>
            <p className="mt-3 text-center text-xs text-faint">{t("simulatedNote")}</p>
            <p className="mt-4 text-center">
              <Link href={paths.cart} className="text-sm text-muted-foreground underline decoration-foreground/20 underline-offset-4 hover:text-foreground">
                {t("editCart")}
              </Link>
            </p>
          </div>
        </aside>
      </form>
    </Form>
  )
}
