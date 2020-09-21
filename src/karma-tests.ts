// make this file a module to prevent
// "TS1208: All files must be modules when the '--isolatedModules' flag is provided"
export {};

// based on https://github.com/webpack-contrib/karma-webpack#alternative-usage
//
// require.context() is provided by webpack:
// https://webpack.js.org/guides/dependency-management/#requirecontext

declare const require: {
    readonly context: (path: string, deep?: boolean, filter?: RegExp) => {
        readonly keys: () => string[];
        <T>(id: string): T;
    };
};

const specs = require.context('./', true, /.spec.ts$/u);
specs.keys().forEach(specs);
