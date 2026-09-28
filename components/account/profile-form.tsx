"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useAction } from "next-safe-action/hooks"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { updateProfile } from "@/actions/account"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "@/i18n/navigation"
import { authClient } from "@/lib/auth-client"

const schema = z.object({ name: z.string().trim().min(2, { message: "nameMin" }).max(120) })

export function ProfileForm({ name, email }: { name: string; email: string }) {
  const t = useTranslations("account")
  const router = useRouter()
  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema), defaultValues: { name } })
  const { execute, isPending } = useAction(updateProfile, {
    onSuccess: async () => {
      toast.success(t("profile.saved"))
      // Rafraîchit la session (le nom affiché dans la barre) puis la page
      await authClient.getSession({ query: { disableCookieCache: true } }).catch(() => {})
      router.refresh()
    },
    onError: () => toast.error(t("profile.error")),
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((v) => execute(v))} className="max-w-md space-y-5">
        <FormField control={form.control} name="name" render={({ field }) => (
          <FormItem>
            <FormLabel>{t("profile.name")}</FormLabel>
            <FormControl>
              <Input {...field} autoComplete="name" placeholder={t("namePlaceholder")} />
            </FormControl>
            <FormMessage format={(k) => t(k as "nameMin")} />
          </FormItem>
        )} />
        <div className="space-y-2">
          <Label htmlFor="email">{t("profile.email")}</Label>
          <Input id="email" value={email} readOnly disabled />
        </div>
        <Button type="submit" disabled={isPending || !form.formState.isDirty}>
          {t("profile.save")}
        </Button>
      </form>
    </Form>
  )
}
