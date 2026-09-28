"use client"

import { Menu } from "lucide-react"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"
import { Logo } from "@/components/brand/logo"
import { CartDrawer } from "@/components/cart/cart-drawer"
import { LanguageSwitch } from "@/components/layout/language-switch"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import { UserMenu } from "@/components/layout/user-menu"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Link, usePathname } from "@/i18n/navigation"
import { authClient } from "@/lib/auth-client"
import { cn } from "@/lib/utils"
import { paths } from "@/paths"

export function Navbar() {
  const t = useTranslations("common")
  const pathname = usePathname()
  const { data: session } = authClient.useSession()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const links = [
    { href: paths.products.list, label: t("products") },
    { href: paths.legal.about, label: t("about") },
    { href: paths.legal.contact, label: t("contact") },
  ]
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Sur l'accueil, la barre flotte sur la nuit du hero tant qu'on n'a pas défilé
  const overHero = pathname === "/" && !scrolled

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300",
        overHero ? "night border-b border-transparent bg-transparent text-foreground" : "border-b bg-background/80 backdrop-blur-xl",
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1320px] items-center gap-6 px-5 md:px-8">
        <Link href={paths.home} className="rounded-sm" aria-label="Shoply">
          <Logo />
        </Link>

        <nav aria-label={t("mainNav")} className="hidden flex-1 md:block">
          <ul className="flex items-center gap-1">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={cn(
                    "relative rounded-full px-3 py-2 text-sm font-medium transition-colors",
                    isActive(link.href) ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {link.label}
                  {isActive(link.href) && <span className="absolute inset-x-3 -bottom-0.5 h-px bg-beam shadow-[0_0_8px_var(--beam)]" />}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-1 md:ml-0">
          <LanguageSwitch className="hidden sm:flex" />
          <ThemeToggle />
          {session?.user ? (
            <div className="ml-1">
              <UserMenu user={session.user} />
            </div>
          ) : (
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Link href={paths.auth.login}>{t("signIn")}</Link>
            </Button>
          )}
          <CartDrawer />

          {/* Mobile */}
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger aria-label={t("menu")} className="grid size-9 cursor-pointer place-items-center rounded-full hover:bg-foreground/[0.06] md:hidden">
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-full gap-0 bg-background p-0 sm:max-w-sm">
              <SheetTitle className="sr-only">{t("menu")}</SheetTitle>
              <div className="border-b px-6 py-5">
                <Logo />
              </div>
              <nav aria-label={t("mainNav")} className="flex-1 px-6 py-6">
                <ul className="space-y-1">
                  {[{ href: paths.home, label: t("home") }, ...links].map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={() => setMenuOpen(false)}
                        className={cn("display block py-2 text-3xl", isActive(link.href) || (link.href === "/" && pathname === "/") ? "text-foreground" : "text-muted-foreground")}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="flex items-center justify-between gap-3 border-t px-6 py-5">
                <LanguageSwitch />
                {!session?.user && (
                  <Button asChild size="sm" onClick={() => setMenuOpen(false)}>
                    <Link href={paths.auth.login}>{t("signIn")}</Link>
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
