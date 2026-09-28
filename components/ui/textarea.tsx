import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-input bg-card/60 placeholder:text-faint focus-visible:border-beam focus-visible:shadow-[0_0_0_3px_var(--glow)] aria-invalid:border-destructive flex field-sizing-content min-h-28 w-full rounded-md border px-3.5 py-3 text-[15px] leading-relaxed transition-[border-color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
