"use client"

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { routing } from "@/i18n/routing";

export default function LanguageSelect() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    const switchLocale = (nextLocale: string) => {
        if (nextLocale === locale) return;
        // Build a locale-prefixed path by replacing the existing locale segment if present
        const segments = pathname.split("/").filter(Boolean);
        if (segments.length > 0 && routing.locales.includes(segments[0] as any)) {
            segments[0] = nextLocale;
        } else {
            segments.unshift(nextLocale);
        }
        const nextPath = "/" + segments.join("/");
        router.push(nextPath as any);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-sm">
                    {locale === "fr" ? "🇫🇷 FR" : "🇺🇸 EN"}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => switchLocale("fr")} className="cursor-pointer">🇫🇷 FR</DropdownMenuItem>
                <DropdownMenuItem onClick={() => switchLocale("en")} className="cursor-pointer">🇺🇸 EN</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}


