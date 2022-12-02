const app = require('./index');
const http = require('http');
const { Server } = require("socket.io");
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*"
    }
  });
  
io.on('connection', (socket) => {
    console.log("connection", socket.id)
    console.log("================================================")
    socket.on('chat message', (res) => {
    io.emit(`server response ${res.receiver}`, res)
    io.emit(`server response ${res.sender}`, res)
    })

    socket.on('disconnect', () => {
        console.log('user disconnected');
        io.emit("user disconnected")
        io.emit('response login', true)
    });

    socket.on('login', () => {
    io.emit('response login')
    });

    socket.on('logout', () => {
    io.emit('response logout')
    });
});



server.listen(3010, () => {
    console.log('listening on *:3010');
  });

  