import { useTranslations } from "next-intl";

export default function SettingsPage() {
    const t = useTranslations("account")
    return (
        <div className="mx-auto w-full max-w-4xl px-4 py-12 mt-20">
            <h1 className="text-3xl font-bold">{t("settingsTitle")}</h1>
            <p className="text-muted-foreground">{t("settingsSubtitle")}</p>
        </div>
    );
}


