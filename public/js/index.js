var socket = io(); // initiate a request. Create a connection and keep it open
socket.on('connect', function() {
  console.log('connected to server');
});

socket.on('disconnect', function() {
  console.log('Connection terminated.');
});

// Main DOM elements

var messageList = jQuery('#messages');
var messageInput = jQuery('[name=message]');
var chatForm = jQuery("#message-form");
var locationButton = jQuery('#send-location');

// end of DOM elements

socket.on('newMessage', function(message) {
  let formattedTime = moment(message.createdAt).format('h:mm a');
  var li = jQuery('<li></li>');
  li.text(`${message.from} ${formattedTime}: ${message.text}`);
  messageList.append(li);
});

socket.on('newLocation', function(message) {
  let formattedTime = moment(message.createdAt).format('h:mm a');
  var li = jQuery('<li></li>');
  var a = jQuery('<a target="_blank">My current location</a>');
  li.text(`${message.from} ${formattedTime}: `);
  a.attr('href', message.gmapsURL);
  li.append(a);
  messageList.append(li);
});

chatForm.on('submit', function(e) {
  e.preventDefault();
  var text = messageInput.val();
  if(text) {
    socket.emit('createMessage', {
      from: 'User',
      text
    }, function() {
      messageInput.val(null);
    });
  }
});

locationButton.on('click', function() {
  if(!navigator.geolocation) {
    return alert("Geolocation not supported on your browser");
  }

  locationButton.attr('disabled', 'disabled').text('Sharing your location...');

  navigator.geolocation.getCurrentPosition(function(position) {
    locationButton.removeAttr('disabled').text('Share your location');
    socket.emit('createLocation', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function() {
    locationButton.removeAttr('disabled').text('Share your location');
    alert('Unable to access your location');
  });
});
