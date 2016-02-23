var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
var passport = require('passport')

//Eneble JSX transpiling for server side react
// require("node-jsx").install();
require('babel-core/register')

var FacebookStrategy = require('passport-facebook').Strategy;
// facebook auth middleware
passport.use(new FacebookStrategy({
    clientID: "980809698642161",
    clientSecret: "0c70b108f6e604e0c9763e78809861b5",
    callbackURL: "http://localhost:3000/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    console.log('AUTH:', accessToken, profile)
  }
));


var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(favicon(path.join(__dirname, 'public', 'img', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({ limit: '5mb' }));
// app.use(bodyParser.raw({limit: '5mb'}));
// app.use(bodyParser.urlencoded({ limit: '5mb' }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/api', require('./routes/api.js'));
app.use('/', require('./routes/index'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    console.log('Dev err handler says:', err, res.body)
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  console.log('Prod err handler says:', err)
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
