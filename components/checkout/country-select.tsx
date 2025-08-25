"use client"

import { useFormContext } from "react-hook-form"
import { COUNTRIES } from "./countries"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function CountrySelect() {
    const { setValue, getValues } = useFormContext()
    const current = getValues("shipping.country") as string

    return (
        <Select value={current} onValueChange={(v) => setValue("shipping.country", v, { shouldDirty: true, shouldTouch: true })}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder="Pays" />
            </SelectTrigger>
            <SelectContent>
                {COUNTRIES.map(c => (
                    <SelectItem key={c.code} value={c.name}>{c.name}</SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}


