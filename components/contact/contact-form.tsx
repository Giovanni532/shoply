"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Send } from "lucide-react"
import { useAction } from "next-safe-action/hooks"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { sendContactMessage } from "@/actions/contact"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { contactSchema } from "@/validations/contact"

export default function ContactForm() {
  const t = useTranslations("contact")
  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", message: "" },
  })
  const { execute, isPending } = useAction(sendContactMessage, {
    onSuccess: () => {
      toast.success(t("success"))
      form.reset()
    },
    onError: () => toast.error(t("error")),
  })
  const err = (k: string) => t(`errors.${k}` as "errors.nameMin")

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((v) => execute(v))} className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField control={form.control} name="name" render={({ field }) => (
            <FormItem>
              <FormLabel>{t("name")}</FormLabel>
              <FormControl><Input placeholder={t("placeholder.name")} autoComplete="name" {...field} /></FormControl>
              <FormMessage format={err} />
            </FormItem>
          )} />
          <FormField control={form.control} name="email" render={({ field }) => (
            <FormItem>
              <FormLabel>{t("email")}</FormLabel>
              <FormControl><Input type="email" placeholder={t("placeholder.email")} autoComplete="email" {...field} /></FormControl>
              <FormMessage format={err} />
            </FormItem>
          )} />
        </div>
        <FormField control={form.control} name="message" render={({ field }) => (
          <FormItem>
            <FormLabel>{t("message")}</FormLabel>
            <FormControl><Textarea placeholder={t("placeholder.message")} rows={6} {...field} /></FormControl>
            <FormMessage format={err} />
          </FormItem>
        )} />
        <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
          <p className="max-w-sm text-xs text-faint">{t("demo")}</p>
          <Button type="submit" size="lg" disabled={isPending}>
            <Send />
            {isPending ? t("sending") : t("submit")}
          </Button>
        </div>
      </form>
    </Form>
  )
}
