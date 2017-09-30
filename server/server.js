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
  console.log('New user connected');

  socket.on('createMessage', (message) => {
    console.log('New message from', message.from);
    message = _.pick(message, ["text", "from"]);
    message.createdAt = new Date();
    io.emit('newMessage', message);
  })
});


server.listen(process.env.PORT, () => {
  console.log(`Node chat app up and running on port ${process.env.PORT}`);
});
