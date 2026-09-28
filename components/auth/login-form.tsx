"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { PasswordInput } from "@/components/auth/password-input";
import { redirectTarget } from "@/components/auth/redirect-target";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useRouter } from "@/i18n/navigation";
import { authClient } from "@/lib/auth-client";
import { paths } from "@/paths";

export function LoginForm() {
    const t = useTranslations("auth");
    const router = useRouter();
    const searchParams = useSearchParams();
    // `from` : posé par le proxy (/account) ou le checkout ; `callbackUrl` gardé pour les anciens liens
    const from = searchParams.get("from") ?? searchParams.get("callbackUrl");
    const target = redirectTarget(from);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const { error } = await authClient.signIn.email({ email, password });
        if (error) {
            toast.error(t("loginError"));
            setIsLoading(false);
            return;
        }
        toast.success(t("loginSuccess"));
        router.push(target);
        router.refresh();
    };

    return (
        <div>
            <p className="eyebrow text-beam-ink">{t("signIn")}</p>
            <h1 className="display mt-4 text-[clamp(2.5rem,5vw,3.75rem)] leading-[0.92]">{t("loginTitle")}</h1>
            <p className="mt-4 text-muted-foreground">{t("loginDescription")}</p>

            <form onSubmit={handleSubmit} className="mt-10 space-y-5">
                <div className="space-y-2">
                    <Label htmlFor="email">{t("email")}</Label>
                    <Input
                        id="email"
                        type="email"
                        autoComplete="email"
                        placeholder={t("emailPlaceholder")}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">{t("password")}</Label>
                    <PasswordInput
                        id="password"
                        autoComplete="current-password"
                        placeholder={t("passwordPlaceholder")}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading}
                    />
                </div>
                <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                    {isLoading ? t("signingIn") : t("submit")}
                </Button>
            </form>

            <p className="mt-8 border-t pt-6 text-sm text-muted-foreground">
                {t("endTitle")}{" "}
                <Link
                    href={from ? `${paths.auth.signup}?from=${encodeURIComponent(target)}` : paths.auth.signup}
                    className="font-semibold text-foreground underline decoration-foreground/25 underline-offset-4 hover:decoration-beam"
                >
                    {t("endLinkText")}
                </Link>
            </p>
        </div>
    );
}
