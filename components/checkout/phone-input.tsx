"use client"

import { useEffect, useMemo } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { COUNTRY_NAME_TO_DIAL } from "./countries"

// Préfixe l'indicatif du pays choisi tant que l'utilisateur n'a pas saisi de numéro
export default function PhoneInput({ id }: { id?: string }) {
  const { control, setValue, getValues } = useFormContext()
  const country: string = useWatch({ control, name: "shipping.country" })
  const phone: string = useWatch({ control, name: "shipping.phone" })
  const dial = useMemo(() => COUNTRY_NAME_TO_DIAL[country?.trim?.() || ""] || "", [country])

  useEffect(() => {
    if (!dial) return
    const current = (getValues("shipping.phone") as string | undefined)?.trim() ?? ""
    if (current === "" || /^\+\d{1,4}$/.test(current)) setValue("shipping.phone", `${dial} `, { shouldDirty: true })
  }, [dial, getValues, setValue])

  return (
    <Input
      id={id}
      type="tel"
      inputMode="tel"
      autoComplete="tel"
      value={phone ?? ""}
      onChange={(e) => setValue("shipping.phone", e.target.value, { shouldValidate: false })}
    />
  )
}
