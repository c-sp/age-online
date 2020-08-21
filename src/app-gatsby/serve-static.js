const express = require('express');

const app = express();
app.use('/age-online', express.static('public'));

const host = 'localhost';
const port = 5000;

app.listen(port, host, () => console.log(`Server listening on ${host}:${port}`));
