const {getLastCommit} = require('git-last-commit');
const {writeFileSync} = require('fs');
const {resolve} = require('path');


getLastCommit((err, commit) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }

    const jsonPath = resolve(__dirname, 'src', 'git-info', 'last-commit.json');
    writeFileSync(jsonPath, JSON.stringify(commit, undefined, 2), 'utf8');
});
