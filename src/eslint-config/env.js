module.exports = {

    overrides: [

        // overrides for node.js files
        {
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
        },

        // overrides for client code
        {
            files: [
                'age-audio-worklet.js',
            ],

            env: {
                browser: true,
            },
        },
    ],
};
