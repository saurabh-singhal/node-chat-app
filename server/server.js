const path = require('path');
const express = require('express');
const publicPath = path.join(__dirname,'../public');
const http  = require('http');
const socketIO = require('socket.io');

const port = process.env.PORT||3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
app.use(express.static(publicPath));

io.on('connection',function(socket){
  console.log('new user connected');

  socket.on('disconnect',function(req,res){
    console.log('Disconnected from client');
  });

// socket.emit('arrived',{
//   from:'baap',
//   text:'hello'
// });
//
// socket.on('reply',function(reply){
//   console.log('reply',reply);
// });


socket.on('createEmail',function(newEmail){          //event listener    :recieve data from client and print to server/terminal
  console.log('email',newEmail);
});

  socket.emit('newEmail',{            //event creator   :send data to client and that will print that to clint terminal
    text:'chitti aayi h',
    ok:'ok'
  });
});

server.listen(port,()=>{
  console.log(`started on port ${port}`);
});
