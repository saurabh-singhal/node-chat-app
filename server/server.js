const path = require('path');
const express = require('express');
const publicPath = path.join(__dirname,'../public');
const http  = require('http');
const socketIO = require('socket.io');

const {Users} = require('./utils/users.js');
const {generateMessage,generateLocation} = require('./utils/message.js');
const {isRealString} = require('./utils/validator.js');

const port = process.env.PORT||3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
app.use(express.static(publicPath));
var users = new Users();

io.on('connection',function(socket){
  console.log('new user connected');

  socket.on('join',function(params,callback){

    if(!isRealString(params.name)|| !isRealString(params.room)){
      return callback('name and room name are required');
    }

    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id,params.name,params.room);
    io.to(params.room).emit('updateUserList',users.getUserList(params.room));
    socket.emit('newMessage',generateMessage('admin','Welcome to chat app'));
    socket.broadcast.to(params.room).emit('newMessage',generateMessage('admin',`${params.name} joined the group`));
    callback();
  });

  socket.on('createMessage',function(reply,callback){
  console.log('reply',reply);
  io.emit('newMessage',generateMessage(reply.from,reply.text));
  callback();
  });

  socket.on('disconnect',()=>{
    var user = users.removeUser(socket.id);
    if(user)
    {
      io.to(user.room).emit('updateUserList',users.getUserList(user.room));
    io.to(user.room).emit('newMessage',generateMessage('Admin',`${user.name} left`));
    }
  });

  socket.on('createLocation',function(location){
    io.emit('newLocation',generateLocation('User',location.longitude,location.latitude));
  });

});
server.listen(port,()=>{
  console.log(`started on port ${port}`);
});
