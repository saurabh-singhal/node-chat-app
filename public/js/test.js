var socket = io();

socket.on('connect',function(){
  console.log('connected to server');

});

socket.on('con',function(docs){
  console.log(docs);
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
