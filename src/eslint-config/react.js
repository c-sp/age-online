module.exports = {

    // https://github.com/yannickcr/eslint-plugin-react

    extends: [
        'plugin:react/recommended',
    ],

    settings: {
        react: {version: 'detect'},
    },

    rules: {
        // override plugin:react/recommended

        'react/display-name': 0,
        'react/prop-types': 0,
    },
};
