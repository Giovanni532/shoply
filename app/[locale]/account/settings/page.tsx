"use client"
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAction } from "next-safe-action/hooks";
import { upsertAddress } from "@/actions/account";

export default function SettingsPage() {
    const t = useTranslations("account")
    const schema = z.object({
        fullName: z.string().min(2),
        line1: z.string().min(3),
        line2: z.string().optional().nullable(),
        city: z.string().min(2),
        postalCode: z.string().min(2),
        country: z.string().min(2),
        phone: z.string().optional().nullable(),
    })
    const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema), defaultValues: { fullName: "", line1: "", line2: "", city: "", postalCode: "", country: "", phone: "" } })
    const { execute, isPending } = useAction(upsertAddress, {
        onSuccess: () => alert(t("addresses.saved")),
    })
    return (
        <div className="mx-auto w-full max-w-4xl px-4 py-12 mt-20">
            <h1 className="text-3xl font-bold">{t("settingsTitle")}</h1>
            <p className="text-muted-foreground">{t("settingsSubtitle")}</p>
            <div className="mt-6">
                <h2 className="text-xl font-semibold">{t("addresses.title")}</h2>
                <Form {...form}>
                    <form className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2" onSubmit={form.handleSubmit((v) => execute(v))}>
                        <FormField control={form.control} name="fullName" render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t("addresses.form.fullName")}</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="line1" render={({ field }) => (
                            <FormItem className="md:col-span-2">
                                <FormLabel>{t("addresses.form.line1")}</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="line2" render={({ field }) => (
                            <FormItem className="md:col-span-2">
                                <FormLabel>{t("addresses.form.line2")}</FormLabel>
                                <FormControl><Input {...field} value={field.value ?? ""} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="postalCode" render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t("addresses.form.postalCode")}</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="city" render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t("addresses.form.city")}</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="country" render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t("addresses.form.country")}</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="phone" render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t("addresses.form.phone")}</FormLabel>
                                <FormControl><Input {...field} value={field.value ?? ""} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <div className="md:col-span-2">
                            <Button type="submit" disabled={isPending}>{t("addresses.form.save")}</Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}


