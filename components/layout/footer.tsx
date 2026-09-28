import { useTranslations } from "next-intl"
import { Logo } from "@/components/brand/logo"
import { LanguageSwitch } from "@/components/layout/language-switch"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import { Link } from "@/i18n/navigation"
import { paths } from "@/paths"

const AUTHOR_URL = "https://www.giovannisalcuni.dev"

export function Footer() {
  const t = useTranslations("footer")
  const tc = useTranslations("common")
  const ta = useTranslations("account.menu")

  const columns = [
    {
      title: t("shop"),
      links: [
        { href: paths.products.list, label: tc("products") },
        { href: paths.products.details("lampe-de-poche-classic"), label: "Classic" },
        { href: paths.products.details("lampe-de-poche-pro"), label: "Pro" },
        { href: paths.products.details("lampe-de-poche-mini"), label: "Mini" },
      ],
    },
    {
      title: t("help"),
      links: [
        { href: paths.legal.about, label: tc("about") },
        { href: paths.legal.contact, label: tc("contact") },
        { href: paths.cart, label: tc("cart") },
      ],
    },
    {
      title: t("account"),
      links: [
        { href: paths.account.orders, label: ta("orders") },
        { href: paths.account.settings, label: ta("settings") },
        { href: paths.auth.signup, label: tc("signUp") },
      ],
    },
  ]

  return (
    <footer className="border-t">
      <div className="mx-auto grid max-w-[1320px] gap-12 px-5 py-16 md:grid-cols-12 md:px-8">
        <div className="md:col-span-5">
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">{t("tagline")}</p>
        </div>
        {columns.map((col) => (
          <div key={col.title} className="md:col-span-2">
            <p className="eyebrow text-faint">{col.title}</p>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t">
        <div className="mx-auto flex max-w-[1320px] flex-col gap-4 px-5 py-6 text-[13px] text-faint md:flex-row md:items-center md:justify-between md:px-8">
          <p className="max-w-xl leading-relaxed">
            {t("demo")}{" "}
            <span className="whitespace-nowrap">
              {t("by")}{" "}
              <a href={AUTHOR_URL} target="_blank" rel="noopener noreferrer" className="text-muted-foreground underline decoration-foreground/20 underline-offset-4 hover:text-foreground hover:decoration-beam">
                Giovanni Salcuni
              </a>
              .
            </span>
          </p>
          <div className="flex items-center gap-2">
            <span className="mr-2">{t("rights", { year: new Date().getFullYear() })}</span>
            <LanguageSwitch />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </footer>
  )
}
