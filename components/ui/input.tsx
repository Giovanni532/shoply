import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "border-input bg-card/60 placeholder:text-faint selection:bg-primary selection:text-primary-foreground flex h-11 w-full min-w-0 rounded-md border px-3.5 py-2 text-[15px] transition-[border-color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 read-only:opacity-80",
        "focus-visible:border-beam focus-visible:shadow-[0_0_0_3px_var(--glow)]",
        "aria-invalid:border-destructive aria-invalid:shadow-[0_0_0_3px_color-mix(in_oklab,var(--destructive)_18%,transparent)]",
        className
      )}
      {...props}
    />
  )
}

export { Input }
