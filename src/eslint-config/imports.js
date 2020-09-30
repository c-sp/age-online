const path = require('path');

module.exports = {

    // https://github.com/benmosher/eslint-plugin-import#rules

    extends: [
        'plugin:import/recommended',
        'plugin:import/typescript', // eslint-plugin-import for TypeScript
    ],

    settings: {
        // https://github.com/alexgorbatchev/eslint-import-resolver-typescript#configuration
        'import/resolver': {
            typescript: {
                project: path.resolve(__dirname, '..', 'tsconfig.eslint.json'),
            },
        },
    },

    rules: {
        // override plugin:import/recommended

        'import/no-named-as-default': 0,
        // TODO how do we handle 'No default export found in imported module "react"  import/default'?
        //      alwaysTryTypes: true (settings.'import/resolver'.typescript) does not work ...
        'import/default': 0,


        // activate further rules

        'import/no-absolute-path': 2,
        'import/no-cycle': 2,
        // TODO https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-deprecated.md
        //      does not work with TypeScript overloads: https://github.com/benmosher/eslint-plugin-import/issues/1532
        //      'import/no-deprecated': 2,
        'import/no-dynamic-require': 2,
        'import/no-extraneous-dependencies': [2, {
            devDependencies: [
                '**/*.spec.ts',
                '**/karma.conf.js',
                '**/gatsby-config.js',
                '**/gatsby-node.js',
                '**/next.config.js',
                '**/serve-static.js',
                '**/write-git-info.js',
            ],
            optionalDependencies: false,
            peerDependencies: false,
        }],
        'import/no-mutable-exports': 2,
        'import/no-self-import': 2,
        'import/no-unassigned-import': 2,
        'import/no-unused-modules': 2,
        'import/no-useless-path-segments': 2,
        'import/no-webpack-loader-syntax': 2,
    },
};
