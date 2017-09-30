var socket = io(); // initiate a request. Create a connection and keep it open
socket.on('connect', function() {
  console.log('connected to server');
  socket.emit('createMessage', {
    text: 'Hi How are you?',
    from: 'vantony@outlook.com'
  });
});

socket.on('disconnect', function() {
  console.log('Connection terminated.');
});

socket.on('newMessage', function(message) {
  console.log('You have a new message!', message);
});
