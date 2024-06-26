var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var favicon = require('serve-favicon');
var session = require('express-session');
const expressFlash = require('express-flash');

var flash = require('connect-flash');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/userRouter');
var customersRouter = require('./routes/customerRouter');


var app = express();

app.use(favicon(__dirname + '/public/images/favicon.avif'));
app.use(express.static(__dirname + '/public'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret : 'TMIT',
  cookie : {maxAge : 60000},
  saveUninitialized : true,
  resave : true
}));

app.use(flash());
app.use(expressFlash());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/customers', customersRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {

  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};


  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
