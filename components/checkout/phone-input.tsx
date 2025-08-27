"use client"

import { useEffect, useMemo } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { COUNTRY_NAME_TO_DIAL } from "./countries"
import { Input } from "@/components/ui/input"

// Simple E.164-ish validation: starts with +, digits, length 7-15
const isValidE164 = (val: string) => /^\+[1-9]\d{6,14}$/.test(val)

export default function PhoneInput() {
    const { control, setValue } = useFormContext()
    const country: string = useWatch({ control, name: "shipping.country" })
    const phone: string = useWatch({ control, name: "shipping.phone" })

    const dial = useMemo(() => COUNTRY_NAME_TO_DIAL[country?.trim?.() || ""] || "", [country])

    useEffect(() => {
        if (!dial) return
        if (!phone || !phone.startsWith("+")) {
            setValue("shipping.phone", dial + (phone ?? ""), { shouldDirty: true })
        }
    }, [dial])

    const invalid = phone ? !isValidE164(phone) : false

    return (
        <div>
            <Input value={phone ?? ""} onChange={(e) => setValue("shipping.phone", e.target.value)} />
            {invalid ? <p className="text-destructive text-xs mt-1">Format international requis (ex: {dial}123456789)</p> : null}
        </div>
    )
}


