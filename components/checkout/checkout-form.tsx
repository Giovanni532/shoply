"use client"

import { useAction } from "next-safe-action/hooks"
import { createCheckout } from "@/actions/checkout"
import { useCartStore, selectCartLines } from "@/store/cart-store"
import { authClient } from "@/lib/auth-client"
import { z } from "zod"
import { useEffect } from "react"
import { checkoutSchema } from "@/validations/checkout"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import AddressAutocomplete from "./address-autocomplete"
import PostalLookup from "./postal-lookup"
import CountrySelect from "./country-select"
import PhoneInput from "./phone-input"

type CheckoutInput = z.infer<typeof checkoutSchema>

export default function CheckoutForm() {
    const router = useRouter()
    const { data } = authClient.useSession()
    const lines = useCartStore(selectCartLines)
    const clear = useCartStore(s => s.clear)
    const defaultValues: CheckoutInput = {
        items: lines.map(l => ({ productId: l.productId, quantity: l.quantity })),
        shipping: { fullName: data?.user?.name ?? "", line1: "", line2: "", city: "", postalCode: "", country: "", phone: "" },
    }
    const form = useForm<CheckoutInput>({ resolver: zodResolver(checkoutSchema), defaultValues })

    // Prefill full name from session when available
    useEffect(() => {
        if (data?.user?.name) {
            form.setValue("shipping.fullName", data.user.name, { shouldDirty: false })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data?.user?.name])
    const { execute, isPending } = useAction(createCheckout, {
        onSuccess: (res) => {
            const orderId = (res as any)?.data?.orderId ?? (res as any)?.orderId
            clear()
            router.push(`/checkout/success?orderId=${orderId}`)
        },
        onError: () => {
            router.push(`/checkout/cancel`)
        },
    })

    const onSubmit = (values: CheckoutInput) => {
        // Normalize optional fields to null for schema (avoid empty string failing optional/nullable)
        const payload: CheckoutInput = {
            ...values,
            shipping: {
                ...values.shipping,
                line2: values.shipping.line2 ? values.shipping.line2 : null,
                phone: values.shipping.phone ? values.shipping.phone : null,
            },
        }
        execute(payload)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto w-full max-w-xl space-y-4">
                <h1 className="text-2xl font-bold text-center">Checkout</h1>
                <FormField control={form.control} name="shipping.fullName" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Nom complet</FormLabel>
                        <FormControl>
                            <Input
                                {...field}
                                value={field.value ?? ""}
                                readOnly={!!data?.user?.name}
                                disabled={!!data?.user?.name}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="shipping.country" render={() => (
                    <FormItem>
                        <FormLabel>Pays</FormLabel>
                        <CountrySelect />
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="shipping.line1" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Adresse</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                        <AddressAutocomplete />
                    </FormItem>
                )} />
                <FormField control={form.control} name="shipping.line2" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Complément</FormLabel>
                        <FormControl><Input {...field} value={field.value ?? ""} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <FormField control={form.control} name="shipping.postalCode" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Code postal</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="shipping.city" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Ville</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    {/* country moved above */}
                </div>
                <PostalLookup />
                <FormField control={form.control} name="shipping.phone" render={() => (
                    <FormItem>
                        <FormLabel>Téléphone</FormLabel>
                        <PhoneInput />
                        <FormMessage />
                    </FormItem>
                )} />
                <Button type="submit" disabled={isPending} className="w-full">Payer maintenant</Button>
            </form>
        </Form>
    )
}


