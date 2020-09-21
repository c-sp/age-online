const path = require('path');
const eslintRules = require('./eslint.js').rules;

module.exports = {

    // https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin

    overrides: [{
        // only for TypeScript files
        files: ['*.ts', '*.tsx'],

        // TypeScript compatible ESLint parser
        parser: '@typescript-eslint/parser',

        // tsconfig.json must be specified for rules requiring type information
        parserOptions: {
            project: path.resolve(__dirname, '..', 'tsconfig.eslint.json'),
        },

        extends: [
            // @typescript-eslint/eslint-plugin recommended rules
            'plugin:@typescript-eslint/recommended',
            // recommended rules requiring type checking (slow)
            'plugin:@typescript-eslint/recommended-requiring-type-checking',
        ],

        rules: {

            // ESLint extension rules
            // https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin#extension-rules

            'brace-style': 0,
            '@typescript-eslint/brace-style': eslintRules['brace-style'],

            camelcase: 0,
            '@typescript-eslint/naming-convention': [2, {
                selector: 'enumMember',
                format: ['UPPER_CASE'],
                leadingUnderscore: 'forbid',
                trailingUnderscore: 'forbid',
            }],

            'comma-spacing': 0,
            '@typescript-eslint/comma-spacing': eslintRules['comma-spacing'],

            'default-param-last': 0,
            '@typescript-eslint/default-param-last': eslintRules['default-param-last'],

            'dot-notation': 0,
            '@typescript-eslint/dot-notation': eslintRules['dot-notation'],

            'func-call-spacing': 0,
            '@typescript-eslint/func-call-spacing': eslintRules['func-call-spacing'],

            'keyword-spacing': 0,
            '@typescript-eslint/keyword-spacing': eslintRules['keyword-spacing'],

            'no-dupe-class-members': 0,
            '@typescript-eslint/no-dupe-class-members': eslintRules['no-dupe-class-members'],

            'no-invalid-this': 0,
            '@typescript-eslint/no-invalid-this': eslintRules['no-invalid-this'],

            'no-unused-expressions': 0,
            '@typescript-eslint/no-unused-expressions': eslintRules['no-unused-expressions'],

            'no-use-before-define': 0,
            '@typescript-eslint/no-use-before-define': eslintRules['no-use-before-define'],

            'no-useless-constructor': 0,
            '@typescript-eslint/no-useless-constructor': eslintRules['no-useless-constructor'],

            'no-shadow': 0,
            '@typescript-eslint/no-shadow': eslintRules['no-shadow'],

            quotes: 0,
            '@typescript-eslint/quotes': [2, 'single', {avoidEscape: true}],

            'no-return-await': 0,
            '@typescript-eslint/return-await': eslintRules['no-return-await'],

            semi: 0,
            '@typescript-eslint/semi': eslintRules.semi,

            'space-before-function-paren': 0,
            '@typescript-eslint/space-before-function-paren': eslintRules['space-before-function-paren'],


            // activate further rules
            // https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin#supported-rules

            '@typescript-eslint/array-type': 2,
            '@typescript-eslint/ban-types': [2, {
                extendDefaults: true,
                types: {
                    object: false, // allow using `object`
                    '{}': {
                        message: '`{}` actually means "any non-nullish value". Use object instead.',
                        fixWith: 'object',
                    },
                },
            }],
            '@typescript-eslint/member-delimiter-style': 2,
            '@typescript-eslint/no-confusing-non-null-assertion': 2,
            '@typescript-eslint/no-dynamic-delete': 2,
            '@typescript-eslint/no-invalid-void-type': 2,
            '@typescript-eslint/no-require-imports': 2,
            '@typescript-eslint/no-throw-literal': 2,
            '@typescript-eslint/no-unnecessary-boolean-literal-compare': 2,
            '@typescript-eslint/prefer-for-of': 2,
            '@typescript-eslint/prefer-includes': 2,
            '@typescript-eslint/prefer-nullish-coalescing': 2,
            '@typescript-eslint/prefer-optional-chain': 2,
            '@typescript-eslint/prefer-readonly': 2,
            '@typescript-eslint/prefer-reduce-type-parameter': 2,
            '@typescript-eslint/prefer-string-starts-ends-with': 2,
            '@typescript-eslint/prefer-ts-expect-error': 2,
            '@typescript-eslint/promise-function-async': 2,
            '@typescript-eslint/require-array-sort-compare': 2,
            '@typescript-eslint/switch-exhaustiveness-check': 2,
            '@typescript-eslint/type-annotation-spacing': 2,
            '@typescript-eslint/unified-signatures': 2,
        },
    }],
};
