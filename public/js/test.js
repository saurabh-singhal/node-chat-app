var socket = io();

socket.on('connect',function(){
  console.log('connected to server');

socket.emit('reply',{
  from:'saurabh',
  to:'papa'
});

});

socket.on('disconnect',function(){
  console.log('disconnected from server');
});

socket.on('arrived',function(message){
  console.log('message aaya h',message);
});
