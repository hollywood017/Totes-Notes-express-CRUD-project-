const express      = require('express');
const path         = require('path');
const favicon      = require('serve-favicon');
const logger       = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');
const layouts      = require('express-ejs-layouts');
const mongoose     = require('mongoose');
const passport     = require('passport');
const session      = require("express-session");

const app = express();

require('./config/passport-config.js');

mongoose.connect('mongodb://localhost/express-users');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// default value for title local
app.locals.title = 'Totes Notes';

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(layouts);
app.use(session( {
  secret: "best-dubstep-ever-invented",
  resave: true,
  saveUninitialized: true
}));

//PASSPORT middlewares here-------------------------------------------------

app.use(passport.initialize());
app.use(passport.session());

//PASSPORT middlewares above------------------------------------------------



//MIDDLESWARES--------------------------------------------------------------

app.use((req, res, next) => {

  if(req.user){
    res.locals.currentUser = req.user;
  }
  next();
});

//MIDDLESWARES go above-----------------------------------------------------



//ROUTES GO HERE-------------------------------------------------------------
const index = require('./routes/index');
app.use('/', index);

const myAuthRoutes = require('./routes/auth-routes.js');
app.use('/', myAuthRoutes);

const myNoteRoutes = require('./routes/note-routes.js');
app.use('/', myNoteRoutes);

//ROUTES GO ABOVE-------------------------------------------------------------

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
