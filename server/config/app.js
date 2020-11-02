/* 
File: app.js
Name: Marianne Palmer
Student#: 301122149
Date: Oct 25th 2020
 */

// import 3rd party modules
let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

//* import 3rd party modules for authentication
let session = require('express-session');
let passport =  require('passport');

//* import authentication strategy
let passportLocal = require('passport-local');
let localStrategy = passportLocal.Strategy;

// * import authentication messages
let flash = require('connect-flash');

//* database setup

let mongoose = require('mongoose');
let DB = require('./db');

//* point mongoose to the db URI
mongoose.connect(DB.URI, {useNewUrlParser: true, useUnifiedTopology: true} ); // connects to MongoDB Atlas

//* configuring connection listeners
let mongoDB = mongoose.connection;
mongoDB.on('error', console.error.bind(console, 'Connection Error: ')); // if there is a connection error, this will send an error message to the console
mongoDB.once('open', ()=> {
  console.log('Connected to MongoDB...');
})


let indexRouter = require('../routes/index');
let usersRouter = require('../routes/users');
let businessContactsRouter = require('../routes/business-contacts');

let app = express();

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs'); // express -e

// registering middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, '../../public')));
app.use(express.static(path.join(__dirname, '../../node_modules')));

//* setup express session
app.use(session({
  secret: DB.Secret,
  saveUninitialized: false,
  resave: false
}));

//* initialize flash - maintains error messages
app.use(flash());

//* initialize passport
app.use(passport.initialize());
app.use(passport.session());

//*create a user instance
let user = require('../models/user');
let User = user.Model;

//* implement a user authenitication strategy
passport.use(User.createStrategy());

//* serialize and deserialize (encrypt/decript) user info
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// congiguring routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/business-contacts', businessContactsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', {title: 'Error'});
});

module.exports = app;
