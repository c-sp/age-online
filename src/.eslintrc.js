'use strict';

const path = require('path');

const ERROR = 'error';
const OFF = 'off';

module.exports = createConfig({
    root: true,

    ignorePatterns: [
        '**/.cache',
        '**/app-gatsby/public',
        '**/app-gatsby/static',
        '**/app-next/next-env.d.ts',
        '**/app-next/public',
        '**/dist',
    ],

    // enable ECMAScript globals and set ECMAScript version
    env: {es2020: true},
    parserOptions: {ecmaVersion: 2020},

    plugins: [],
    extends: [],
    overrides: [],
    rules: {},
    settings: {},
});


function createConfig(config) {
    let cfg = config;
    cfg = addEslintRecommendedConfig(cfg);
    cfg = addFilenameConfig(cfg);
    cfg = addImportConfig(cfg);
    cfg = addReactConfig(cfg);
    cfg = addTypeScriptConfig(cfg);
    return cfg;
}


function addEslintRecommendedConfig(config) {
    const {overrides} = config;
    return {
        ...config,
        extends: [
            ...config.extends,
            'eslint:recommended',
        ],
        rules: {
            'array-bracket-newline': [ERROR, 'consistent'],
            'arrow-body-style': ERROR,
            'arrow-spacing': ERROR,
            'block-spacing': ERROR,
            'brace-style': ERROR,
            camelcase: ERROR,
            'comma-dangle': [ERROR, 'always-multiline'],
            'comma-spacing': ERROR,
            'comma-style': ERROR,
            'computed-property-spacing': ERROR,
            curly: ERROR,
            'default-param-last': ERROR,
            'dot-location': [ERROR, 'property'],
            'dot-notation': ERROR,
            'eol-last': ERROR,
            eqeqeq: ERROR,
            'func-call-spacing': ERROR,
            'func-style': [ERROR, 'declaration', {allowArrowFunctions: true}],
            // 'function-call-argument-newline': [ERROR, 'consistent'],
            'function-paren-newline': [ERROR, 'consistent'],
            'generator-star-spacing': ERROR,
            'implicit-arrow-linebreak': ERROR,
            indent: [ERROR, 4, {
                SwitchCase: 1,
                FunctionDeclaration: {parameters: 'first'},
                FunctionExpression: {parameters: 'first'},
                VariableDeclarator: 'first',
                // ignore JSX nodes:
                // https://github.com/typescript-eslint/typescript-eslint/issues/415#issuecomment-507385565
                ignoredNodes: ['JSXAttribute', 'JSXSpreadAttribute'],
            }],
            'keyword-spacing': ERROR,
            'key-spacing': ERROR,
            'linebreak-style': ERROR,
            'max-len': [ERROR, {code: 120, ignoreUrls: true}],
            'multiline-ternary': [ERROR, 'always-multiline'],
            'new-cap': ERROR,
            'new-parens': ERROR,
            'newline-per-chained-call': ERROR,
            'no-alert': ERROR,
            'no-array-constructor': ERROR,
            'no-await-in-loop': ERROR,
            'no-bitwise': ERROR,
            'no-caller': ERROR,
            'no-confusing-arrow': ERROR,
            'no-console': ERROR,
            'no-dupe-class-members': ERROR,
            'no-else-return': ERROR,
            'no-empty-function': ERROR,
            'no-eval': ERROR,
            'no-extend-native': ERROR,
            'no-floating-decimal': ERROR,
            'no-implied-eval': ERROR,
            'no-invalid-this': ERROR,
            'no-iterator': ERROR,
            'no-labels': ERROR,
            'no-lone-blocks': ERROR,
            'no-lonely-if': ERROR,
            'no-loop-func': ERROR,
            'no-loss-of-precision': ERROR,
            'no-mixed-operators': ERROR,
            'no-multi-spaces': ERROR,
            'no-multi-str': ERROR,
            'no-multiple-empty-lines': [ERROR, {max: 3}],
            'no-negated-condition': ERROR,
            'no-new': ERROR,
            'no-new-func': ERROR,
            'no-new-object': ERROR,
            'no-new-wrappers': ERROR,
            'no-octal-escape': ERROR,
            'no-param-reassign': ERROR,
            'no-proto': ERROR,
            'no-return-assign': ERROR,
            'no-return-await': ERROR,
            'no-script-url': ERROR,
            'no-self-compare': ERROR,
            'no-sequences': ERROR,
            'no-shadow': ERROR,
            'no-tabs': ERROR,
            'no-template-curly-in-string': ERROR,
            'no-throw-literal': ERROR,
            'no-trailing-spaces': ERROR,
            'no-underscore-dangle': ERROR,
            'no-unmodified-loop-condition': ERROR,
            'no-unneeded-ternary': ERROR,
            'no-unused-expressions': ERROR,
            'no-use-before-define': [ERROR, {functions: false}], // functions are hoisted
            'no-useless-backreference': ERROR,
            'no-useless-call': ERROR,
            'no-useless-computed-key': ERROR,
            'no-useless-concat': ERROR,
            'no-useless-constructor': ERROR,
            'no-useless-rename': ERROR,
            'no-useless-return': ERROR,
            'no-var': ERROR,
            'no-whitespace-before-property': ERROR,
            'object-curly-newline': [ERROR, {consistent: true}],
            'object-curly-spacing': ERROR,
            'object-shorthand': ERROR,
            'operator-assignment': ERROR,
            'operator-linebreak': [ERROR, 'before'],
            'prefer-arrow-callback': ERROR,
            'prefer-const': ERROR,
            'prefer-destructuring': ERROR,
            'prefer-exponentiation-operator': ERROR,
            'prefer-numeric-literals': ERROR,
            'prefer-object-spread': ERROR,
            'prefer-promise-reject-errors': ERROR,
            'prefer-regex-literals': ERROR,
            'prefer-rest-params': ERROR,
            'prefer-spread': ERROR,
            'prefer-template': ERROR,
            'quote-props': [ERROR, 'as-needed'],
            quotes: [ERROR, 'single', {avoidEscape: true}],
            radix: ERROR,
            'require-atomic-updates': ERROR,
            'require-await': ERROR,
            'require-unicode-regexp': ERROR,
            'rest-spread-spacing': ERROR,
            semi: ERROR,
            'semi-spacing': ERROR,
            'semi-style': ERROR,
            'sort-imports': [ERROR, {
                // match WebStorms sorting behaviour
                ignoreCase: true,
                ignoreDeclarationSort: true,
            }],
            'space-before-blocks': ERROR,
            'space-before-function-paren': [ERROR, 'never'],
            'space-in-parens': ERROR,
            'space-infix-ops': ERROR,
            'space-unary-ops': ERROR,
            'spaced-comment': ERROR,
            strict: ERROR,
            'switch-colon-spacing': ERROR,
            'symbol-description': ERROR,
            'template-curly-spacing': ERROR,
            'template-tag-spacing': ERROR,
            'unicode-bom': ERROR,
            'yield-star-spacing': ERROR,
            yoda: ERROR,
        },
        overrides: [
            ...overrides,
            {
                files: [
                    '.eslintrc.js',
                    'gatsby-config.js',
                    'gatsby-node.js',
                    'gatsby-ssr.js',
                    'karma.conf.js',
                    'next.config.js',
                    'serve-static.js',
                ],
                env: {node: true},
            },
            {
                files: ['rollup.config.js'],
                parserOptions: {sourceType: 'module'},
            },
        ],
    };
}


