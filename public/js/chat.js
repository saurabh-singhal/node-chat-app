var socket = io();

//code for auto-scrolling
function scrollToBottom () {
  // Selectors
  var messages = jQuery('#messages');
  var newMessage = messages.children('li:last-child')
  // Heights
  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight);
  }
}

//connects to client side server
//Gets Data by parsing location.search object and send it to server by creating join event
socket.on('connect',function(){
  var params = jQuery.deparam(window.location.search);
  socket.emit('join',params,function(error){
    if(error)
    {
      alert(error);
      window.location.href = '/';
    }
    else
    {
      console.log('No error');
    }
  });
});


//Recieve Data from server
//send it to chat.html for printing
socket.on('updateUserList',function(users){
  var ol = jQuery('<ol></ol>');

  users.forEach(function(user){
    ol.append(jQuery('<li></li>').text(user));
  })
  jQuery('#users').html(ol);
})

//Recieve Data from server by listening to an event (newLocation)
//Send Data to chat.html for printing by rendering it to mustache template
socket.on('newLocation',function(location){
var formatTime = moment(location.createdAt).format('h:mm a');
var template = jQuery('#location-template-message').html();
var html = Mustache.render(template,{
  from:location.from,
  time:formatTime,
  url:location.url
});
jQuery('#messages').append(html);
scrollToBottom();
});

//Recieve Data from server by listening to an event (newMessage)
//Send Data to chat.html for printing by rendering mustache template
socket.on('newMessage',function(message){
var formatTime = moment(message.createdAt).format('h:mm a');
var template = jQuery('#template-message').html();
var html = Mustache.render(template,{
  text:message.text,
  time:formatTime,
  from:message.from
});
jQuery('#messages').append(html);
scrollToBottom();
});


//Gets message Data from chat.html by id
//sending message data to server by creating an event(createMessage)
jQuery('#message-form').on('submit',function(e)
{
  e.preventDefault();
  socket.emit('createMessage',{
    text:jQuery('[name=message]').val()
  },function(){
    jQuery('[name=message]').val('');           //empty message box after sending message
  });
});


//Get user location by this (getCurrentPosition) function
//sending Data to server by creating this event (createLocation)
var locationn = jQuery('#send-location');
locationn.on('click',function(){
  if(!navigator.geolocation)
  {
    return alert('Geolocation not supported by your browser/device');
  }
  locationn.attr('disabled','disabled').text('Sending Location...');   //Disable location button while sending request
  navigator.geolocation.getCurrentPosition(function(position)
  {
    locationn.removeAttr('disabled').text('Send Location');
    socket.emit('createLocation',{
      longitude:position.coords.longitude,
      latitude:position.coords.latitude
    });
  },function(error){
    locationn.removeAttr('disabled').text('Send Location');
    alert('unable');
    console.log(error);
  });
});

//Disconnecting listener
socket.on('disconnect',function(){
  console.log('disconnected from server');
});
