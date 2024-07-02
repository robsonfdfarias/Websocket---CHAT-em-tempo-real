'use strict';
const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');
const {readFile} = require('fs');
const fs = require('fs');

const shell = require('shelljs'); //para executar comandos shell

const app = express();
const server = createServer(app);
const io = new Server(server);

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
    console.log("a user connected. Id="+socket.id);
    const keyNameChat = 'chat message';
    const fileName = keyNameChat.replace(' ', '-')+'.txt';
    console.log(fileName)
    if(shell.test('-f', fileName)){
        console.log('o arquivo existe');
        let chama = 0;
        if(chama<1){
            readFile2(fileName, socket, keyNameChat)
            chama++;
        }
    }else{
        console.log('o arquivo NÃO existe');
    }
    socket.on(keyNameChat, (msg) => {
        io.emit(keyNameChat, msg);
        shell.echo([[msg.user, msg.msg]]).toEnd(fileName);
        console.log('User: '+msg.user)
        console.log('message: '+msg.msg)
    });
    socket.on('disconnect', () => {
        console.log('user disconnected. Id='+socket.id)
    });
})

const readFile2 = (file, socket, keyNameChat) => {
    fs.readFile(file, 'utf8', (err, data) => {
        if(err){
            console.log(err)
            return;
        }
        var ar = []
        const array = data.split('\n');
        array.forEach(function(linha, index){
            console.log(linha)
            ar.push(linha)
        })
        console.log('**********************************')
        console.log(data)
        socket.emit(keyNameChat, ar);
    })
}

server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
})
