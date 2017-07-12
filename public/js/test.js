var socket = io();

socket.on('connect',function(){
  console.log('connected to server');
});

socket.on('newLocation',function(location){
  console.log('hello');
  var li = jQuery('<li></li>');
  var a = jQuery('<a target="_blank">My current location</a>');
  li.text(`${location.from}: `);
  a.attr('href',location.url);
  li.append(a);
  jQuery('#messages').append(li);
});

socket.on('disconnect',function(){
  console.log('disconnected from server');
});

socket.on('newMessage',function(message){
  console.log('message aaya h',message);
  var li = jQuery('<li></li>');
  li.text(`${message.from} : ${message.text}`);
  jQuery('#messages').append(li);
});

jQuery('#message-form').on('submit',function(e){
  e.preventDefault();
  socket.emit('createMessage',{
    from:'User',
    text:jQuery('[name=message]').val()
  },function(data){
    console.log('form se aa raha h message',data);
  })
});

var locationn = jQuery('#send-location');
locationn.on('click',function(){
  if(!navigator.geolocation){
    return alert('location not supported');
  }
  navigator.geolocation.getCurrentPosition(function(position)
  {
    socket.emit('createLocation',{
      longitude:position.coords.longitude,
      latitude:position.coords.latitude
    });
  console.log(position);
  },function(error){
    alert('unable');
    console.log(error);
  });
});
