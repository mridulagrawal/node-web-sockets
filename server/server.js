const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const publicPath = path.join(__dirname, '../public');
const { generateMessage, generateLocationMessage } = require('./utils/message');
/*
    express internally uses http module to create server, we will be using http here instead of express
    since they are connected we can use http with express to create server
    we are doing all this because websocket use http module 
    io.emit emits event to everyone including itself so 
    we will use socket.broadcast.emit which emits to everyonw but 
    not to it self
*/
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
io.on('connection', (socket) => {
    console.log('user connected');

    socket.emit('newMessage', generateMessage(
        'Admin', 'Welcome to chat app'
    ));

    socket.broadcast.emit('newMessage', generateMessage(
        'Admin', 'New User joined'
    ));

    /* 
    ======= NOT IMPLEMENTED BECAUSE OF JQUERY ===============
    In real scenario user will emit join event to join the room
    Only when the event gets emitted to server the user will be able to see the
    chat app. In params we can pass room name and user info for connecting to specific room
    Callbacks can be used for validations.
    In this event we will use socket.join
    */
    socket.on('joinRoom', (params, callback) => {
        /*
        Below used function are used t o join specifc socket and to leave specific socket
        */
        //  socket.join(params.room);
        //  socket.leave(params.room)

        /*
        Below used function io.to().emit() is like io.emit() but only difference is that it emits 
        to only specific sockets but not to all and sam e goes for socket.broadcast.emit.
        */
        //  io.emit() -> io.to('room').emit()
        //  socket.broadcast.emit() -> socket.broadcast.to('room').emit()

        /* Here after   we can use socket.emit for sending mesasges to specific group */   

    });

    socket.on('createMessage', (message, callback) => {
        io.emit('newMessage', generateMessage(
            message.from,
            message.text
        ));
    })

    socket.on('sendLocationMessage', (message) => {
        io.emit('newLocationMessage', generateLocationMessage(
            message.from, message.latitude, message.longitude
        ));
    })

    socket.on('disconnect', () => {
        console.log('user disconnected');
    })
});

app.use(express.static(publicPath));

server.listen(3000, () => {
    console.log('server started at port: 3000');
})