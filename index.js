const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

randomPos = (min, max, scale) => {
    return Math.floor(Math.random() * (max - min) + min) * scale;
}

const players = {
    prize: {x: randomPos(0, 29, 10), y: randomPos(0, 59, 10)},
};

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/static/index.html');
});

io.on('connection', (socket) => {
    console.log(`user ${socket.id} connected`);

    socket.on('move', (pos) => {
        players[socket.id] = pos;

        io.emit('update', JSON.stringify(players));
    });

    socket.on('point', () => {
        players['prize'] = {x: randomPos(0, 29, 10), y: randomPos(0, 59, 10)};
    });

    socket.on('disconnect', () => {
        delete(players[socket.id]);
        console.log(`user ${socket.id} disconnected`);

        io.emit('update', JSON.stringify(players));
    });

    io.emit('update', JSON.stringify(players));
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});
