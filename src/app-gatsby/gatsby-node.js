'use strict';

const isDev = process.env.NODE_ENV === 'development';

const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const {extname} = require('path');

const locales = ['de', 'en']; // TODO redundant


exports.onCreatePage = ({page, actions}) => {
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
        context = {...context, page: noTrailingSlash(path)};

        if (locale) {
            path = noTrailingSlash(`/${locale}${path}`);
            context = {...context, locale};
        }
        return {...page, context, path};
    }

    function noTrailingSlash(pathname) {
        return pathname === '/' ? pathname : pathname.replace(/\/$/u, '');
    }
};


exports.onCreateWebpackConfig = ({actions}) => {
    // use TypeScript path mappings only during development
    if (isDev) {
        actions.setWebpackConfig({
            resolve: {
                plugins: [new TsconfigPathsPlugin({configFile: '../tsconfig.json'})],
            },
        });
    }
};
