export type TLocale = 'de' | 'en';

export const LOCALE_DE: TLocale = 'de';
export const LOCALE_EN: TLocale = 'en';


const ALL_LOCALES: ReadonlyArray<string> = [LOCALE_DE, LOCALE_EN];

export function isValidLocale(value: unknown): value is TLocale {
    return (typeof value === 'string') && ALL_LOCALES.includes(value);
}


export const FALLBACK_LOCALE = LOCALE_EN;

export function sanitizeLocale(value: unknown): TLocale {
    return isValidLocale(value) ? value : FALLBACK_LOCALE;
}
