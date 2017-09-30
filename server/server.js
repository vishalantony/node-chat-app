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
  socket.broadcast.emit('newMessage', generateMessage('Admin', 'A new user has joined!'));
  socket.emit('newMessage', generateMessage('Admin', 'Welcome to my IRC'));

  socket.on('createMessage', (message, myACK) => {
    io.emit('newMessage', generateMessage(message.from, message.text));
    myACK('This is from the server'); // acknowledgement
  });
});


server.listen(process.env.PORT, () => {
  console.log(`Node chat app up and running on port ${process.env.PORT}`);
});
