const express = require('express');
const app = express();
const path = require('path');
const api = require('./api');
require('dotenv').config();


app.use('/api', api);
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});
app.set('port', process.env.PORT || 3001);


const server = app.listen(app.get('port'), () => {
    console.log(`Express running → PORT ${server.address().port}`);
});