import CheckoutForm from "@/components/checkout/checkout-form";
import CheckoutSummary from "@/components/checkout/checkout-summary";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default function CheckoutPage() {
    // Note: impossible to SSR-check Zustand cart. For UX, we can block the
    // submit when cart is empty (already handled by schema/items) and optionally
    // add a client-side guard inside CheckoutSummary to prompt users.
    return (
        <div className="px-4 py-12 mt-20">
            <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-8 md:grid-cols-2">
                <CheckoutForm />
                <CheckoutSummary />
            </div>
        </div>
    );
}


