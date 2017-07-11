var socket = io();

socket.on('connect',function(){
  console.log('connected to server');

// socket.emit('createMessage',{
//   from:'saurabh',
//   text:'hello papa'
// });

});

socket.on('disconnect',function(){
  console.log('disconnected from server');
});

socket.on('newMessage',function(message){
  console.log('message aaya h',message);
});
