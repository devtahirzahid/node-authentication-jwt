if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const mongoose = require("mongoose");
const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const initializePassport = require('./passport_configs/passport_config')
const UserService = require("./src/user");

const PORT = 3000;
const db = "mongodb://localhost:27017/auth";

app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

mongoose.connect(db, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

initializePassport(
  passport,
  async (email) => {
    try {
      const user = await UserService.findByEmail(email);
      return user;
    } catch (error) {
      console.error('Error finding user:', error);
      return null;
    }
  },
  (id) => {
    return UserService.getUserById(user);
  }
)

app.get('/', checkAuthenticated, (req, res) => {
  res.render('dashboard.ejs', { name: req.user.name })
})

app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login.ejs')
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}));

app.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('register.ejs')
})

app.post('/register', checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    UserService.addUser(req.body.name, req.body.email, hashedPassword)

    res.redirect('/login')
  } catch {
    res.redirect('/register')
  }
})

app.delete('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

function checkAuthenticated(req, res, next) {
  debugger;
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  next()
}

app.listen(PORT, (error) =>{
    if(!error){
        console.log("Server is Successfully Running, and App is listening on port "+ PORT)
    }
    else {
        console.log("Error occurred, server can't start", error);
    }
});