function addFilenameConfig(config) {
    // https://github.com/selaux/eslint-plugin-filenames
    const {plugins, rules, overrides} = config;
    return {
        ...config,
        plugins: [...plugins, 'filenames'],
        rules: {
            ...rules,
            'filenames/match-regex': [ERROR, '^[a-z0-9]+((-|.)[a-z0-9]+)*$', true],
        },
        overrides: [
            ...overrides,
            {
                files: ['.eslintrc.js'],
                rules: {'filenames/match-regex': OFF},
            },
        ],
    };
}


function addImportConfig(config) {
    // https://github.com/benmosher/eslint-plugin-import#rules
    const {plugins, rules} = config;
    return {
        ...config,
        plugins: [...plugins, 'import'],
        extends: [
            ...config.extends,
            'plugin:import/warnings',
            'plugin:import/errors',
            // eslint-plugin-import for TypeScript
            'plugin:import/typescript',
        ],
        rules: {
            ...rules,
            'import/dynamic-import-chunkname': ERROR,
            'import/export': ERROR,
            'import/named': ERROR,
            'import/namespace': ERROR,
            'import/no-absolute-path': ERROR,
            'import/no-amd': ERROR,
            'import/no-cycle': ERROR,
            // TODO https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-deprecated.md
            //      does not work with TypeScript overloads: https://github.com/benmosher/eslint-plugin-import/issues/1532
            //      'import/no-deprecated': ERROR,
            'import/no-duplicates': ERROR,
            'import/no-dynamic-require': ERROR,
            'import/no-extraneous-dependencies': [ERROR, {
                devDependencies: [
                    '**/*.spec.ts',
                    '**/karma.conf.js',
                    '**/gatsby-config.js',
                    '**/gatsby-node.js',
                    '**/next.config.js',
                    '**/serve-static.js',
                ],
                optionalDependencies: false,
                peerDependencies: false,
            }],
            'import/no-mutable-exports': ERROR,
            'import/no-named-as-default': OFF,
            'import/no-named-as-default-member': ERROR,
            'import/no-named-default': ERROR,
            'import/no-namespace': ERROR,
            'import/no-self-import': ERROR,
            'import/no-unassigned-import': ERROR,
            'import/no-unresolved': ERROR,
            'import/no-unused-modules': ERROR,
            'import/no-useless-path-segments': ERROR,
            'import/no-webpack-loader-syntax': ERROR,
            'import/unambiguous': ERROR,
        },
    };
}


