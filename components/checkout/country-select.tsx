"use client"

import { useFormContext } from "react-hook-form"
import { COUNTRIES } from "./countries"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTranslations } from "next-intl"

export default function CountrySelect() {
    const { setValue, getValues } = useFormContext()
    const t = useTranslations("checkout")
    const current = getValues("shipping.country") as string

    return (
        <Select value={current} onValueChange={(v) => setValue("shipping.country", v, { shouldDirty: true, shouldTouch: true })}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder={t("countryPlaceholder")} />
            </SelectTrigger>
            <SelectContent>
                {COUNTRIES.map(c => (
                    <SelectItem key={c.code} value={c.name}>{c.name}</SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}


