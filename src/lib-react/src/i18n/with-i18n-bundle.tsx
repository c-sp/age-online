import {TranslationDictionary, withI18n} from '@shopify/react-i18n';
import {ComplexReplacementDictionary} from '@shopify/react-i18n/dist/src/types';
import React from 'react';
import {FALLBACK_LOCALE} from './locale';


export interface ITranslations {
    readonly [locale: string]: string;
}

export interface II18nBundle {
    readonly [key: string]: ITranslations;
}

function shopifyI18nBundle(i18nBundle: II18nBundle): { [locale: string]: TranslationDictionary } {
    const result: { [locale: string]: TranslationDictionary } = {};

    Object.entries(i18nBundle).forEach((entry) => {
        const [key, translations] = entry;

        Object.entries(translations).forEach((transEntry) => {
            const [locale, translation] = transEntry;

            if (!result[locale]) {
                result[locale] = {};
            }
            result[locale][key] = translation;
        });
    });

    return result;
}

/**
 * `withI18n()` falls back to `useI18n()` which calls `useComplexI18n()` which
 * is notified by `I18Manager.update()`.
 *
 * @see https://github.com/Shopify/quilt/blob/master/packages/react-i18n/src/decorator.tsx
 * @see https://github.com/Shopify/quilt/blob/master/packages/react-i18n/src/hooks.tsx
 */
export function withI18nBundle(id: string, i18nBundle: II18nBundle): ReturnType<typeof withI18n> {
    const bundle = shopifyI18nBundle(i18nBundle);

    const fallback = bundle[FALLBACK_LOCALE];
    if (!fallback) {
        throw new Error(`i18n id "${id}": fallback (${FALLBACK_LOCALE}) missing`);
    }

    return withI18n({
        id,
        fallback,
        translations: (locale: string) => bundle[locale],
    });
}


export const COMMON_I18N_REPLACEMENTS: ComplexReplacementDictionary = {
    br: <br/>,
};
