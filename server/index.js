const express = require('express');
const app = express();

var server = require('http').createServer(app);
var io = require('socket.io')(server);

const path = require('path');
require('dotenv').config();

var dates = [];
const path2id = {
    "/8983": "makedelta",
    "/1817": "artitoo",
    "/5569": "hang",
    "/3960": "dice",
    "/2607": "pylon",
    "/3867": "greatzipsa",
    "/7880": "theres",
    "/9409": "snunventures",
};

app.use(express.json());
app.use(express.static("build"));
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});
io.on('connection', (socket) => {
    socket.on('init', (path) => {
        let id = Object.keys(path2id).includes(path) ? path2id[path] : "";
        console.log("User Connected", socket.id, id);
        socket.emit('init', {
            id: id,
            dates: dates,
        });
    });

    socket.on('start', (path) => {
        if(!Object.keys(path2id).includes(path)) return;
        console.log('Started from', path2id[path]);
        dates.push(new Date());
        io.emit('update', {
            id: path2id[path],
            dates: dates,
        });
    });

    socket.on('stop', (path) => {
        if(!Object.keys(path2id).includes(path)) return;
        console.log('Stopped from', path2id[path]);
        dates.push(new Date());
        io.emit('update', {
            id: path2id[path],
            dates: dates,
        });
    });

    socket.on('initialize', (path) => {
        if(!Object.keys(path2id).includes(path)) return;
        console.log('Initialized from', path2id[path]);
        dates = [];
        io.emit('update', {
            id: path2id[path],
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