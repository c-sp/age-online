'use strict';

const path = require('path');
const withBundleAnalyzer = require('@next/bundle-analyzer');


module.exports = (phase) => {
    console.log(`creating Next.js config for phase "${phase}"`);

    let nextConfig = {
        target: 'serverless',
        basePath: '/age-online',
        distDir: 'dist/next-build',

        // https://nextjs.org/docs/api-reference/next.config.js/exportPathMap
        exportPathMap: () => ({
            ...i18nPathMap(),
            // TODO redundant list of locales
            ...i18nPathMap('en'),
            ...i18nPathMap('de'),
        }),

        // Compile TypeScript code outside of this directory (see path mappings),
        // based on:
        // https://github.com/vercel/next.js/blob/canary/test/integration/typescript-workspaces-paths/packages/www/next.config.js
        // TODO works only as long as there are no <lib>/dist/* files present
        webpack: function (config, {defaultLoaders}) {
            const resolvedBaseUrl = path.resolve(config.context, '../')
            config.module.rules = [
                ...config.module.rules,
                {
                    test: /\.(tsx|ts|js|mjs|jsx)$/,
                    include: [resolvedBaseUrl],
                    use: defaultLoaders.babel,
                    exclude: (excludePath) => {
                        return /node_modules/.test(excludePath)
                    },
                },
            ]
            return config
        },
    };

    if (process.env.ANALYZE) {
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
    // TODO why do we have to keep the [locale]/*.tsx files for this to work?
    return {
        [`/${locale}`]: {page: '/'},
        [`/${locale}/settings`]: {page: '/settings'},
    };
}
