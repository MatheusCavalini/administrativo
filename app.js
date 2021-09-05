require('dotenv').config()
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var formidable = require('formidable');

/*Session usuário*/
const redis = require('redis')
var session = require('express-session')
var RedisStore = require('connect-redis')(session);
let redisClient = redis.createClient()

var app = express();

 app.use(function(req, res, next){

   if( req.url == "/admin/usuarios" && req.method === "POST"){
     var form = formidable.IncomingForm();
     form.parse(req, function(err, fields){
       req.fields = fields

       next()
     })
   }else{
     next()
   }
 })

app.use(session({
  store: new RedisStore({
    client: redisClient,
    host:'localhost',
    port:6379
  }),
  secret: process.env.SECRET_SESSION,
  resave:true,
  saveUninitialized:true
}))

var adminRouter = require('./routes/admin');
var suggestionRouter = require('./routes/suggestion');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res, next)=>{
  res.redirect('/admin')
})

app.use('/admin', adminRouter);
app.use('/suggestion', suggestionRouter);

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
