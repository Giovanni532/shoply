"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { paths } from "@/paths"
import { useTranslations } from "next-intl"

export default function CtaBanner() {
    const t = useTranslations("home.cta")
    return (
        <section className="relative mx-auto my-16 w-full max-w-6xl overflow-hidden rounded-2xl border bg-gradient-to-r from-primary/10 via-primary/5 to-transparent px-6 py-10">
            <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.35 }}>
                <h3 className="text-balance text-2xl font-bold sm:text-3xl">{t("title")}</h3>
                <p className="mt-2 max-w-2xl text-muted-foreground">{t("subtitle")}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                    <Button asChild size="lg">
                        <Link href={paths.products.list}>{t("primary")}</Link>
                    </Button>
                    <Button asChild size="lg" variant="outline">
                        <Link href={paths.legal.about}>{t("secondary")}</Link>
                    </Button>
                </div>
            </motion.div>
        </section>
    )
}


