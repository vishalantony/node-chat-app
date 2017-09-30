jQuery.getScript('/js/constants/index.js');

var socket = io(); // initiate a request. Create a connection and keep it open
socket.on('connect', function() {
  console.log('connected to server');
});

socket.on('disconnect', function() {
  console.log('Connection terminated.');
});

socket.on('newMessage', function(message) {
  var li = jQuery('<li></li>');
  li.text(`${message.from}: ${message.text}`);
  jQuery('#messages').append(li);
});

jQuery("#message-form").on('submit', function(e) {
  e.preventDefault();

  socket.emit('createMessage', {
    from: 'User',
    text: jQuery('[name=message]').val()
  }, function() {

  });
  jQuery('[name=message]').val('');
  jQuery('[name=message]').focus();
});

jQuery('[name=message]').keypress(function(e) {
  if(e.which == ENTER_KEY_VALUE) {
    jQuery("#message-form").submit();
  }
});
