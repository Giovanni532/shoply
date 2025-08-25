"use client"

import { useEffect, useRef } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { COUNTRY_NAME_TO_CODE } from "./countries"

export default function PostalLookup() {
    const { control, setValue } = useFormContext()
    const postalCode: string = useWatch({ control, name: "shipping.postalCode" })
    const countryName: string = useWatch({ control, name: "shipping.country" })
    const timer = useRef<any>(null)

    useEffect(() => {
        if (timer.current) clearTimeout(timer.current)
        if (!postalCode || postalCode.trim().length < 3 || !countryName) return
        const countryCode = COUNTRY_NAME_TO_CODE[countryName.trim()]
        timer.current = setTimeout(async () => {
            try {
                const params = new URLSearchParams({ format: "json", addressdetails: "1", limit: "1", postalcode: postalCode.trim() })
                if (countryCode) params.set("countrycodes", countryCode)
                const url = `https://nominatim.openstreetmap.org/search?${params.toString()}`
                const res = await fetch(url, { headers: { Accept: "application/json" } })
                const data = (await res.json()) as Array<{ address?: { city?: string; town?: string; village?: string; hamlet?: string } }>
                const addr = data[0]?.address
                const city = addr?.city || addr?.town || addr?.village || addr?.hamlet
                if (city) setValue("shipping.city", city, { shouldDirty: true })
            } catch { }
        }, 400)
        return () => clearTimeout(timer.current)
    }, [postalCode, countryName, setValue])

    return null
}


