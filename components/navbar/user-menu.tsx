import { LogOutIcon, UserIcon, Package2Icon, Settings2Icon } from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User } from "better-auth/types"
import { authClient } from "@/lib/auth-client"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { paths } from "@/paths"

interface UserMenuProps {
  user: User
}

export default function UserMenu({ user }: UserMenuProps) {
  const t = useTranslations("common")
  const ta = useTranslations("account")

  const handleSignOut = async () => {
    await authClient.signOut()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
          <Avatar>
            <AvatarImage src={user.image ?? ""} alt="Profile image" />
            <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-64" align="end">
        <DropdownMenuLabel className="flex min-w-0 flex-col">
          <span className="text-foreground truncate text-sm font-medium">
            {user.name}
          </span>
          <span className="text-muted-foreground truncate text-xs font-normal">
            {user.email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href={paths.account.profile} className="flex items-center gap-2">
              <UserIcon size={16} className="opacity-60" aria-hidden="true" />
              <span>{ta("menu.profile")}</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={paths.account.orders} className="flex items-center gap-2">
              <Package2Icon size={16} className="opacity-60" aria-hidden="true" />
              <span>{ta("menu.orders")}</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={paths.account.settings} className="flex items-center gap-2">
              <Settings2Icon size={16} className="opacity-60" aria-hidden="true" />
              <span>{ta("menu.settings")}</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOutIcon size={16} className="opacity-60" aria-hidden="true" />
          <span>{t("signOut")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
