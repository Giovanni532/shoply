"use client"

import { useAction } from "next-safe-action/hooks"
import { createCheckout } from "@/actions/checkout"
import { useCartStore, selectCartLines } from "@/store/cart-store"
import { z } from "zod"
import { checkoutSchema } from "@/validations/checkout"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

type CheckoutInput = z.infer<typeof checkoutSchema>

export default function CheckoutForm() {
    const router = useRouter()
    const lines = useCartStore(selectCartLines)
    const clear = useCartStore(s => s.clear)
    const defaultValues: CheckoutInput = {
        items: lines.map(l => ({ productId: l.productId, quantity: l.quantity })),
        shipping: { fullName: "", line1: "", line2: "", city: "", postalCode: "", country: "", phone: "" },
    }
    const form = useForm<CheckoutInput>({ resolver: zodResolver(checkoutSchema), defaultValues })
    const { execute, isPending } = useAction(createCheckout, {
        onSuccess: ({ data }) => {
            clear()
            router.push(`/checkout/success?orderId=${data.orderId}`)
        },
        onError: () => {
            router.push(`/checkout/cancel`)
        },
    })

    const onSubmit = (values: CheckoutInput) => execute(values)

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto w-full max-w-xl space-y-4">
                <h1 className="text-2xl font-bold text-center">Checkout</h1>
                <FormField control={form.control} name="shipping.fullName" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Nom complet</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="shipping.line1" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Adresse</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="shipping.line2" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Complément</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <FormField control={form.control} name="shipping.city" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Ville</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="shipping.postalCode" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Code postal</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="shipping.country" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Pays</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                </div>
                <FormField control={form.control} name="shipping.phone" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Téléphone</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <Button type="submit" disabled={isPending} className="w-full">Payer maintenant</Button>
            </form>
        </Form>
    )
}


