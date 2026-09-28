"use client"

import { useFormContext, useWatch } from "react-hook-form"
import { useTranslations } from "next-intl"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { COUNTRIES } from "./countries"

export default function CountrySelect({ id }: { id?: string }) {
  const { control, setValue } = useFormContext()
  const t = useTranslations("checkout")
  const current = useWatch({ control, name: "shipping.country" }) as string

  return (
    <Select value={current} onValueChange={(v) => setValue("shipping.country", v, { shouldDirty: true, shouldTouch: true, shouldValidate: true })}>
      <SelectTrigger id={id} className="w-full">
        <SelectValue placeholder={t("countryPlaceholder")} />
      </SelectTrigger>
      <SelectContent>
        {COUNTRIES.map((c) => (
          <SelectItem key={c.code} value={c.name}>
            {c.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
