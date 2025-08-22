"use client"

import { motion } from "framer-motion"
import { ShieldCheck, Truck, RefreshCcw, CreditCard } from "lucide-react"
import { useTranslations } from "next-intl"

const features = [
    { icon: Truck, key: "fastShipping" },
    { icon: ShieldCheck, key: "securePayment" },
    { icon: RefreshCcw, key: "easyReturns" },
    { icon: CreditCard, key: "installments" },
]

export default function FeaturesSection() {
    const t = useTranslations("home.features")
    return (
        <section className="mx-auto w-full max-w-6xl px-4 py-12">
            <h2 className="text-center text-2xl font-bold">{t("title")}</h2>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {features.map((f, idx) => (
                    <motion.div
                        key={f.key}
                        initial={{ y: 12, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.35, delay: idx * 0.05 }}
                        className="flex items-start gap-3 rounded-lg border bg-background p-4 shadow-sm"
                    >
                        <f.icon className="mt-0.5 size-5 text-primary" />
                        <div className="space-y-1">
                            <p className="text-sm font-medium">{t(`${f.key}.title`)}</p>
                            <p className="text-sm text-muted-foreground">{t(`${f.key}.desc`)}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    )
}


