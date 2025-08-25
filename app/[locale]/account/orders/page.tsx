"use client"
import { useTranslations } from "next-intl";
import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";

export default function OrdersPage() {
    const t = useTranslations("account")
    // Placeholder list from client state (SWR could call an API route later)
    const { data } = authClient.useSession()
    return (
        <div className="mx-auto w-full max-w-4xl px-4 py-12 mt-20">
            <h1 className="text-3xl font-bold">{t("ordersTitle")}</h1>
            <p className="text-muted-foreground">{t("ordersSubtitle")}</p>
            <div className="mt-6 text-sm text-muted-foreground">
                {t("orders.empty")}
            </div>
        </div>
    );
}


