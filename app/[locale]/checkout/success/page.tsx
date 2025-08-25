import Link from "next/link";
import { paths } from "@/paths";

export default function CheckoutSuccessPage() {
    return (
        <div className="mx-auto max-w-xl px-4 py-24 text-center min-h-screen flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold">Paiement réussi 🎉</h1>
            <p className="mt-2 text-muted-foreground">Merci pour votre commande.</p>
            <div className="mt-6">
                <Link href={paths.products.list} className="text-primary underline">Continuer vos achats</Link>
            </div>
        </div>
    );
}


