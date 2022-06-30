const express = require('express');
const app = express();

var server = require('http').createServer(app);
var io = require('socket.io')(server);

const path = require('path');
require('dotenv').config();

var dates = [];
app.use(express.json());
app.use(express.static("build"));
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});
io.on('connection', (socket) => {
    console.log('User Connected', socket.id);
    socket.emit('init', {
        id: socket.id,
        dates: dates,
    });

    socket.on('start', (id) => {
        console.log('Started from', id);
        dates.push(new Date());
        io.emit('update', {
            id: socket.id,
            dates: dates,
        });
    });

    socket.on('stop', (id) => {
        console.log('Stopped from', id);
        dates.push(new Date());
        io.emit('update', {
            id: socket.id,
            dates: dates,
        });
    });

    socket.on('initialize', (id) => {
        console.log('Initialized from', id);
        dates = [];
        io.emit('update', {
            id: socket.id,
            dates: dates,
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