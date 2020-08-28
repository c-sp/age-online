export enum PreferredTheme {
    LIGHT = 'light',
    DARK = 'dark',
    AUTO_DETECT = 'auto-detect',
}

const preferredThemeValues = new Set<string>(Object.values(PreferredTheme));

export function isPreferredTheme(value: unknown): value is PreferredTheme {
    return typeof value === 'string' && preferredThemeValues.has(value);
}
