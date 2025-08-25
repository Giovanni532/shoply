"use client"
import { useTranslations } from "next-intl";
import Link from "next/link";
import { paths } from "@/paths";

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
    const t = useTranslations("account")
    const { id } = params
    return (
        <div className="mx-auto w-full max-w-4xl px-4 py-12 mt-20">
            <h1 className="text-3xl font-bold">{t("orders.details.title")} #{id}</h1>
            <p className="text-muted-foreground">{t("ordersSubtitle")}</p>

            <div className="mt-6 text-sm text-muted-foreground">
                {t("orders.empty")} {/* Placeholder - fetch and render order lines here */}
            </div>
            <div className="mt-6">
                <Link href={paths.account.orders} className="text-primary underline">{t("orders.details.back")}</Link>
            </div>
        </div>
    );
}


