import { useTranslations } from "next-intl";

export default function AboutPage() {
    const t = useTranslations("about");
    return (
        <div className="mx-auto w-full max-w-4xl px-4 py-12 mt-20">
            <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold">{t("title")}</h1>
                <p className="text-muted-foreground">{t("subtitle")}</p>
            </div>
            <div className="prose prose-sm dark:prose-invert mx-auto mt-8 space-y-4 text-center">
                <p>{t("p1")}</p>
                <p>{t("p2")}</p>
                <p>{t("p3")}</p>
            </div>
        </div>
    );
}


