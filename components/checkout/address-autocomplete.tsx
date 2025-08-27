"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { cn } from "@/lib/utils"
import { COUNTRY_NAME_TO_CODE } from "./countries"

type NominatimResult = {
    display_name: string
    lat: string
    lon: string
    address?: {
        house_number?: string
        road?: string
        postcode?: string
        city?: string
        town?: string
        village?: string
        hamlet?: string
        country?: string
        country_code?: string
    }
}

// country mapping moved to countries.ts

export default function AddressAutocomplete() {
    const { control, setValue } = useFormContext()
    const line1: string = useWatch({ control, name: "shipping.line1" })
    const countryName: string = useWatch({ control, name: "shipping.country" })
    const [open, setOpen] = useState(false)
    const [, setLoading] = useState(false)
    const [items, setItems] = useState<NominatimResult[]>([])
    const timer = useRef<any>(null)

    const countryCode = useMemo(() => {
        if (!countryName) return undefined
        const code = COUNTRY_NAME_TO_CODE[countryName.trim()]
        return code
    }, [countryName])

    useEffect(() => {
        if (timer.current) clearTimeout(timer.current)
        if (!line1 || line1.trim().length < 3) {
            setItems([])
            setOpen(false)
            return
        }
        timer.current = setTimeout(async () => {
            try {
                setLoading(true)
                const params = new URLSearchParams({
                    format: "json",
                    addressdetails: "1",
                    limit: "5",
                    q: line1.trim(),
                })
                if (countryCode) params.set("countrycodes", countryCode)
                const url = `https://nominatim.openstreetmap.org/search?${params.toString()}`
                const res = await fetch(url, { headers: { "Accept": "application/json" } })
                const data = (await res.json()) as NominatimResult[]
                setItems(data)
                setOpen(data.length > 0)
            } catch {
                setItems([])
                setOpen(false)
            } finally {
                setLoading(false)
            }
        }, 350)
        return () => clearTimeout(timer.current)
    }, [line1, countryCode])

    const applySuggestion = (s: NominatimResult) => {
        const a = s.address || {}
        const city = a.city || a.town || a.village || a.hamlet || ""
        const line = [a.house_number, a.road].filter(Boolean).join(" ") || s.display_name
        if (line) setValue("shipping.line1", line)
        if (a.postcode) setValue("shipping.postalCode", a.postcode)
        if (city) setValue("shipping.city", city)
        if (a.country) setValue("shipping.country", a.country)
        setOpen(false)
    }

    if (!open) return null

    return (
        <div className={cn("mt-1 rounded-md border bg-popover text-popover-foreground shadow")}>
            <ul className="max-h-60 overflow-auto p-1 text-sm">
                {items.map((s, idx) => (
                    <li
                        key={idx}
                        className="cursor-pointer rounded px-2 py-1 hover:bg-accent"
                        onClick={() => applySuggestion(s)}
                    >
                        {s.display_name}
                    </li>
                ))}
            </ul>
        </div>
    )
}

