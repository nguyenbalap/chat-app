const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { connectDB } = require('./config/db');
const { Server } = require("socket.io");
const MONGO_URL = "mongodb://localhost:27017/chat";
var cors = require('cors');
app.use(cors());

app.use(express.json());

connectDB(MONGO_URL);
const users = require('./router/api/user');
const messages = require('./router/api/message')

app.use("/api/v1/users", users)
app.use("/api/v1/messages", messages)


const io = new Server(server, {
  cors: {
      origin: "*"
  }
});

io.on('connection', (socket) => {
    console.log("connection", socket.id)
    console.log("================================================")
    socket.on('chat message', (res) => {
        io.emit('server response', res)
    })

    socket.on('disconnect', () => {
        console.log('user disconnected');
        io.emit("user disconnected", {socketId: socket.id})
        io.emit('response login', true)
    });

    socket.on('login', res => {
      io.emit('response login', res)
    })
});

server.listen(3010, () => {
  console.log('listening on *:3010');
});