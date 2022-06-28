const express = require('express');
const app = express();

var server = require('http').createServer(app);
var io = require('socket.io')(server);

const path = require('path');
const api = require('./api');
require('dotenv').config();


app.use(express.json());
app.use('/api', api);
app.use(express.static("build"));
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});
io.on('connection', (socket) => {
    console.log('User Connected', socket.id);
    socket.emit('init', socket.id);

    socket.on('start', (id) => {
        console.log('start id:', id);
        io.emit('start', new Date());
    });

    socket.on('disconnect', () => {
        console.log('User Disconnected');
    });
});

app.set('port', process.env.PORT || 3001);


server.listen(app.get('port'), () => {
    console.log(`Express running → PORT ${server.address().port}`);
});