const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');
const publicPath = path.join(__dirname, '../public');
const config = require(path.join(__dirname, 'config', 'config.js'));

const { generateMessage } = require(path.join(__dirname, 'utils', 'message'));

var app = express();

// var server = http.createServer((req, res) => {
//
// });
// instead we can just pass in app variable :
var server = http.createServer(app); // http is used by express

var io = socketIO(server);
app.use(express.static(publicPath));

io.on('connection', (socket) => {
  socket.broadcast.emit('newMessage', generateMessage('A new user has joined!', 'Admin'));
  socket.emit('newMessage', generateMessage('Welcome to my IRC', 'Admin'));

  socket.on('createMessage', (message) => {
    io.emit('newMessage', generateMessage(message.text, message.from));
  })
});


server.listen(process.env.PORT, () => {
  console.log(`Node chat app up and running on port ${process.env.PORT}`);
});
