import Link from "next/link";
import { paths } from "@/paths";
import { useTranslations } from "next-intl";

export default function CheckoutCancelPage() {
    const t = useTranslations("checkout")
    return (
        <div className="mx-auto max-w-xl px-4 py-24 text-center min-h-screen flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold">{t("cancelTitle")}</h1>
            <p className="mt-2 text-muted-foreground">{t("cancelSubtitle")}</p>
            <div className="mt-6 space-x-3">
                <Link href={paths.cart} className="text-primary underline">{t("cancelCtaCart")}</Link>
                <Link href={paths.products.list} className="text-primary underline">{t("cancelCtaProducts")}</Link>
            </div>
        </div>
    );
}


