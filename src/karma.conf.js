'use strict';


module.exports = function karmaConfig(config) {
    config.set({
        browsers: ['ChromeHeadless', 'FirefoxHeadless'],

        client: {
            // don't clear jasmine html reporter results
            clearContext: false,
        },

        frameworks: ['jasmine'],

        // Generating a webpack bundle for each .spec.ts file creates way too
        // much overhead and may even crash Node with an "out of memory" error.
        // We thus create only one bundle containing all .spec.ts files by
        // using one entry point.
        //
        // See also:
        // https://github.com/webpack-contrib/karma-webpack#alternative-usage
        files: [
            // this is the entry point for our bundle
            'karma-tests.ts',
            // watch all .ts files for changes
            {
                pattern: '**/*.ts',
                watched: true,
                included: false,
                served: false,
            },
        ],

        plugins: [
            require('karma-chrome-launcher'),
            require('karma-firefox-launcher'),
            require('karma-jasmine'),
            require('karma-jasmine-html-reporter'),
            require('karma-webpack'),
        ],

        preprocessors: {
            'karma-tests.ts': 'webpack',
        },

        reporters: [
            // console test counter
            'progress',
            // karma-jasmine-html-reporter: list of tests inside browser
            'kjhtml',
        ],

        webpack: {
            // https://webpack.js.org/configuration/devtool/
            // => the compiled bundle is several MB large,
            //    maybe we don't need source maps after all?
            // devtool: 'eval-source-map',

            // Switching from "development" to "production" brought the bundle
            // size down to a few 100 KB ... from several MB!
            // however "production" is much slower than "development" for
            // continuously re-compiling and re-running tests.
            // TODO separate chunks for node_modules and own code?
            //      https://github.com/webpack-contrib/karma-webpack/issues/165
            //      https://bambooengineering.io/efficient-tdd-with-karma-and-webpack/
            mode: 'development',
            module: {
                rules: [
                    {
                        test: /\.[tj]sx?$/u,
                        exclude: /node_modules/u,
                        loader: 'babel-loader',
                        options: {
                            plugins: [
                                '@babel/plugin-proposal-class-properties',
                                '@babel/plugin-proposal-object-rest-spread',
                                '@babel/plugin-transform-react-jsx',
                            ],
                            presets: [
                                '@babel/preset-env',
                                '@babel/preset-typescript',
                            ],
                        },
                    },
                ],
            },
            resolve: {
                extensions: ['.js', '.jsx', '.ts', '.tsx'],
            },
        },

        webpackMiddleware: {
            stats: 'errors-warnings',
        },
    });
};
