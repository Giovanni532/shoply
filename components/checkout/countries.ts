export type Country = { code: string; name: string };

export const COUNTRIES: Country[] = [
    { code: "fr", name: "France" },
    { code: "ch", name: "Suisse" },
    { code: "be", name: "Belgique" },
    { code: "de", name: "Allemagne" },
    { code: "it", name: "Italie" },
    { code: "es", name: "Espagne" },
];

export const COUNTRY_NAME_TO_CODE: Record<string, string> = Object.fromEntries(
    COUNTRIES.map(c => [c.name, c.code])
);


