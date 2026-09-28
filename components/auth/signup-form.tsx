"use client";

import { useState } from "react";
import { Check } from "lucide-react";
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
import { cn } from "@/lib/utils";
import { paths } from "@/paths";

const CRITERIA = ["length", "lowercase", "uppercase", "number", "special"] as const;

function checkPassword(password: string) {
    const checks: Record<(typeof CRITERIA)[number], boolean> = {
        length: password.length >= 8,
        lowercase: /[a-z]/.test(password),
        uppercase: /[A-Z]/.test(password),
        number: /\d/.test(password),
        special: /[^A-Za-z0-9]/.test(password),
    };
    return { checks, score: Object.values(checks).filter(Boolean).length };
}

const STRENGTH = ["veryWeak", "veryWeak", "weak", "medium", "strong", "veryStrong"] as const;

export function SignupForm() {
    const t = useTranslations("auth");
    const router = useRouter();
    const searchParams = useSearchParams();
    const from = searchParams.get("from");
    const target = redirectTarget(from);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { checks, score } = checkPassword(password);
    const mismatch = confirmPassword.length > 0 && password !== confirmPassword;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!firstName.trim() || !lastName.trim()) return toast.error(t("errorMissingName"));
        if (score < 3) return toast.error(t("errorPasswordWeak"));
        if (password !== confirmPassword) return toast.error(t("errorPasswordMismatch"));

        setIsLoading(true);
        const { error } = await authClient.signUp.email({
            email,
            password,
            name: `${firstName.trim()} ${lastName.trim()}`,
        });
        if (error) {
            toast.error(error.message || t("errorSignup"));
            setIsLoading(false);
            return;
        }
        toast.success(t("successAccountCreated"));
        router.push(target);
        router.refresh();
    };

    return (
        <div>
            <p className="eyebrow text-beam-ink">{t("signUp")}</p>
            <h1 className="display mt-4 text-[clamp(2.5rem,5vw,3.75rem)] leading-[0.92]">{t("signUpTitle")}</h1>
            <p className="mt-4 text-muted-foreground">{t("signUpDescription")}</p>

            <form onSubmit={handleSubmit} className="mt-10 space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="firstName">{t("firstName")}</Label>
                        <Input id="firstName" autoComplete="given-name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required disabled={isLoading} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="lastName">{t("lastName")}</Label>
                        <Input id="lastName" autoComplete="family-name" value={lastName} onChange={(e) => setLastName(e.target.value)} required disabled={isLoading} />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">{t("email")}</Label>
                    <Input id="email" type="email" autoComplete="email" placeholder={t("emailPlaceholder")} value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">{t("password")}</Label>
                    <PasswordInput id="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isLoading} aria-describedby="password-strength" />
                    {password && (
                        <div id="password-strength" className="pt-1">
                            {/* Jauge : cinq segments, qui s'allument comme une lampe qu'on pousse en turbo */}
                            <div className="flex gap-1" aria-hidden="true">
                                {CRITERIA.map((c, i) => (
                                    <span key={c} className={cn("h-1 flex-1 rounded-full transition-colors duration-300", i < score ? "bg-beam shadow-[0_0_8px_var(--glow)]" : "bg-foreground/10")} />
                                ))}
                            </div>
                            <p className="mt-2 text-[13px] text-muted-foreground">
                                {t("passwordStrengthLabel")} : <span className="font-medium text-foreground">{t(`passwordStrength.${STRENGTH[score]}`)}</span>
                            </p>
                            <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                                {CRITERIA.map((c) => (
                                    <li key={c} className={cn("flex items-center gap-1.5 text-[12px]", checks[c] ? "text-foreground" : "text-faint")}>
                                        <Check className={cn("size-3", checks[c] ? "text-beam-ink" : "opacity-30")} aria-hidden="true" />
                                        {t(`passwordCriteria.${c}`)}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="confirmPassword">{t("confirmPassword")}</Label>
                    <PasswordInput id="confirmPassword" autoComplete="new-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required disabled={isLoading} aria-invalid={mismatch} />
                    {mismatch && <p className="text-[13px] text-destructive">{t("passwordMismatch")}</p>}
                </div>
                <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                    {isLoading ? t("creatingAccount") : t("createAccount")}
                </Button>
            </form>

            <p className="mt-8 border-t pt-6 text-sm text-muted-foreground">
                {t("signupEndTitle")}{" "}
                <Link
                    href={from ? `${paths.auth.login}?from=${encodeURIComponent(target)}` : paths.auth.login}
                    className="font-semibold text-foreground underline decoration-foreground/25 underline-offset-4 hover:decoration-beam"
                >
                    {t("signupEndLinkText")}
                </Link>
            </p>
        </div>
    );
}
