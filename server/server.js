//installed npm modules
const path = require('path');
const express = require('express');
const publicPath = path.join(__dirname,'../public');
const http  = require('http');
const socketIO = require('socket.io');

//user-defined modules(self-created)
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

//Recieve User's Data from client(chat.js)
  socket.on('join',function(params,callback)
  {
    if(!isRealString(params.name)|| !isRealString(params.room))
    {
      return callback('name and room name are required');
    }
    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id,params.name,params.room);
    io.to(params.room).emit('updateUserList',users.getUserList(params.room));
    socket.emit('newMessage',generateMessage('Admin','Welcome to chat app'));
    socket.broadcast.to(params.room).emit('newMessage',generateMessage('admin',`${params.name} joined the group`));
    callback();
  });


//Recieve message Data from client(chat.js)
//Send it back to clients(ALL) for printing by creating an event(newMessage)
  socket.on('createMessage',function(reply,callback){
    var user = users.getUser(socket.id);
    if(user && isRealString(reply.text))
    {
      io.to(user.room).emit('newMessage',generateMessage(user.name,reply.text));
    }
    callback();
  });


//Recieve Location from client
//send it back to client(ALL) for printing by creating an event(newLocation)
  socket.on('createLocation',function(location){
    var user = users.getUser(socket.id);
    if(user)
    {
      io.to(user.room).emit('newLocation',generateLocation(user.name,location.longitude,location.latitude));
    }
  });

//disconnect listener
//Remove user as they close the tab
  socket.on('disconnect',()=>{
    var user = users.removeUser(socket.id);
    if(user)
    {
      io.to(user.room).emit('updateUserList',users.getUserList(user.room));
    io.to(user.room).emit('newMessage',generateMessage('Admin',`${user.name} left`));
    }
  });

});
server.listen(port,()=>{
  console.log(`started on port ${port}`);
});
