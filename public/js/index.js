var socket = io();

socket.on('connect',function(req,res){
  console.log('Connected to server');

  socket.emit('createEmail',{           //event creator   :send data to server.js and that will print data to terminal
    to:'bhai bhia',
    from:'bhai bhai'
  });

});

socket.on('disconnect',function(req,res){
  console.log('Disconneted to server');
});

socket.on('newEmail',function(email){         //event listener :recieve data from server and print to client||chrome console.log
  console.log('New email',email);
});
