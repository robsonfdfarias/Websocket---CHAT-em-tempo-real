const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server);

app.get('/', (req, res) => {
    // res.send('<h1>Hello world</h1>');
    // console.log(__dirname)
    res.sendFile(join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
    console.log("a user connected. Id="+socket.id);
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
        console.log('User: '+msg.user)
        console.log('message: '+msg.msg)
    });
    socket.on('disconnect', () => {
        console.log('user disconnected. Id='+socket.id)
    });
})

server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
})