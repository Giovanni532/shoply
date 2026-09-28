"use client"

import { useTranslations } from "next-intl"
import { Link, usePathname } from "@/i18n/navigation"
import { cn } from "@/lib/utils"
import { paths } from "@/paths"

export function AccountNav() {
  const t = useTranslations("account.menu")
  const pathname = usePathname()
  const items = [
    { href: paths.account.orders, label: t("orders") },
    { href: paths.account.settings, label: t("settings") },
    { href: paths.account.profile, label: t("profile") },
  ]
  return (
    <nav aria-label={t("orders")} className="flex gap-1 overflow-x-auto border-b">
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "relative whitespace-nowrap px-3 pb-3 pt-1 text-sm font-medium transition-colors",
              active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {item.label}
            {active && <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-beam shadow-[0_0_10px_var(--beam)]" />}
          </Link>
        )
      })}
    </nav>
  )
}