function addReactConfig(config) {
    // https://github.com/yannickcr/eslint-plugin-react
    const {settings, rules} = config;
    return {
        ...config,
        extends: [
            ...config.extends,
            'plugin:react/recommended',
        ],
        settings: {
            ...settings,
            react: {version: 'detect'},
        },
        rules: {
            ...rules,
            'react/display-name': OFF,
            'react/prop-types': OFF, // TODO maybe switch this on?
        },
    };
}


function addTypeScriptConfig(config) {
    // https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin

    const {rules, overrides} = config;

    const tsOverride = {
        files: ['*.ts', '*.tsx'],

        // TypeScript compatible ESLint parser
        parser: '@typescript-eslint/parser',
        parserOptions: {
            // tsconfig.json must be specified for rules requiring type information
            project: path.resolve(__dirname, 'tsconfig.eslint.json'),
        },
        extends: [
            // @typescript-eslint/eslint-plugin recommended rules
            'plugin:@typescript-eslint/recommended',
            // recommended rules requiring type checking (slow)
            'plugin:@typescript-eslint/recommended-requiring-type-checking',
        ],
        rules: {
            '@typescript-eslint/array-type': ERROR,
            '@typescript-eslint/ban-types': [ERROR, {
                extendDefaults: true,
                types: {
                    object: false, // allow using `object`
                    '{}': {
                        message: '`{}` actually means "any non-nullish value". Use object instead.',
                        fixWith: 'object',
                    },
                },
            }],
            '@typescript-eslint/member-delimiter-style': ERROR,
            '@typescript-eslint/no-confusing-non-null-assertion': ERROR,
            '@typescript-eslint/no-dynamic-delete': ERROR,
            '@typescript-eslint/no-invalid-void-type': ERROR,
            '@typescript-eslint/no-require-imports': ERROR,
            '@typescript-eslint/no-throw-literal': ERROR,
            '@typescript-eslint/no-unnecessary-boolean-literal-compare': ERROR,
            '@typescript-eslint/prefer-for-of': ERROR,
            '@typescript-eslint/prefer-includes': ERROR,
            '@typescript-eslint/prefer-nullish-coalescing': ERROR,
            '@typescript-eslint/prefer-optional-chain': ERROR,
            '@typescript-eslint/prefer-readonly': ERROR,
            '@typescript-eslint/prefer-reduce-type-parameter': ERROR,
            '@typescript-eslint/prefer-string-starts-ends-with': ERROR,
            '@typescript-eslint/prefer-ts-expect-error': ERROR,
            '@typescript-eslint/promise-function-async': ERROR,
            '@typescript-eslint/require-array-sort-compare': ERROR,
            '@typescript-eslint/switch-exhaustiveness-check': ERROR,
            '@typescript-eslint/type-annotation-spacing': ERROR,
            '@typescript-eslint/unified-signatures': ERROR,
        },
    };
    replaceESLintRule('brace-style');
    replaceESLintRule('camelcase', '@typescript-eslint/naming-convention', [
        ERROR,
        {
            selector: 'enumMember',
            format: ['UPPER_CASE'],
            leadingUnderscore: 'forbid',
            trailingUnderscore: 'forbid',
        },
    ]);
    replaceESLintRule('comma-spacing');
    replaceESLintRule('default-param-last');
    replaceESLintRule('dot-notation');
    replaceESLintRule('func-call-spacing');
    replaceESLintRule('keyword-spacing');
    replaceESLintRule('no-dupe-class-members');
    replaceESLintRule('no-invalid-this');
    replaceESLintRule('no-unused-expressions');
    replaceESLintRule('no-useless-constructor');
    replaceESLintRule('quotes');
    replaceESLintRule('no-return-await', '@typescript-eslint/return-await');
    replaceESLintRule('semi');
    replaceESLintRule('space-before-function-paren');

    return {
        ...config,
        overrides: [...overrides, tsOverride],
    };


    function replaceESLintRule(esRule, optionalTsRule, tsRuleOptions) {
        tsOverride.rules[esRule] = OFF;
        tsOverride.rules[optionalTsRule || `@typescript-eslint/${esRule}`] = tsRuleOptions || rules[esRule];
    }
}
