const express = require('express');
const app = express();

var server = require('http').createServer(app);
var io = require('socket.io')(server);

const path = require('path');
require('dotenv').config();

var starter = "";
var dates = [];
const path2id = {
    "/admin": "SNAAC_ADMIN",
};

app.use(express.json());
app.use(express.static("build"));
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});
io.on('connection', (socket) => {
    socket.on('init', (path) => {
        let id = Object.keys(path2id).includes(path) ? path2id[path] : "";
        console.log(new Date().toString(), "User Connected", socket.id, id);
        socket.emit('init', {
            id,
            starter,
            dates,
        });
    });

    socket.on('start', (path) => {
        if(!Object.keys(path2id).includes(path)) return;
        console.log(new Date().toString(), 'Started from', path2id[path]);
        starter = path2id[path];
        dates.push(new Date());
        io.emit('update', {
            id: path2id[path],
            starter,
            dates: dates,
        });
    });

    socket.on('stop', (path) => {
        if(!Object.keys(path2id).includes(path)) return;
        if(path2id[path] !== starter && path2id[path] !== "snunventures") {
            console.log(new Date().toString(), 'Stop denied from', path2id[path]);
            return;
        } 
        console.log(new Date().toString(), 'Stopped from', path2id[path]);
        dates.push(new Date());
        io.emit('update', {
            id: path2id[path],
            starter,
            dates: dates,
        });
    });

    socket.on('continue', (path) => {
        if(!Object.keys(path2id).includes(path)) return;
        if(path2id[path] !== starter && path2id[path] !== "snunventures") {
            console.log(new Date().toString(), 'Stop denied from', path2id[path]);
            return;
        }
        console.log(new Date().toString(), 'Continue from', path2id[path]);
        dates.push(new Date());
        io.emit('update', {
            id: path2id[path],
            starter,
            dates: dates,
        });
    });

    socket.on('initialize', (path) => {
        if(!Object.keys(path2id).includes(path)) return;
        if(path2id[path] !== starter && path2id[path] !== "snunventures") {
            console.log(new Date().toString(), 'Initialize denied from', path2id[path]);
            return;
        } 
        console.log(new Date().toString(), 'Initialized from', path2id[path]);
        starter = "";
        dates = [];
        io.emit('update', {
            id: path2id[path],
            starter,
            dates: dates,
        });
    });

    socket.on('disconnect', () => {
        console.log(new Date().toString(), 'User Disconnected', socket.id);
    });
});

app.set('port', process.env.PORT || 3001);


server.listen(app.get('port'), () => {
    console.log(`Express running → PORT ${server.address().port}`);
});