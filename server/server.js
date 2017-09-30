const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');
const _ = require('lodash');
const publicPath = path.join(__dirname, '../public');
const config = require(path.join(__dirname, 'config', 'config.js'));

var app = express();

// var server = http.createServer((req, res) => {
//
// });
// instead we can just pass in app variable :
var server = http.createServer(app); // http is used by express

var io = socketIO(server);
app.use(express.static(publicPath));

io.on('connection', (socket) => {

  socket.broadcast.emit('newMessage', {
    text: 'A new user has joined!!',
    from: 'Admin'
  });
  socket.emit('newMessage', {
    text: 'Welcome to my IRC',
    from: 'Admin'
  });

  socket.on('createMessage', (message) => {
    message = _.pick(message, ["text", "from"]);
    message.createdAt = new Date().getTime();
    socket.broadcast.emit('newMessage', message);
  })
});


server.listen(process.env.PORT, () => {
  console.log(`Node chat app up and running on port ${process.env.PORT}`);
});
