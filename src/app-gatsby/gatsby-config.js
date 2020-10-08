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
        // "siteUrl" set for gatsby-plugin-sitemap
        // (which also appends the path-prefix which is why we skip it here)
        siteUrl: 'https://c-sp.github.io',
    },
    pathPrefix,
    plugins: [
        // 'gatsby-plugin-typescript' is automatically included, see:
        // https://www.gatsbyjs.org/packages/gatsby-plugin-typescript/

        ...sourceMapsPlugin,
        ...webpackAnalyzerPlugin,

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

        // this (optional) plugin enables Progressive Web App + Offline functionality
        // to learn more, visit: https://gatsby.dev/offline
        {
            resolve: 'gatsby-plugin-offline',
            options: {
                workboxConfig: {
                    // our self served fonts are versioned
                    //  => no cache busting required, similar to hashed files
                    dontCacheBustURLsMatching: /(\.js$|\.css$|\.woff.?$|static\/)/u,
                    runtimeCaching: [
                        {
                            // TODO this should be CacheFirst once the files are hashed
                            urlPattern: /^https?:.*(age_wasm|age-audio-worklet)/u,
                            handler: 'StaleWhileRevalidate',
                        },
                        {
                            // based on dontCacheBustURLsMatching
                            urlPattern: /(\.js$|\.css$|\.woff.?$|static\/)/u,
                            handler: 'CacheFirst',
                        },
                        {
                            // page-data.json files, static query results and app-data.json
                            // are not content hashed
                            urlPattern: /^https?:.*\/page-data\/.*\.json$/u,
                            handler: 'StaleWhileRevalidate',
                        },
                        {
                            // cache other resources
                            urlPattern: /^https?:.*\.(json|png|svg|txt)$/u,
                            handler: 'StaleWhileRevalidate',
                        },
                    ],
                },
            },
        },
    ],
};
