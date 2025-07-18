// socket.js
import express from 'express';
import http from 'http';
import { Server as SocketIO } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new SocketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  socket.on('joinRoom', ({ username, room }) => {
    socket.join(room);
    socket.username = username;
    socket.room = room;

    socket.broadcast.to(room).emit('userJoined', username);
    socket.emit('message', { username: 'Admin', text: `Welcome to the room ${room}, ${username}!` });
  });

  socket.on('chatMessage', (msg) => {
    io.to(socket.room).emit('message', { username: socket.username, text: msg });
  });

  socket.on('leaveRoom', () => {
    socket.leave(socket.room);
    socket.broadcast.to(socket.room).emit('userLeft', socket.username);
  });

  socket.on('disconnect', () => {
    if (socket.room) {
      socket.broadcast.to(socket.room).emit('userLeft', socket.username);
    }
  });
});

export { app, server };
