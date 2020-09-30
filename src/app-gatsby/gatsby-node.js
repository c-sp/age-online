const isDev = process.env.NODE_ENV === 'development';

const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const {LicenseWebpackPlugin} = require('license-webpack-plugin');
const {extname} = require('path');

const locales = ['de', 'en']; // TODO redundant


exports.onCreatePage = (param) => {
    const {page, actions, pathPrefix} = param;
    const {createPage, deletePage} = actions;

    // ignore pages auto-created by Gatsby
    if (extname(page.component) !== '.tsx') {
        return;
    }

    // for our own pages:
    //  - extend pageContext
    //  - add localized pages
    deletePage(page);
    createPage(newPage());
    locales.forEach((locale) => createPage(newPage(locale)));

    function newPage(locale) {
        let {context, path} = page;
        context = {...context, pathPrefix: noTrailingSlash(pathPrefix)};

        if (locale) {
            path = noTrailingSlash(`/${locale}${path}`);
        }
        return {...page, context, path};
    }

    function noTrailingSlash(pathname) {
        return pathname === '/' ? pathname : pathname.replace(/\/$/u, '');
    }
};


exports.onCreateWebpackConfig = ({actions}) => {
    const webpackConfig = {
        resolve: {
            plugins: [],
        },
        plugins: [
            new LicenseWebpackPlugin({
                outputFilename: 'age-online.licenses.txt',
                perChunkOutput: false,

                excludedPackageTest: (packageName) => packageName.startsWith('@age-online'),

                // TODO "yarn develop" hangs when setting renderLicenses
                // renderLicenses: (modules) => {
                //     const result = modules
                //         .map(mod => {
                //             const {
                //                 name, licenseId, licenseText,
                //                 packageJson: {author, homepage, repository},
                //             } = mod;
                //             const authorName = author && typeof author === 'object' ? author.name : author;
                //             return [
                //                 sanitize('Package:    ', name),
                //                 sanitize('Author:     ', authorName),
                //                 sanitize('Homepage:   ', homepage),
                //                 sanitize('Repository: ', repository && repository.url),
                //                 sanitize('License:    ', licenseId),
                //                 sanitize('\n', licenseText),
                //             ]
                //                 .filter(s => !!s)
                //                 .join('');
                //         })
                //         .filter(s => !!s)
                //         .join('\n--------------------------------------------------------------------------------\n\n');
                //     console.log('************************* rendered');
                //     return result;
                // },
            }),
        ],
    };

    if (isDev) {
        // use TypeScript path mappings only during development
        webpackConfig.resolve.plugins.push(new TsconfigPathsPlugin({configFile: '../tsconfig.json'}));
    }

    actions.setWebpackConfig(webpackConfig);

    // function sanitize(prefix, value) {
    //     const v = typeof value === 'string' ? value.trim() : value;
    //     return v ? `${prefix}${v}\n` : null;
    // }
};
