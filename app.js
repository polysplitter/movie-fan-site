var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// =============PASSPORT FILES==============/
const session = require('express-session')
const passport = require('passport')
const GitHubStrategy = require('passport-github').Strategy
// =========================================/

const helmet = require('helmet')

var indexRouter = require('./routes/index');

var app = express();

app.use(helmet())

// ==============PASSPORT CONFIG============================
app.use(session({
  secret: 'batman',
  resave: false,
  saveUninitialized: true,
  // this by default is true and will block req.user from getting the information.
  //cookie: { secure: true }
}))

app.use(passport.initialize())

app.use(passport.session())

const passportConfig =  require('./config')
passport.use(new GitHubStrategy(passportConfig,
  function(accessToken, refreshToken, profile, cb) {
    return cb(null, profile)
  }
))

passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((user, done) => {
  done(null, user)
})
// =========================================================

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

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
  res.render('error');
});

module.exports = app;
