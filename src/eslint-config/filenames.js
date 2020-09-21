module.exports = {

    // https://github.com/selaux/eslint-plugin-filenames

    plugins: [
        'filenames',
    ],

    rules: {
        'filenames/match-regex': [2, '^[a-z0-9]+((-|.)[a-z0-9]+)*$', true],
    },

    overrides: [
        {
            files: ['.eslintrc.js'],
            rules: {'filenames/match-regex': 0},
        },
    ],
};
