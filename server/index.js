const express = require('express');
const app = express();
const http = require('http');

const morgan = require('morgan')
var session = require('express-session');
var cookieParser = require('cookie-parser');
const flash = require('connect-flash');

const server = http.createServer(app);
const { connectDB } = require('./config/db');
const { Server } = require("socket.io");
const dbHost = process.env.DB_HOST || 'localhost'
const dbPort = process.env.DB_PORT || 27017
const dbName = process.env.DB_NAME || 'chat'
const MONGO_URL = `mongodb://${dbHost}:${dbPort}/${dbName}`
var cors = require('cors');
app.use(cors());

// enable body parser
app.use(express.json());
// enable morgan logging
app.use(morgan('dev'))
// enalbe cookie middleware
app.use(cookieParser('secret'));
// enalbe session middleware
app.use(session({ cookie: { maxAge: 60000 }, resave: false, saveUninitialized: true, secret: "secret" }));
// set up flash middleware(require session, cookie)
app.use(flash());

app.all('/', function(req, res){
  req.flash('test', 'it worked');
  res.redirect('/test')
});

app.all('/test', function(req, res){
  if (req.session.views) {
    req.session.views++
    // res.setHeader('Content-Type', 'text/html')
    res.write('<p>views: ' + req.session.views + '</p>')
    res.write('<p>expires in: ' + (req.session.cookie.maxAge / 1000) + 's</p>')
    res.end()
  } else {
    req.session.views = 1
    res.end('welcome to the session demo. refresh!')
  }
  // res.send(JSON.stringify(req.flash('test')));
});

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