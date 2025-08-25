"use client";

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { paths } from "@/paths";

export default function Hero() {
    const t = useTranslations("hero");

    return (
        <div className="relative isolate">
            <section className="relative z-0 px-4 py-24 sm:py-28 md:py-32 lg:py-36">
                <div className="mx-auto max-w-5xl text-center">
                    <h1 className="text-balance text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
                        {t("title")}
                    </h1>
                    <p className="mt-4 text-pretty text-base text-muted-foreground sm:text-lg md:text-xl">
                        {t("subtitle")}
                    </p>

                    <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                        <Button asChild size="lg">
                            <Link href={paths.products.list}>{t("ctaPrimary")}</Link>
                        </Button>
                        <Button asChild size="lg" variant="outline">
                            <Link href={paths.legal.about}>{t("ctaSecondary")}</Link>
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}


