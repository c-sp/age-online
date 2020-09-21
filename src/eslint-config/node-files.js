module.exports = {

    // overrides for node.js files

    overrides: [{

        files: [
            '.eslintrc.js',
            '**/eslint-config/*.js',
            'gatsby-config.js',
            'gatsby-node.js',
            'gatsby-ssr.js',
            'karma.conf.js',
            'next.config.js',
            'serve-static.js',
            'write-git-info.js',
        ],

        env: {
            node: true,
        },

        rules: {
            'no-console': 0,
        },
    }],
};
