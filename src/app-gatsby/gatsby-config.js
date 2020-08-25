'use strict';


const sourceMapsPlugin = process.env.NODE_ENV === 'development'
    ? []
    : ['gatsby-plugin-no-sourcemaps']; // turn off source maps for prod


const webpackAnalyzerPlugin = process.env.ANALYZE
    ? [{
        resolve: 'gatsby-plugin-webpack-bundle-analyzer',
        options: {
            production: true,
        },
    }]
    : [];

let pathPrefix = (process.env.PATH_PREFIX || '/age-online').replace(/\/$/u, '');
pathPrefix = pathPrefix.startsWith('/') ? pathPrefix : `/${pathPrefix}`;


module.exports = {
    siteMetadata: {
        siteUrl: 'https://c-sp.github.io/age-online',
    },
    pathPrefix,
    plugins: [
        // 'gatsby-plugin-typescript' is automatically included, see:
        // https://www.gatsbyjs.org/packages/gatsby-plugin-typescript/

        ...sourceMapsPlugin,
        ...webpackAnalyzerPlugin,

        // Download and self-host web fonts.
        // Set 'https_proxy' when behind a proxy.
        //
        // gatsby-plugin-webfonts downloads font files using
        // https://github.com/axios/axios
        // See also:
        // https://github.com/hupe1980/gatsby-plugin-webfonts/blob/master/gatsby-plugin-webfonts/src/modules/utils.js
        {
            resolve: `gatsby-plugin-webfonts`,
            options: {
                fonts: {
                    google: [
                        {
                            family: 'Roboto',
                            variants: ['400'],
                        },
                        {
                            family: 'Roboto Condensed',
                            variants: ['400'],
                        },
                    ],
                },
            },
        },

        // Use Gatsby V1 Layout for context providers and AppContainer.
        // This plugin generates the files gatsby-browser.js and gatsby-ssr.js
        // from layouts/index.
        // (skip this plugin when gatsby-browser.js etc. are TypeScript compatible)
        'gatsby-plugin-layout',

        // SEO for each page
        'gatsby-plugin-react-helmet',

        // SSR: include Material UI CSS (JSS) as global styles into the html
        'gatsby-plugin-material-ui',

        // create a site map
        'gatsby-plugin-sitemap',

        // create manifest & icons
        {
            resolve: 'gatsby-plugin-manifest',
            options: {
                /* eslint-disable camelcase */
                name: 'gatsby-starter-default',
                short_name: 'starter',
                start_url: '/',
                background_color: '#0080E0',
                theme_color: '#0080E0',
                display: 'minimal-ui',
                icon: 'static/icon.svg',
                /* eslint-enable camelcase */
            },
        },

        // this (optional) plugin enables Progressive Web App + Offline functionality
        // To learn more, visit: https://gatsby.dev/offline
        // 'gatsby-plugin-offline',
    ],
};