"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useTranslations } from "next-intl"
import { useRef } from "react"
import { flushSync } from "react-dom"
import { useMounted } from "@/hooks/use-mounted"
import { cn } from "@/lib/utils"

// Nuit ↔ jour : le nouveau thème s'ouvre en cercle depuis le bouton, comme un faisceau qu'on allume.
export function ThemeToggle({ className }: { className?: string }) {
  const t = useTranslations("common")
  const { resolvedTheme, setTheme } = useTheme()
  const mounted = useMounted()
  const ref = useRef<HTMLButtonElement>(null)
  const isDark = !mounted || resolvedTheme !== "light"

  const toggle = async () => {
    const next = isDark ? "light" : "dark"
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (!document.startViewTransition || reduce || !ref.current) {
      setTheme(next)
      return
    }
    const { top, left, width, height } = ref.current.getBoundingClientRect()
    const x = left + width / 2
    const y = top + height / 2
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
    await document.startViewTransition(() => {
      flushSync(() => setTheme(next))
    }).ready
    document.documentElement.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
      { duration: 650, easing: "cubic-bezier(0.16, 1, 0.3, 1)", pseudoElement: "::view-transition-new(root)" },
    )
  }

  return (
    <button
      ref={ref}
      type="button"
      onClick={toggle}
      aria-label={isDark ? t("toLight") : t("toDark")}
      title={isDark ? t("toLight") : t("toDark")}
      className={cn(
        "inline-flex size-9 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/[0.06] hover:text-foreground",
        className,
      )}
    >
      {isDark ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
    </button>
  )
}
