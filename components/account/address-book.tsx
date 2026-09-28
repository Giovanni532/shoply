"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, Trash2 } from "lucide-react"
import { useAction } from "next-safe-action/hooks"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { deleteAddress, upsertAddress } from "@/actions/account"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useRouter } from "@/i18n/navigation"

export type SavedAddress = {
  id: string
  fullName: string
  line1: string
  line2: string | null
  postalCode: string
  city: string
  country: string
  phone: string | null
}

// Mêmes clés d'erreur que le checkout : les messages sont déjà traduits là-bas
const schema = z.object({
  fullName: z.string().trim().min(2, { message: "fullNameMin" }),
  line1: z.string().trim().min(3, { message: "addressMin" }),
  line2: z.string().optional(),
  postalCode: z.string().trim().min(2, { message: "postalMin" }),
  city: z.string().trim().min(2, { message: "cityMin" }),
  country: z.string().trim().min(2, { message: "countryMin" }),
  phone: z.string().optional(),
})
type Values = z.infer<typeof schema>
const EMPTY: Values = { fullName: "", line1: "", line2: "", postalCode: "", city: "", country: "Suisse", phone: "" }

export function AddressBook({ addresses, defaultName }: { addresses: SavedAddress[]; defaultName: string }) {
  const t = useTranslations("account.addresses")
  const te = useTranslations("checkout.errors")
  const tc = useTranslations("common")
  const router = useRouter()
  const [adding, setAdding] = useState(addresses.length === 0)
  const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { ...EMPTY, fullName: defaultName } })

  const save = useAction(upsertAddress, {
    onSuccess: () => {
      toast.success(t("saved"))
      form.reset({ ...EMPTY, fullName: defaultName })
      setAdding(false)
      router.refresh()
    },
    onError: () => toast.error(t("error")),
  })
  const remove = useAction(deleteAddress, {
    onSuccess: () => {
      toast.success(t("removed"))
      router.refresh()
    },
    onError: () => toast.error(t("error")),
  })

  const fields: { name: keyof Values; span: string; auto?: string }[] = [
    { name: "fullName", span: "sm:col-span-6", auto: "name" },
    { name: "line1", span: "sm:col-span-6", auto: "address-line1" },
    { name: "line2", span: "sm:col-span-6", auto: "address-line2" },
    { name: "postalCode", span: "sm:col-span-2", auto: "postal-code" },
    { name: "city", span: "sm:col-span-4", auto: "address-level2" },
    { name: "country", span: "sm:col-span-3", auto: "country-name" },
    { name: "phone", span: "sm:col-span-3", auto: "tel" },
  ]

  return (
    <div className="space-y-8">
      {addresses.length > 0 ? (
        <ul className="grid gap-4 sm:grid-cols-2">
          {addresses.map((a) => (
            <li key={a.id} className="relative rounded-xl border bg-card p-5">
              <address className="text-sm not-italic leading-relaxed">
                <span className="font-semibold">{a.fullName}</span>
                <br />
                {a.line1}
                {a.line2 && (
                  <>
                    <br />
                    {a.line2}
                  </>
                )}
                <br />
                {a.postalCode} {a.city} · {a.country}
                {a.phone && (
                  <>
                    <br />
                    <span className="tabular font-mono text-[12px] text-muted-foreground">{a.phone}</span>
                  </>
                )}
              </address>
              <button
                type="button"
                onClick={() => remove.execute({ id: a.id })}
                disabled={remove.isPending}
                aria-label={t("deleteLabel", { name: a.fullName })}
                className="absolute right-3 top-3 grid size-8 cursor-pointer place-items-center rounded-full text-faint transition-colors hover:bg-foreground/[0.06] hover:text-destructive"
              >
                <Trash2 className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted-foreground">{t("empty")}</p>
      )}

      {adding ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit((v) => save.execute(v))} className="rounded-xl border p-5 md:p-7">
            <h3 className="display text-lg">{t("add")}</h3>
            <div className="mt-5 grid gap-5 sm:grid-cols-6">
              {fields.map((f) => (
                <FormField key={f.name} control={form.control} name={f.name} render={({ field }) => (
                  <FormItem className={f.span}>
                    <FormLabel>{t(`form.${f.name}`)}</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ""} autoComplete={f.auto} />
                    </FormControl>
                    <FormMessage format={(k) => te(k as "cityMin", { dial: "+41" })} />
                  </FormItem>
                )} />
              ))}
            </div>
            <div className="mt-6 flex gap-2">
              <Button type="submit" disabled={save.isPending}>
                {t("form.save")}
              </Button>
              {addresses.length > 0 && (
                <Button type="button" variant="ghost" onClick={() => setAdding(false)}>
                  {tc("close")}
                </Button>
              )}
            </div>
          </form>
        </Form>
      ) : (
        <Button variant="outline" onClick={() => setAdding(true)}>
          <Plus />
          {t("add")}
        </Button>
      )}
    </div>
  )
}
