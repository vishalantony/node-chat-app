var socket = io(); // initiate a request. Create a connection and keep it open

function scrollToBottom() {
  // selectors
  let messages = jQuery("#messages");
  let newMessage = messages.children('li:last-child');
  // heights
  let clientHeight = messages.prop('clientHeight');
  let scrollTop = messages.prop('scrollTop');
  let scrollHeight = messages.prop('scrollHeight');
  let newMessageHeight = newMessage.innerHeight();
  let lastMessageHeight = newMessage.prev().innerHeight();

  if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight);
  }
}


socket.on('connect', function() {
  var params = jQuery.deparam(window.location.search);

  socket.emit('join', params, function(error) {
    if(error) {
      window.location.href = "/";
      alert(error);
    }
  });
});

socket.on('disconnect', function() {
  console.log('Connection terminated.');
});

socket.on('updateUserList', function(users) {
  var ol = jQuery('<ol></ol>');
  users.forEach(function (user) {
    ol.append(jQuery('<li></li>').text(user));
  });
  jQuery('#users').html(ol);
});

// Main DOM elements

var messageList = jQuery('#messages');
var messageInput = jQuery('[name=message]');
var chatForm = jQuery("#message-form");
var locationButton = jQuery('#send-location');

// end of DOM elements

socket.on('newMessage', function(message) {
  let formattedTime = moment(message.createdAt).format('h:mm a');
  var template = jQuery('#message-template').html();
  var html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt: formattedTime
  });

  jQuery('#messages').append(html);
  scrollToBottom();
});

socket.on('newLocation', function(message) {
  let formattedTime = moment(message.createdAt).format("h:mm a");
  var template = jQuery('#location-message-template').html();
  var html = Mustache.render(template, {
    from: message.from,
    createdAt: formattedTime,
    url: message.gmapsURL
  });
  jQuery('#messages').append(html);
  scrollToBottom();
});

chatForm.on('submit', function(e) {
  e.preventDefault();
  var text = messageInput.val();
  if(text) {
    socket.emit('createMessage', {
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
