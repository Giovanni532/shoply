"use client"

import { useAction } from "next-safe-action/hooks"
import { sendContactMessage } from "@/actions/contact"
import { z } from "zod"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { contactSchema } from "@/validations/contact"

export default function ContactForm() {
    const t = useTranslations("contact")
    const form = useForm<z.infer<typeof contactSchema>>({
        resolver: zodResolver(contactSchema),
        defaultValues: { name: "", email: "", message: "" },
    })
    const { execute, isPending, result } = useAction(sendContactMessage, {
        onSuccess: () => toast.success(t("success")),
        onError: () => toast.error(t("error")),
    })

    const onSubmit = (values: z.infer<typeof contactSchema>) => execute(values)

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto w-full max-w-xl space-y-4">
                <div className="space-y-1 text-center">
                    <h1 className="text-3xl font-bold">{t("title")}</h1>
                    <p className="text-muted-foreground">{t("subtitle")}</p>
                </div>

                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t("name")}</FormLabel>
                            <FormControl>
                                <Input placeholder={t("placeholder.name")} {...field} />
                            </FormControl>
                            <FormMessage>{form.formState.errors.name?.message ? t(`errors.${form.formState.errors.name.message as string}`) : null}</FormMessage>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t("email")}</FormLabel>
                            <FormControl>
                                <Input placeholder={t("placeholder.email")} type="email" {...field} />
                            </FormControl>
                            <FormMessage>{form.formState.errors.email?.message ? t(`errors.${form.formState.errors.email.message as string}`) : null}</FormMessage>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t("message")}</FormLabel>
                            <FormControl>
                                <Textarea placeholder={t("placeholder.message")} rows={6} {...field} />
                            </FormControl>
                            <FormMessage>{form.formState.errors.message?.message ? t(`errors.${form.formState.errors.message.message as string}`) : null}</FormMessage>
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={isPending} className="w-full">
                    {t("submit")}
                </Button>
            </form>
        </Form>
    )
}


