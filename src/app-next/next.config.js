'use strict';

const withBundleAnalyzer = require('@next/bundle-analyzer');


module.exports = (phase) => {
    console.log(`creating Next.js config for phase "${phase}"`);

    let nextConfig = {
        basePath: '/age-online',
        distDir: 'dist/next-build',

        // https://nextjs.org/docs/api-reference/next.config.js/exportPathMap
        exportPathMap: () => ({
            ...i18nPathMap(),
            // TODO redundant list of locales
            ...i18nPathMap('en'),
            ...i18nPathMap('de'),
        }),
    };

    if (process.env.ANALYZE === 'true') {
        nextConfig = withBundleAnalyzer({enabled: true})(nextConfig);
    }

    return nextConfig;
};


function i18nPathMap(locale) {
    if (!locale) {
        return {
            '/': {page: '/'},
            '/settings': {page: '/settings'},
        };
    }
    return {
        // the following caused inconsistent exported code where [locale].js was
        // created and [locale]/index.js was requested by the .html:
        // [`/${locale}/index`]: {page: '/[locale]/index', query: {locale}},
        [`/${locale}`]: {page: '/[locale]', query: {locale}},
        [`/${locale}/settings`]: {page: '/[locale]/settings', query: {locale}},
    };
}
