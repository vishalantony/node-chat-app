const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');
const publicPath = path.join(__dirname, '../public');
const config = require(path.join(__dirname, 'config', 'config.js'));

const { generateMessage, generateLocationMessage } = require(path.join(__dirname, 'utils', 'message'));
const { isRealString } = require(path.join(__dirname, 'utils', 'validation'));
const { Users } = require(path.join(__dirname, 'utils', 'users'));

var app = express();
var server = http.createServer(app); // http is used by express
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  socket.on('join', (params, acknowledgement) => {
    if(!isRealString(params.name) || !isRealString(params.room)) {
      return acknowledgement('Name and room name are required');
    }
    socket.join(params.room); // join the room
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);

    io.to(params.room).emit('updateUserList', users.getUserList(params.room));

    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined the room.`));
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to my IRC'));
    acknowledgement();
  });

  socket.on('createMessage', (message, myACK) => {
    var user = users.getUser(socket.id);
    if(user && isRealString(message.text)) {
      io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
    }
    myACK('This is from the server'); // acknowledgement
  });

  socket.on('createLocation', (coords) => {
    var user = users.getUser(socket.id);
    if(user) {
      io.to(user.room).emit('newLocation', generateLocationMessage(user.name, coords.latitude, coords.longitude));
    }
  });

  socket.on('disconnect', () => {
    var user = users.removeUser(socket.id);
    if(user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left the chat room.`));
    }
  });
});


server.listen(process.env.PORT, () => {
  console.log(`Node chat app up and running on port ${process.env.PORT}`);
});
