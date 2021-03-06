var socket = io();

$('#show-users-btn').on('click', function() {
  $('.chat-users').toggleClass('chat-users_active');
});
  

function scrollToBottom () {
  var messages = $('#messages');
  var newMessage = messages.children('li:last-child');
  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight);
  }
};

socket.on('connect', function() {
  var params = $.deparam(window.location.search);

  socket.emit('join', params, function(err) {
    if (err) {
      alert(err);
      window.location.href = '/';
    } else {
      console.log('no err')
    }
  });
});

socket.on('disconnect', function() {
  console.log('Disconnected from server');
});

socket.on('updateUserList', function(users) {
  var ul = $('<ul class="chat-users"></ul>');

  users.forEach(function(user) {
    ul.append($('<li class="chat-users__item"></li>').text(user));
  });

  $('#users').html(ul);
});

socket.on('newMessage', function(message) {
  var formattedTime = moment(message.createdAt).format('H:mm');  
  var template = $('#message-template').html();
  
  var html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt: formattedTime
  });

  $('#messages').append(html);
  scrollToBottom();
});

socket.on('newLocationMessage', function(message) {
  var formattedTime = moment(message.createdAt).format('H:mm');
  var template = $('#location-message-template').html();

  var html = Mustache.render(template, {
    url: message.url,
    from: message.from,
    createdAt: formattedTime
  });

  $('#messages').append(html);
  scrollToBottom();
});

$('#message-form').on('submit', function(e) {
  e.preventDefault();

  var messageTextbox = $('[name=message]');

  socket.emit('createMessage', {
    text: messageTextbox.val()
  }, function() {
    messageTextbox.val('');
  });
});

var locationButton = $('#send-location');
$('#send-location').on('click', function() {
  if (!navigator.geolocation) {
    return alert('Геолокация не поддерживается вашим браузером.');
  }

  locationButton.attr('disabled', 'disabled').text('Отправка местоположения');

  navigator.geolocation.getCurrentPosition(function(position) {
    locationButton.removeAttr('disabled').text('Отправить местоположение');
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function() {
    locationButton.removeAttr('disabled').text('Отправить местоположение');
    alert('Не удалось найти местоположение.');
  });
});
