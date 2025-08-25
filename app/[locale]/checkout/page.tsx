import CheckoutForm from "@/components/checkout/CheckoutForm";
import CheckoutSummary from "@/components/checkout/CheckoutSummary";

export default function CheckoutPage() {
    return (
        <div className="px-4 py-12 mt-20">
            <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-8 md:grid-cols-2">
                <CheckoutForm />
                <CheckoutSummary />
            </div>
        </div>
    );
}


