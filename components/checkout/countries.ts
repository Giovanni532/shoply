export type Country = { code: string; name: string; dial: string };

export const COUNTRIES: Country[] = [
    { code: "fr", name: "France", dial: "+33" },
    { code: "ch", name: "Suisse", dial: "+41" },
    { code: "be", name: "Belgique", dial: "+32" },
    { code: "de", name: "Allemagne", dial: "+49" },
    { code: "it", name: "Italie", dial: "+39" },
    { code: "es", name: "Espagne", dial: "+34" },
];

export const COUNTRY_NAME_TO_CODE: Record<string, string> = Object.fromEntries(
    COUNTRIES.map(c => [c.name, c.code])
);

export const COUNTRY_NAME_TO_DIAL: Record<string, string> = Object.fromEntries(
    COUNTRIES.map(c => [c.name, c.dial])
);


