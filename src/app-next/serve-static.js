'use strict';

const express = require('express');

const app = express();
app.use('/age-online', express.static('dist/next-export', {extensions: ['html']}));

const host = 'localhost';
const port = 3000;

app.listen(port, host, () => console.log(`Server listening on ${host}:${port}`));
