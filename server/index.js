const express = require('express');
const app = express();

var server = require('http').createServer(app);
var io = require('socket.io')(server);

const path = require('path');
require('dotenv').config();

var start = null;
app.use(express.json());
app.use(express.static("build"));
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});
io.on('connection', (socket) => {
    console.log('User Connected', socket.id);
    socket.emit('init', {
        id: socket.id,
        start: start,
    });

    socket.on('start', (id) => {
        console.log('Started from', id);
        start = new Date();
        io.emit('start', {
            id: socket.id,
            start: start,
        });
    });

    socket.on('disconnect', () => {
        console.log('User Disconnected', socket.id);
    });
});

app.set('port', process.env.PORT || 3001);


server.listen(app.get('port'), () => {
    console.log(`Express running → PORT ${server.address().port}`);
});