var socket = io();

socket.on('connect',function(){
  console.log('connected to server');
});

socket.on('newLocation',function(location){
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
  var li = jQuery('<li></li>');
  li.text(`${message.from} : ${message.text}`);
  jQuery('#messages').append(li);
});

jQuery('#message-form').on('submit',function(e){
  e.preventDefault();
  socket.emit('createMessage',{
    from:'User',
    text:jQuery('[name=message]').val()
  },function(){
    jQuery('[name=message]').val('');
  })
});



var locationn = jQuery('#send-location');
locationn.on('click',function(){
  if(!navigator.geolocation){
    return alert('location not supported');
  }
  locationn.attr('disabled','disabled').text('Sending Location...');
  navigator.geolocation.getCurrentPosition(function(position)
  {
    locationn.removeAttr('disabled').text('Send Location');
    socket.emit('createLocation',{
      longitude:position.coords.longitude,
      latitude:position.coords.latitude
    });
  console.log(position);
},function(error){
    locationn.removeAttr('disabled').text('Send Location');
    alert('unable');
    console.log(error);
  });
});
