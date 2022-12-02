const express = require('express');

const morgan = require('morgan')
var session = require('express-session');
var cookieParser = require('cookie-parser');
const flash = require('connect-flash');
var cors = require('cors');

const { connectDB } = require('./config/db');
const dbHost = process.env.DB_HOST || 'localhost'
const dbPort = process.env.DB_PORT || 27017
const dbName = process.env.JEST_WORKER_ID === undefined 
  ? process.env.DB_NAME || 'chat' 
  : 'chat_test'
const MONGO_URL = `mongodb://${dbHost}:${dbPort}/${dbName}`

connectDB(MONGO_URL);

const app = express();
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

app.get('/user_test', function(req, res) {
  res.status(200).json({ name: 'john' });
});


const users = require('./router/api/user');
const messages = require('./router/api/message')

app.use("/api/v1/users", users)
app.use("/api/v1/messages", messages)

module.exports = app