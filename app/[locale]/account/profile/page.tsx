"use client"
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAction } from "next-safe-action/hooks";
import { updateProfile } from "@/actions/account";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function ProfilePage() {
    const t = useTranslations("account")
    const session = authClient.useSession()
    const schema = z.object({ name: z.string().min(2, { message: "nameMin" }) })
    const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema), defaultValues: { name: "" } })
    const router = useRouter()
    const { execute, isPending } = useAction(updateProfile, {
        onSuccess: async () => {
            toast.success(t("profile.saved"))
            try { await authClient.getSession() } finally { router.refresh() }
        },
    })
    return (
        <div className="mx-auto w-full max-w-4xl px-4 py-12 mt-20">
            <h1 className="text-3xl font-bold">{t("profileTitle")}</h1>
            <p className="text-muted-foreground">{t("profileSubtitle")}</p>
            <div className="mt-6">
                <Form {...form}>
                    <form
                        className="space-y-4 max-w-md"
                        onSubmit={form.handleSubmit((v) => execute({ name: v.name }))}
                    >
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t("profile.name")}</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder={t("namePlaceholder")} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <div className="text-sm text-muted-foreground">
                            <div>Email: <span className="font-medium">{session.data?.user?.email}</span></div>
                        </div>
                        <Button type="submit" disabled={isPending}>{t("profile.save")}</Button>
                    </form>
                </Form>
            </div>
        </div>
    );
}


