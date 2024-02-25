
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { connectToDB } from './config.js';
import { chatModel } from './chat.schema.js';
import { userModel } from './user.schema.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    method: ['GET', 'POST']
  }
});

// Socket.io connection handling
io.on('connection', (socket) => {
  // console.log('New user connected:', socket.id);

  // Handle new user connected event
  socket.on('new-user-connected', async (user) => {
    const newUser = new userModel({
      username: user.username,
      socketid: socket.id,
      imageUrl:user.imageUrl
    });
    await newUser.save();
    const users = await userModel.find();
    socket.emit('profile-image',user.imageUrl)
    io.emit('show-connected-users', { users, socketid: socket.id });
  });

  // Handle load messages event
  socket.on('load-messages', async () => {
    const prevMsg = await chatModel.find();
    const users=await userModel.find();
    socket.emit('prev-msg', prevMsg);
  });

  // Handle new message event
  socket.on('new-message', async (userData) => {
    const newMsg = new chatModel({
      username: userData.username,
      message: userData.usermsg
    });
    await newMsg.save();
    io.emit('new-msg-recieved', newMsg);
  });

  // Handle user is typing event
  socket.on('user-is-typing-io', (username) => {
    io.emit('user-is-typing',username);
  });

  // Handle user stopped typing event
  socket.on('user-stopped-typing-io', (username) => {
    io.emit('user-stopped-typing',username);
  });

  // Handle disconnect event
  socket.on('disconnect', async () => {
    console.log('User disconnected:', socket.id);
    await userModel.deleteOne({ socketid: socket.id });
    const users = await userModel.find();
    io.emit('user-disconnected', { socketid: socket.id, usersLength: users.length });
  });
});

server.listen('3000', () => {
  console.log('Server is listening at port 3000');
  connectToDB();
});
