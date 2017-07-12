const path = require('path');
const express = require('express');
const publicPath = path.join(__dirname,'../public');
const http  = require('http');
const socketIO = require('socket.io');

const {generateMessage,generateLocation} = require('./utils/message.js');

const port = process.env.PORT||3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
app.use(express.static(publicPath));

io.on('connection',function(socket){
  console.log('new user connected');

  socket.emit('newMessage',generateMessage('admin','Welcome to chat app'));
  socket.broadcast.emit('newMessage',generateMessage('admin','New user joined the group'));

  socket.on('createMessage',function(reply,callback){
  console.log('reply',reply);
  io.emit('newMessage',generateMessage(reply.from,reply.text));
  // socket.broadcast.emit('newMessage',generateMessage(reply.from,reply.text));
  callback('okay');
  });

  socket.on('disconnect',function(req,res){
    console.log('Disconnected from client');
  });

  socket.on('createLocation',function(location){
    socket.emit('newLocation',generateLocation('Admin',location.longitude,location.latitude));
  });

});
server.listen(port,()=>{
  console.log(`started on port ${port}`);
});
