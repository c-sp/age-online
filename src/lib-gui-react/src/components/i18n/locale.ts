export enum Locale {
    DE = 'de',
    EN = 'en',
}

const localeValues = new Set<string>(Object.values(Locale));

export function isLocale(value: unknown): value is Locale {
    return (typeof value === 'string') && localeValues.has(value);
}


export const FALLBACK_LOCALE = Locale.EN;

export function sanitizeLocale(value: unknown): Locale {
    return isLocale(value) ? value : FALLBACK_LOCALE;
}
