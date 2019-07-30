var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
let dbconnect=require('./dbconfig/db-connect');

var session=require('express-session');
var passport=require('passport');
var flash=require('connect-flash');






var indexRouter = require('./routes/index');



var app = express();




/// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret:'mysecret',
    resave:false,
    saveUninitialized:false
}))






/* GET users listing. */



app.use(flash())
app.use(passport.initialize())
app.use(passport.session())

app.use('/', indexRouter);

require('./config/passport');

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
dbconnect.connect(function (error) {
    if(error){
        console.log("Unable to connect database");
        process.exit(1);
    }
    else{
        console.log('userdata Database connected successfully.......')
    }
});
module.exports = app;

