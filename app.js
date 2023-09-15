if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')

const initializePassport = require('./passport-config')
initializePassport(
  passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
)

const users = []

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
}))

app.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('register.ejs')
})

app.post('/register', checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    users.push({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    })
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

// app.delete('/logout', (req, res) => {
//   req.logOut()
//   res.redirect('/login')
// })

function checkAuthenticated(req, res, next) {
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

app.listen(3000)


// const express = require('express');
// const session = require('express-session')
// const passport = require('passport')
// const LocalStrategy = require('passport-local').Strategy

// const app = express();
// const PORT = 3000;

// app.use(express.urlencoded({extended: false}))

// //Middleware
// app.use(session({
//     secret: "secret",
//     resave: false ,
//     saveUninitialized: true ,
// }))

// app.use(passport.initialize()) // init passport on every route call
// app.use(passport.session())    //allow passport to use "express-session"

// authUser = (user, password, done) => {
//     console.log(`Value of "User" in authUser function ----> ${user}`)         //passport will populate, user = req.body.username
//     console.log(`Value of "Password" in authUser function ----> ${password}`) //passport will popuplate, password = req.body.password

// // Use the "user" and "password" to search the DB and match user/password to authenticate the user
// // 1. If the user not found, done (null, false)
// // 2. If the password does not match, done (null, false)
// // 3. If user found and password match, done (null, user)
    
//     let authenticated_user = { id: 123, name: user} 
// //Let's assume that DB search that user found and password matched for Kyle
    
//     return done (null, authenticated_user ) 
// }

// app.listen(PORT, (error) =>{
//     if(!error){
//         console.log("Server is Successfully Running, and App is listening on port "+ PORT)
//     }
//     else {
//         console.log("Error occurred, server can't start", error);
//     }
// });

// passport.use(new LocalStrategy (authUser))

// passport.serializeUser( (user, done) => { 
//     console.log(`--------> Serialize User`)
//     console.log(user)     

//     done(null, user.id)
  
// // Passport will pass the authenticated_user to serializeUser as "user" 
// // This is the USER object from the done() in auth function
// // Now attach using done (null, user.id) tie this user to the req.session.passport.user = {id: user.id}, 
// // so that it is tied to the session object

// } )

// passport.deserializeUser((id, done) => {
//         console.log("---------> Deserialize Id")
//         console.log(id)

//         done (null, {name: "Kyle", id: 123} )      
  
// // This is the id that is saved in req.session.passport.{ user: "id"} during the serialization
// // use the id to find the user in the DB and get the user object with user details
// // pass the USER object in the done() of the de-serializer
// // this USER object is attached to the "req.user", and can be used anywhere in the App.

// }) 

// //Middleware to see how the params are populated by Passport
// let count = 1

// printData = (req, res, next) => {
//     console.log("\n==============================")
//     console.log(`------------>  ${count++}`)

//     console.log(`req.body.username -------> ${req.body.username}`) 
//     console.log(`req.body.password -------> ${req.body.password}`)

//     console.log(`\n req.session.passport -------> `)
//     console.log(req.session.passport)
  
//     console.log(`\n req.user -------> `) 
//     console.log(req.user) 
  
//     console.log("\n Session and Cookie")
//     console.log(`req.session.id -------> ${req.session.id}`) 
//     console.log(`req.session.cookie -------> `) 
//     console.log(req.session.cookie) 
  
//     console.log("===========================================\n")

//     next()
// }

// app.use(printData) //user printData function as middleware to print populated variables

// app.get('/', (req, res)=>{
//     res.status(200);
//     res.send("Welcome to root URL of Server");
// });

// app.get("/login", (req, res) => {
//     res.render("login.ejs")

// });

// app.post ("/login", passport.authenticate('local', {
//     successRedirect: "/dashboard",
//     failureRedirect: "/login",
// }));

// app.get("/dashboard", (req, res) => {   
//     res.render("dashboard.ejs", {name: req.user.name})
// });