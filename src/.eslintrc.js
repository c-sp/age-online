module.exports = {

    ignorePatterns: [
        '**/.cache',
        '**/age_wasm.js',
        '**/app-gatsby/public',
        '**/app-gatsby/static',
        '**/app-next/next-env.d.ts',
        '**/app-next/public',
        '**/dist',
    ],

    // enable ECMAScript globals and set ECMAScript version
    env: {es2020: true},
    parserOptions: {ecmaVersion: 2020},

    extends: [
        '@age-online/eslint-config/eslint',
        '@age-online/eslint-config/filenames',
        '@age-online/eslint-config/imports',
        '@age-online/eslint-config/node-files',
        '@age-online/eslint-config/react',
        '@age-online/eslint-config/typescript',
    ],
};
