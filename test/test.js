const precompress = require('../index.js');
const path = require('path');
const express = require('express');
const app = express();

app.use(precompress(path.join(__dirname, 'public'), { exts: ['.js', '.css'] }));

app.use(express.static(path.join(__dirname, "public")));

app.listen(8080, () => {
    console.log('port 8080 run server');
});