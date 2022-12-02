const express = require('express');
const app = express();
const http = require('http');

const morgan = require('morgan')
var session = require('express-session');
var cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const { engine } =  require('express-handlebars');
const passport = require('passport');
const bcrypt = require('bcrypt');
const passportLocal = require('passport-local')

const server = http.createServer(app);
const { connectDB } = require('./config/db');
const { Server } = require("socket.io");

const Admin = require('./model/Admin');

const dbHost = process.env.DB_HOST || 'localhost'
const dbPort = process.env.DB_PORT || 27017
const dbName = process.env.DB_NAME || 'chat'
const MONGO_URL = `mongodb://${dbHost}:${dbPort}/${dbName}`
var cors = require('cors');
app.use(cors());

// enable body parser
app.use(express.json());

app.use(express.urlencoded({ extended: false }))

// enable morgan logging
app.use(morgan('dev'))
// enalbe cookie middleware
app.use(cookieParser('secret'));
// enalbe session middleware
app.use(session({ cookie: { maxAge: 60000 }}));
// set up flash middleware(require session, cookie)
app.use(flash());
// set up passport
app.use(passport.initialize());
app.use(passport.session());

const LocalStrategy = passportLocal.Strategy

passport.use(new LocalStrategy({
    usernameField: 'email',
},
    async function(email, password, done) {
        try {
            const admin = await Admin.findOne({ email: email }).select('+password');
            if (!admin) { return done(null, false); }
            if (!bcrypt.compareSync(password, admin.password)) { return done(null, false); }
            return done(null, admin);
        }
        catch (e) {
            return done(e)
        }
        
    }
));

passport.serializeUser(function(admin, done) {
    done(null, admin);
});
  
passport.deserializeUser(function(id, done) {
    Admin.findById(id, function (err, admin) {
        done(err, admin);
    });
});

function isAuthenticated (req, res, next) {
    if (!req.isAuthenticated()) {
      return res.redirect('/')
    }
    return next()
}

app.engine('.hbs', engine({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.set('views', './views');

app.get('/' ,(req, res) => {
    res.render('home', {layout: false, title: "Home"})
})

app.post('/login', passport.authenticate('local', { failureRedirect: '/error' }),(req, res) => {
    req.session.save()
    res.redirect("/home")
})

app.post('/register', async (req, res) => {
    try {
        if (!req.body.email || !req.body.email.trim().length) {
          return res.status(422).json({
            message: 'Email is required!'
          })
        }

        if (!req.body.name || !req.body.name.trim().length) {
            return res.status(422).json({
              message: 'Name is required!'
            })
          }
  
        if (!req.body.password || !req.body.password.trim().length) {
          return res.status(422).json({
            message: 'Password is required!'
          })
        }
        const admin = new Admin({
          email: req.body.email,
          name: req.body.name,
          password: req.body.password
        })
        await admin.save()
        req.flash('success_message', 'Successfully created account!')
  
        return res.redirect('/')
      } catch (error) {
        return res.status(500).send('Server error')
      }
})

app.get('/home', isAuthenticated,(req, res) => {
    res.json({rq: req.user, ss: req.session})
    // res.json({oke: req.session})
})

app.all('/flash', function(req, res){
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

server.listen(3010, () => {
  console.log('listening on *:3010');
});