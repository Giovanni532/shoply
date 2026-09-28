"use client"

import { LogOut, MapPin, Package, UserRound } from "lucide-react"
import { useTranslations } from "next-intl"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Link, useRouter } from "@/i18n/navigation"
import { authClient } from "@/lib/auth-client"
import { paths } from "@/paths"

type Props = { user: { name?: string | null; email?: string | null } }

export function UserMenu({ user }: Props) {
  const t = useTranslations("account")
  const tc = useTranslations("common")
  const router = useRouter()
  const initial = (user.name || user.email || "?").trim().charAt(0).toUpperCase()

  const signOut = async () => {
    await authClient.signOut()
    router.push(paths.home)
    router.refresh()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={tc("account")}
        className="grid size-9 cursor-pointer place-items-center rounded-full border border-input text-[13px] font-semibold transition-colors hover:border-beam data-[state=open]:border-beam"
      >
        {initial}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60 rounded-lg p-1.5">
        <DropdownMenuLabel className="flex min-w-0 flex-col gap-0.5 px-2 py-2">
          <span className="truncate text-sm font-semibold text-foreground">{user.name}</span>
          <span className="truncate text-xs font-normal text-muted-foreground">{user.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="cursor-pointer gap-2.5 px-2 py-2">
          <Link href={paths.account.orders}>
            <Package className="size-4 text-muted-foreground" />
            {t("menu.orders")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer gap-2.5 px-2 py-2">
          <Link href={paths.account.settings}>
            <MapPin className="size-4 text-muted-foreground" />
            {t("menu.settings")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer gap-2.5 px-2 py-2">
          <Link href={paths.account.profile}>
            <UserRound className="size-4 text-muted-foreground" />
            {t("menu.profile")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOut} className="cursor-pointer gap-2.5 px-2 py-2">
          <LogOut className="size-4 text-muted-foreground" />
          {tc("signOut")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
